document.addEventListener("DOMContentLoaded", function () {
    const chatList = document.getElementById('chat-list');
    const chatArea = document.querySelector('.messages');
    const participantList = document.getElementById('participant-list');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const messageInput = document.getElementById('messageInput');

    async function fetchChatData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();

            const roomName = data.results.room.name;
            const participants = data.results.room.participant;
            const comments = data.results.comments;
            const roomImageUrl = data.results.room.image_url;

            // Menambahkan chat item ke daftar chat
            const chatItem = document.createElement('div');
            chatItem.classList.add('chat-item');
            chatItem.setAttribute('data-comments', JSON.stringify(comments));

            const avatar = document.createElement('img');
            avatar.classList.add('avatar');
            avatar.src = roomImageUrl;
            avatar.alt = roomName.charAt(0);

            const chatInfo = document.createElement('div');
            chatInfo.classList.add('chat-info');

            const chatName = document.createElement('h3');
            chatName.textContent = roomName;

            const lastMessage = document.createElement('p');
            if (comments.length > 0) {
                const lastComment = comments[comments.length - 1];
                lastMessage.textContent = lastComment.message;
            } else {
                lastMessage.textContent = "No messages yet";
            }

            chatInfo.appendChild(chatName);
            chatInfo.appendChild(lastMessage);

            chatItem.appendChild(avatar);
            chatItem.appendChild(chatInfo);

            chatList.appendChild(chatItem);

            chatItem.addEventListener('click', function () {
                displayChatDetails(comments);
            });

            document.getElementById('group-avatar').src = roomImageUrl;
            document.getElementById('group-name').textContent = roomName;
            document.getElementById('group-id').textContent = `ID: ${data.results.room.id}`;

            participants.forEach(participant => {
                const listItem = document.createElement('li');
                listItem.classList.add('participant-item');

                const participantAvatar = document.createElement('div');
                participantAvatar.classList.add('avatar');
                participantAvatar.textContent = participant.name.charAt(0);

                listItem.appendChild(participantAvatar);
                participantList.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error fetching chat data:', error);
        }
    }

    function displayChatDetails(comments) {
        chatArea.innerHTML = '';

        comments.forEach(comment => {
            const chatMessage = document.createElement('div');
            chatMessage.classList.add('chat-message');

            const sender = document.createElement('span');
            sender.classList.add('sender');
            sender.textContent = comment.sender;

            const message = document.createElement('span');
            message.classList.add('message');
            message.textContent = comment.message;

            chatMessage.appendChild(sender);
            chatMessage.appendChild(message);

            chatArea.appendChild(chatMessage);
        });
    }

    async function loadMessages() {
        try {
            // Ambil data dari file JSON
            const response = await fetch('data.json');
            const data = await response.json();

            // Iterasi melalui setiap komentar dan buat elemen HTML untuk menampilkannya
            data.results.comments.forEach(comment => {
                const messageItem = document.createElement('div');
                messageItem.className = 'message-item';

                const avatar = document.createElement('img');
                avatar.src = `avatars/${comment.sender === 'customer@mail.com' ? 'avatar1.png' : 'avatar2.png'}`;
                avatar.alt = `Avatar of ${comment.sender}`;
                avatar.className = 'avatar';

                const messageContent = document.createElement('div');
                messageContent.className = 'message-content';

                const messageHeader = document.createElement('div');
                messageHeader.className = 'message-header';

                const sender = document.createElement('span');
                sender.className = 'sender';
                sender.textContent = comment.sender;

                messageHeader.appendChild(sender);

                const messageText = document.createElement('p');
                messageText.textContent = comment.message;

                messageContent.appendChild(messageHeader);
                messageContent.appendChild(messageText);

                messageItem.appendChild(avatar);
                messageItem.appendChild(messageContent);

                chatArea.appendChild(messageItem);
            });
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    // Tambahkan fungsi pengiriman pesan sebagai agent
    sendMessageBtn.addEventListener('click', async function () {
        const messageText = messageInput.value.trim();
        if (messageText === "") return;

        // Data pengirim (agent)
        const sender = 'agent@mail.com';
        const avatarUrl = 'avatars/avatar2.png';

        // Buat elemen pesan baru
        const chatMessage = document.createElement('div');
        chatMessage.classList.add('chat-message');

        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = avatarUrl;
        avatar.alt = `Avatar of ${sender}`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const senderElement = document.createElement('span');
        senderElement.className = 'sender';
        senderElement.textContent = sender;

        const messageElement = document.createElement('p');
        messageElement.className = 'message';
        messageElement.textContent = messageText;

        messageContent.appendChild(senderElement);
        messageContent.appendChild(messageElement);

        chatMessage.appendChild(avatar);
        chatMessage.appendChild(messageContent);

        chatArea.appendChild(chatMessage);

        // Clear input field
        messageInput.value = '';
        chatArea.scrollTop = chatArea.scrollHeight;

        // Kirim pesan ke server untuk disimpan di data.json
        try {
            const response = await fetch('/saveMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sender: sender,
                    message: messageText
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save message');
            }
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    fetchChatData();
    loadMessages();
});
