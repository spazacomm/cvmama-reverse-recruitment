<script>
    import { user, supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { onMount, onDestroy } from 'svelte';
    
    let profile;
    let loading = true;
    let candidateData = null;
    let conversations = [];
    let currentConversation = null;
    let messages = [];
    let newMessage = '';
    let searchQuery = '';
    let messagesContainer;
    let realtimeChannel;
    let uploadingFile = false;
    
    const unsubscribe = user.subscribe(value => profile = value);
    
    onMount(async () => {
        if (!profile || profile.role !== 'candidate') {
            goto('/login');
            return;
        }
        
        await loadCandidateData();
        await loadConversations();
        setupRealtimeSubscription();
        
        loading = false;
    });
    
    onDestroy(() => {
        if (realtimeChannel) {
            supabase.removeChannel(realtimeChannel);
        }
    });
    
    async function loadCandidateData() {
        try {
            const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            
            const { data, error } = await supabase
                .from('candidates')
                .select('id, full_name, first_name, user_id')
                .eq('user_id', authUser.id)
                .single();
            
            if (error) throw error;
            candidateData = data;
            
        } catch (error) {
            console.error('Error loading candidate data:', error);
        }
    }
    
    async function loadConversations() {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            
            // Get all matches with agents
            const { data: matches, error: matchError } = await supabase
                .from('matches')
                .select(`
                    id,
                    agent:agent_id(id, full_name, avatar_url, user_id),
                    status
                `)
                .eq('candidate_id', candidateData.id)
                .eq('status', 'active');
            
            if (matchError) throw matchError;
            
            // For each match, get the latest message and unread count
            const conversationsWithMessages = await Promise.all(
                matches.map(async (match) => {
                    const { data: latestMessage } = await supabase
                        .from('messages')
                        .select('content, created_at, sender_id')
                        .eq('match_id', match.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();
                    
                    const { count: unreadCount } = await supabase
                        .from('messages')
                        .select('*', { count: 'exact', head: true })
                        .eq('match_id', match.id)
                        .eq('recipient_id', authUser.id)
                        .eq('is_read', false);
                    
                    return {
                        matchId: match.id,
                        agent: match.agent,
                        latestMessage: latestMessage?.content || 'No messages yet',
                        latestMessageTime: latestMessage?.created_at || null,
                        unreadCount: unreadCount || 0,
                        isSentByMe: latestMessage?.sender_id === authUser.id
                    };
                })
            );
            
            conversations = conversationsWithMessages.sort((a, b) => {
                if (!a.latestMessageTime) return 1;
                if (!b.latestMessageTime) return -1;
                return new Date(b.latestMessageTime) - new Date(a.latestMessageTime);
            });
            
            // Auto-select first conversation if exists
            if (conversations.length > 0 && !currentConversation) {
                selectConversation(conversations[0]);
            }
            
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    }
    
    async function selectConversation(conversation) {
        currentConversation = conversation;
        await loadMessages(conversation.matchId);
        await markMessagesAsRead(conversation.matchId);
    }
    
    async function loadMessages(matchId) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:sender_id(full_name, avatar_url),
                    attachments:message_attachments(
                        id,
                        document:document_id(
                            id,
                            file_name,
                            file_type,
                            file_path,
                            file_size
                        )
                    )
                `)
                .eq('match_id', matchId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            messages = data || [];
            
            // Scroll to bottom after messages load
            setTimeout(scrollToBottom, 100);
            
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }
    
    async function markMessagesAsRead(matchId) {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            
            const { error } = await supabase
                .from('messages')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('match_id', matchId)
                .eq('recipient_id', authUser.id)
                .eq('is_read', false);
            
            if (error) throw error;
            
            // Update conversation unread count
            if (currentConversation) {
                currentConversation.unreadCount = 0;
                conversations = conversations;
            }
            
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    }
    
    async function sendMessage() {
        if (!newMessage.trim() || !currentConversation) return;
        
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    match_id: currentConversation.matchId,
                    sender_id: authUser.id,
                    recipient_id: currentConversation.agent.user_id,
                    content: newMessage.trim(),
                    message_type: 'text'
                })
                .select(`
                    *,
                    sender:sender_id(full_name, avatar_url)
                `)
                .single();
            
            if (error) throw error;
            
            // Add message to local state
            messages = [...messages, data];
            newMessage = '';
            
            // Update conversation latest message
            const convIndex = conversations.findIndex(c => c.matchId === currentConversation.matchId);
            if (convIndex !== -1) {
                conversations[convIndex].latestMessage = data.content;
                conversations[convIndex].latestMessageTime = data.created_at;
                conversations[convIndex].isSentByMe = true;
                conversations = conversations;
            }
            
            scrollToBottom();
            
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
    
    async function handleFileUpload(event) {
        const file = event.target.files?.[0];
        if (!file || !currentConversation) return;
        
        uploadingFile = true;
        
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            
            // Upload file to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${file.name}`;
            const filePath = `candidates/${candidateData.id}/messages/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);
            
            if (uploadError) throw uploadError;
            
            // Create document record
            const { data: document, error: docError } = await supabase
                .from('documents')
                .insert({
                    candidate_id: candidateData.id,
                    uploaded_by: authUser.id,
                    context: 'message',
                    file_name: file.name,
                    file_path: filePath,
                    file_type: file.type,
                    file_size: file.size,
                    document_type: 'other',
                    is_shared_with_agent: true,
                    shared_at: new Date().toISOString()
                })
                .select()
                .single();
            
            if (docError) throw docError;
            
            // Create message with attachment
            const { data: message, error: msgError } = await supabase
                .from('messages')
                .insert({
                    match_id: currentConversation.matchId,
                    sender_id: authUser.id,
                    recipient_id: currentConversation.agent.user_id,
                    content: `Sent a file: ${file.name}`,
                    message_type: 'text',
                    has_attachments: true,
                    attachment_count: 1
                })
                .select(`
                    *,
                    sender:sender_id(full_name, avatar_url)
                `)
                .single();
            
            if (msgError) throw msgError;
            
            // Link attachment to message
            await supabase
                .from('message_attachments')
                .insert({
                    message_id: message.id,
                    document_id: document.id
                });
            
            // Add attachment info to message
            message.attachments = [{
                document: {
                    id: document.id,
                    file_name: document.file_name,
                    file_type: document.file_type,
                    file_path: document.file_path,
                    file_size: document.file_size
                }
            }];
            
            messages = [...messages, message];
            scrollToBottom();
            
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            uploadingFile = false;
            event.target.value = ''; // Reset file input
        }
    }
    
    function setupRealtimeSubscription() {
        if (!candidateData) return;
        
        realtimeChannel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `recipient_id=eq.${profile.id}`
                },
                async (payload) => {
                    // Load full message data with sender info
                    const { data: newMsg } = await supabase
                        .from('messages')
                        .select(`
                            *,
                            sender:sender_id(full_name, avatar_url),
                            attachments:message_attachments(
                                id,
                                document:document_id(
                                    id,
                                    file_name,
                                    file_type,
                                    file_path,
                                    file_size
                                )
                            )
                        `)
                        .eq('id', payload.new.id)
                        .single();
                    
                    if (newMsg) {
                        // Add to messages if viewing this conversation
                        if (currentConversation && newMsg.match_id === currentConversation.matchId) {
                            messages = [...messages, newMsg];
                            scrollToBottom();
                            markMessagesAsRead(currentConversation.matchId);
                        } else {
                            // Update conversation list
                            await loadConversations();
                        }
                    }
                }
            )
            .subscribe();
    }
    
    function scrollToBottom() {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    function formatTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    function formatConversationTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return formatTime(dateString);
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    function isMyMessage(message) {
        return message.sender_id === profile.id;
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    
    function getFileIcon(fileType) {
        if (fileType?.includes('pdf')) return 'file-pdf';
        if (fileType?.includes('word')) return 'file-word';
        if (fileType?.includes('image')) return 'file-image';
        return 'file-earmark';
    }
    
    async function downloadAttachment(attachment) {
        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .download(attachment.document.file_path);
            
            if (error) throw error;
            
            // Create download link
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = attachment.document.file_name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        }
    }
    
    $: filteredConversations = conversations.filter(conv => 
        conv?.agent?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
</script>

<div class="container-xxl">
    <div class="col-md-9 col-lg-10 px-4 py-4">
        {#if loading}
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        {:else}
            <div id="messages-page" class="page-section active">
                <div class="row mb-3">
                    <div class="col-12">
                        <h2 class="mb-1">Messages</h2>
                        <p class="text-muted">Chat with your career agent</p>
                    </div>
                </div>
                
                {#if conversations.length === 0}
                    <div class="card">
                        <div class="card-body text-center py-5">
                            <i class="bi bi-chat-dots" style="font-size: 4rem; color: #ccc;"></i>
                            <h4 class="mt-3">No conversations yet</h4>
                            <p class="text-muted">You'll see your conversations here once you're matched with an agent</p>
                            <button class="btn btn-primary" on:click={() => goto('/agents')}>
                                <i class="bi bi-search me-2"></i>Find an Agent
                            </button>
                        </div>
                    </div>
                {:else}
                    <div class="card">
                        <div class="row g-0" style="height: calc(100vh - 250px);">
                            <!-- Conversations List -->
                            <div class="col-md-4 conversations-list">
                                <div class="p-3 border-bottom">
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                                        <input type="text" class="form-control" placeholder="Search conversations..." 
                                               bind:value={searchQuery}>
                                    </div>
                                </div>
                                <div class="conversations-scroll">
                                    {#each filteredConversations as conversation}
                                        <div class="conversation-item" 
                                             class:active={currentConversation?.matchId === conversation.matchId}
                                             on:click={() => selectConversation(conversation)}
                                             on:keypress={(e) => e.key === 'Enter' && selectConversation(conversation)}
                                             role="button"
                                             tabindex="0">
                                            <div class="d-flex">
                                                <img src={conversation.agent.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.agent.full_name)}&background=7c3aed&color=fff&size=50`}
                                                     alt={conversation.agent.full_name} 
                                                     class="rounded-circle me-3" width="50" height="50">
                                                <div class="flex-grow-1">
                                                    <div class="d-flex justify-content-between">
                                                        <h6 class="mb-1">{conversation.agent.full_name}</h6>
                                                        <small class="text-muted">{formatConversationTime(conversation.latestMessageTime)}</small>
                                                    </div>
                                                    <p class="mb-0 text-muted small text-truncate">
                                                        {#if conversation.isSentByMe}
                                                            <span class="me-1">You:</span>
                                                        {/if}
                                                        {conversation.latestMessage}
                                                    </p>
                                                    {#if conversation.unreadCount > 0}
                                                        <span class="badge bg-danger badge-sm">{conversation.unreadCount} new</span>
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                            
                            <!-- Chat Area -->
                            {#if currentConversation}
                                <div class="col-md-8 d-flex flex-column">
                                    <!-- Chat Header -->
                                    <div class="p-3 border-bottom bg-white">
                                        <div class="d-flex align-items-center">
                                            <img src={currentConversation.agent.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentConversation.agent.full_name)}&background=7c3aed&color=fff&size=50`}
                                                 alt={currentConversation.agent.full_name} 
                                                 class="rounded-circle me-3" width="50" height="50">
                                            <div>
                                                <h6 class="mb-0">{currentConversation.agent.full_name}</h6>
                                                <small class="text-success"><i class="bi bi-circle-fill"></i> Online</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Messages Container -->
                                    <div class="messages-container flex-grow-1" bind:this={messagesContainer}>
                                        {#if messages.length === 0}
                                            <div class="text-center py-5">
                                                <i class="bi bi-chat-text" style="font-size: 3rem; color: #ccc;"></i>
                                                <p class="text-muted mt-3">No messages yet. Start the conversation!</p>
                                            </div>
                                        {:else}
                                            {#each messages as message (message.id)}
                                                <div class="message" class:received={!isMyMessage(message)} class:sent={isMyMessage(message)}>
                                                    {#if !isMyMessage(message)}
                                                        <img src={message.sender?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender?.full_name || 'Agent')}&background=7c3aed&color=fff&size=40`}
                                                             alt={message.sender?.full_name} 
                                                             class="rounded-circle me-2" width="40" height="40">
                                                    {/if}
                                                    <div>
                                                        <div class="message-bubble">
                                                            <p class="mb-1">{message.content}</p>
                                                            
                                                            {#if message.has_attachments && message.attachments?.length > 0}
                                                                {#each message.attachments as attachment}
                                                                    <div class="attachment-item" 
                                                                         on:click={() => downloadAttachment(attachment)}
                                                                         on:keypress={(e) => e.key === 'Enter' && downloadAttachment(attachment)}
                                                                         role="button"
                                                                         tabindex="0">
                                                                        <i class="bi bi-{getFileIcon(attachment.document.file_type)} me-2"></i>
                                                                        <div class="flex-grow-1">
                                                                            <div class="fw-bold">{attachment.document.file_name}</div>
                                                                            <small class="text-muted">{formatFileSize(attachment.document.file_size)}</small>
                                                                        </div>
                                                                        <i class="bi bi-download"></i>
                                                                    </div>
                                                                {/each}
                                                            {/if}
                                                        </div>
                                                        <small class="text-muted" class:ms-2={!isMyMessage(message)} class:me-2={isMyMessage(message)}>
                                                            {formatTime(message.created_at)}
                                                        </small>
                                                    </div>
                                                </div>
                                            {/each}
                                        {/if}
                                    </div>
                                    
                                    <!-- Message Input -->
                                    <div class="message-input-container">
                                        <div class="input-group">
                                            <input type="file" id="fileUpload" class="d-none" on:change={handleFileUpload} disabled={uploadingFile}>
                                            <button class="btn btn-outline-secondary" type="button" 
                                                    on:click={() => document.getElementById('fileUpload').click()}
                                                    disabled={uploadingFile}>
                                                {#if uploadingFile}
                                                    <span class="spinner-border spinner-border-sm"></span>
                                                {:else}
                                                    <i class="bi bi-paperclip"></i>
                                                {/if}
                                            </button>
                                            <input type="text" class="form-control" placeholder="Type your message..." 
                                                   bind:value={newMessage}
                                                   on:keypress={(e) => e.key === 'Enter' && sendMessage()}>
                                            <button class="btn btn-primary" type="button" on:click={sendMessage}>
                                                <i class="bi bi-send"></i> Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            {:else}
                                <div class="col-md-8 d-flex align-items-center justify-content-center">
                                    <div class="text-center">
                                        <i class="bi bi-chat-dots" style="font-size: 4rem; color: #ccc;"></i>
                                        <p class="text-muted mt-3">Select a conversation to start messaging</p>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .conversations-list {
        border-right: 1px solid #e0e0e0;
        background-color: #fafafa;
    }
    
    .conversations-scroll {
        overflow-y: auto;
        height: calc(100% - 70px);
    }
    
    .conversation-item {
        padding: 15px;
        border-bottom: 1px solid #e0e0e0;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .conversation-item:hover {
        background-color: #f5f5f5;
    }
    
    .conversation-item.active {
        background-color: #e8eaf6;
        border-left: 3px solid #3b82f6;
    }
    
    .messages-container {
        overflow-y: auto;
        padding: 20px;
        background-color: #f8f9fa;
    }
    
    .message {
        display: flex;
        margin-bottom: 20px;
        animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .message.received {
        justify-content: flex-start;
    }
    
    .message.sent {
        justify-content: flex-end;
    }
    
    .message.sent .message-bubble {
        background-color: #3b82f6;
        color: white;
    }
    
    .message-bubble {
        background-color: white;
        border-radius: 12px;
        padding: 12px 16px;
        max-width: 500px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .message-bubble p {
        word-wrap: break-word;
    }
    
    .message-input-container {
        padding: 15px;
        background-color: white;
        border-top: 1px solid #e0e0e0;
    }
    
    .attachment-item {
        display: flex;
        align-items: center;
        padding: 10px;
        margin-top: 8px;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .attachment-item:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
    
    .message.sent .attachment-item {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .message.sent .attachment-item:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }
    
    .badge-sm {
        font-size: 0.7rem;
        padding: 2px 6px;
    }
    
    .text-truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>