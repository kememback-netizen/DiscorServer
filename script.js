// ====== BROADCAST CHANNEL ======
const channel = new BroadcastChannel('discorserver_chat');
let myUsername = '';
let myAvatar = '👤';
let myColor = '#b31b1b';

// ====== MÚLTIPLOS IDIOMAS ======
const locales = {
    pt: {
        channel: 'Canal',
        call: 'Chamada',
        endCall: 'Encerrar chamada',
        you: 'Você',
        msgPlaceholder: 'Mensagem...',
        welcome: 'Bem-vindo ao DiscorServer! 🚀',
        now: 'agora',
        recording: 'Gravando...',
        stopRecording: 'Parar gravação',
        sendAudio: 'Enviar áudio',
        cancel: 'Cancelar',
        system: 'Sistema',
        enterCall: 'Entrar na Call',
        leaveCall: 'Sair da Call',
        inCall: 'Em chamada',
        joined: 'entrou no servidor',
        left: 'saiu do servidor'
    },
    en: {
        channel: 'Channel',
        call: 'Call',
        endCall: 'End call',
        you: 'You',
        msgPlaceholder: 'Message...',
        welcome: 'Welcome to DiscorServer! 🚀',
        now: 'now',
        recording: 'Recording...',
        stopRecording: 'Stop recording',
        sendAudio: 'Send audio',
        cancel: 'Cancel',
        system: 'System',
        enterCall: 'Join Call',
        leaveCall: 'Leave Call',
        inCall: 'In call',
        joined: 'joined the server',
        left: 'left the server'
    },
    es: {
        channel: 'Canal',
        call: 'Llamada',
        endCall: 'Finalizar llamada',
        you: 'Tú',
        msgPlaceholder: 'Mensaje...',
        welcome: '¡Bienvenido a DiscorServer! 🚀',
        now: 'ahora',
        recording: 'Grabando...',
        stopRecording: 'Detener grabación',
        sendAudio: 'Enviar audio',
        cancel: 'Cancelar',
        system: 'Sistema',
        enterCall: 'Unirse a llamada',
        leaveCall: 'Salir de llamada',
        inCall: 'En llamada',
        joined: 'se unió al servidor',
        left: 'salió del servidor'
    },
    fr: {
        channel: 'Canal',
        call: 'Appel',
        endCall: 'Terminer l\'appel',
        you: 'Vous',
        msgPlaceholder: 'Message...',
        welcome: 'Bienvenue sur DiscorServer ! 🚀',
        now: 'maintenant',
        recording: 'Enregistrement...',
        stopRecording: 'Arrêter',
        sendAudio: 'Envoyer',
        cancel: 'Annuler',
        system: 'Système',
        enterCall: 'Rejoindre l\'appel',
        leaveCall: 'Quitter l\'appel',
        inCall: 'En appel',
        joined: 'a rejoint le serveur',
        left: 'a quitté le serveur'
    }
};

let currentLang = 'pt';
let translations = {};

function setLanguage(lang) {
    currentLang = lang;
    translations = locales[lang] || locales.pt;
    applyLanguage();
}

function applyLanguage() {
    document.getElementById('langLabel').textContent = currentLang.toUpperCase();
    document.getElementById('msgInput').placeholder = translations.msgPlaceholder || 'Mensagem...';
    document.getElementById('audioTimer').textContent = '00:00';
    updateCallButtonText();
}

// ====== TELA DE LOGIN ======
const loginOverlay = document.getElementById('loginOverlay');
const loginUsername = document.getElementById('loginUsername');
const loginAvatar = document.getElementById('loginAvatar');
const loginColor = document.getElementById('loginColor');
const loginAvatarPreview = document.getElementById('loginAvatarPreview');
const loginBtn = document.getElementById('loginBtn');

// Atualiza preview do avatar no login
loginAvatar.addEventListener('input', () => {
    loginAvatarPreview.textContent = loginAvatar.value || '👤';
});
loginColor.addEventListener('input', () => {
    loginAvatarPreview.style.background = loginColor.value;
});

// Atualiza cor inicial
loginColor.addEventListener('input', () => {
    loginAvatarPreview.style.background = loginColor.value;
});

loginBtn.addEventListener('click', () => {
    const name = loginUsername.value.trim();
    if (!name) {
        loginUsername.style.borderColor = '#ff4444';
        loginUsername.placeholder = 'Digite seu nome!';
        return;
    }
    myUsername = name;
    myAvatar = loginAvatar.value || '👤';
    myColor = loginColor.value || '#b31b1b';
    
    loginOverlay.classList.add('hidden');
    document.getElementById('app').style.display = 'flex';
    
    // Inicializa app
    initApp();
    
    // Anuncia entrada
    broadcastMessage({
        type: 'system',
        text: `${myUsername} ${translations.joined || 'entrou no servidor'}`,
        username: 'Sistema',
        avatar: '👋'
    });
});

loginUsername.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
    loginUsername.style.borderColor = '#2a2a2a';
});

// ====== PERFIL ======
let profileData = {
    username: '',
    avatar: '👤',
    avatarColor: '#b31b1b',
    avatarUrl: '',
    status: 'online',
    bio: '',
    animated: true,
    decorations: { glow: false, pulse: false, border: false, rainbow: false, crown: false, sparkle: false }
};

function loadProfile() {
    const saved = localStorage.getItem('discorserver_profile');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            profileData = { ...profileData, ...parsed };
            if (!profileData.decorations) {
                profileData.decorations = { glow: false, pulse: false, border: false, rainbow: false, crown: false, sparkle: false };
            }
        } catch (e) {}
    }
    // Usa dados do login
    profileData.username = myUsername;
    profileData.avatar = myAvatar;
    profileData.avatarColor = myColor;
    updateProfileUI();
}

function saveProfile() {
    localStorage.setItem('discorserver_profile', JSON.stringify(profileData));
}

function updateProfileUI() {
    const mainAvatar = document.getElementById('mainAvatar');
    const mainUsername = document.getElementById('mainUsername');
    const profileAvatarPreview = document.getElementById('profileAvatarPreview');
    
    if (profileData.avatarUrl && profileData.avatarUrl.trim() !== '') {
        mainAvatar.innerHTML = `<img src="${profileData.avatarUrl}" class="avatar-img" alt="avatar" />`;
        mainAvatar.style.background = 'transparent';
    } else {
        mainAvatar.textContent = profileData.avatar || '👤';
        mainAvatar.style.background = profileData.avatarColor || '#b31b1b';
        mainAvatar.style.color = '#fff';
    }
    
    mainUsername.innerHTML = `${profileData.username} <span class="badge">${getStatusText()}</span>`;
    
    if (profileData.avatarUrl && profileData.avatarUrl.trim() !== '') {
        profileAvatarPreview.innerHTML = `<img src="${profileData.avatarUrl}" alt="avatar" />`;
        profileAvatarPreview.style.background = 'transparent';
    } else {
        profileAvatarPreview.textContent = profileData.avatar || '👤';
        profileAvatarPreview.style.background = profileData.avatarColor || '#b31b1b';
        profileAvatarPreview.style.color = '#fff';
    }
    
    if (profileData.animated) {
        mainAvatar.classList.add('animated-avatar');
        profileAvatarPreview.classList.add('animated');
    } else {
        mainAvatar.classList.remove('animated-avatar');
        profileAvatarPreview.classList.remove('animated');
    }
    
    applyDecorations(mainAvatar);
    updateMemberCount();
}

function applyDecorations(element) {
    const dec = profileData.decorations;
    element.classList.remove('decoration-glow', 'decoration-pulse', 'decoration-border', 'decoration-rainbow', 'decoration-crown', 'decoration-sparkle');
    if (dec.glow) element.classList.add('decoration-glow');
    if (dec.pulse) element.classList.add('decoration-pulse');
    if (dec.border) element.classList.add('decoration-border');
    if (dec.rainbow) element.classList.add('decoration-rainbow');
    if (dec.crown) element.classList.add('decoration-crown');
    if (dec.sparkle) element.classList.add('decoration-sparkle');
}

function getStatusText() {
    const statusMap = {
        online: '🟢 Online',
        idle: '🟡 Ausente',
        dnd: '🔴 Não perturbe',
        offline: '⚫ Offline'
    };
    return statusMap[profileData.status] || '🟢 Online';
}

function getStatusEmoji(status) {
    const map = { online: '🟢', idle: '🟡', dnd: '🔴', offline: '⚫' };
    return map[status] || '🟢';
}

// ====== BROADCAST ======
function broadcastMessage(data) {
    channel.postMessage({
        ...data,
        sender: myUsername,
        timestamp: new Date().toISOString()
    });
}

// Recebe mensagens de outras abas/janelas
channel.onmessage = (event) => {
    const data = event.data;
    
    // Ignora próprias mensagens
    if (data.sender === myUsername && data.type !== 'system') return;
    
    if (data.type === 'message') {
        renderMessage({
            text: data.text,
            username: data.username,
            avatar: data.avatar,
            avatarColor: data.avatarColor,
            avatarUrl: data.avatarUrl || '',
            isAnimated: data.isAnimated || false,
            isAudio: data.isAudio || false,
            isSystem: false,
            timestamp: data.timestamp || new Date().toISOString(),
            status: data.status || 'online'
        });
    } else if (data.type === 'system') {
        renderMessage({
            text: data.text,
            username: 'Sistema',
            avatar: data.avatar || '📢',
            isSystem: true,
            timestamp: data.timestamp || new Date().toISOString()
        });
    } else if (data.type === 'user_joined') {
        updateOnlineUsers();
    } else if (data.type === 'user_left') {
        updateOnlineUsers();
    }
};

// ====== RENDER MENSAGENS ======
let messageHistory = [];

function renderMessage(msg) {
    const container = document.getElementById('messageContainer');
    
    // Remove mensagem de boas-vindas se existir
    const welcomeMsg = container.querySelector('.welcome-msg');
    if (welcomeMsg) welcomeMsg.remove();
    
    const div = document.createElement('div');
    div.className = `message ${msg.isSystem ? 'system' : ''}`;
    
    let avatarHtml = '';
    if (msg.avatarUrl && msg.avatarUrl.trim() !== '') {
        avatarHtml = `<img src="${msg.avatarUrl}" class="avatar-img" alt="avatar" />`;
    } else {
        avatarHtml = msg.avatar || '👤';
    }
    
    const avatarClass = msg.isAnimated ? 'avatar animated-avatar' : 'avatar';
    const timestamp = new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    let contentHtml = '';
    if (msg.isAudio) {
        contentHtml = `<audio controls src="${msg.text}" style="max-width: 300px; border-radius: 20px;"></audio>`;
    } else {
        contentHtml = `<p>${msg.text}</p>`;
    }
    
    div.innerHTML = `
        <div class="${avatarClass}" style="background: ${msg.avatarUrl ? 'transparent' : (msg.avatarColor || '#2a2a2a')};">
            ${avatarHtml}
        </div>
        <div class="msg-content">
            <span class="username">
                ${msg.username}
                ${!msg.isSystem ? `<span class="badge">${getStatusEmoji(msg.status)}</span>` : ''}
            </span>
            <span class="timestamp">${timestamp}</span>
            ${contentHtml}
        </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    
    // Salva no histórico
    messageHistory.push(msg);
    if (messageHistory.length > 100) messageHistory.shift();
}

// ====== ENVIAR MENSAGEM ======
function sendMessage(text, isAudio = false) {
    const msgData = {
        type: 'message',
        text: text,
        username: profileData.username,
        avatar: profileData.avatar,
        avatarColor: profileData.avatarColor,
        avatarUrl: profileData.avatarUrl || '',
        isAnimated: profileData.animated,
        isAudio: isAudio,
        status: profileData.status
    };
    
    // Envia via Broadcast
    broadcastMessage(msgData);
    
    // Renderiza localmente
    renderMessage({
        ...msgData,
        timestamp: new Date().toISOString()
    });
}

// ====== ONLINE USERS ======
let onlineUsers = new Set();

function updateOnlineUsers() {
    // Simples: cada aba é um usuário
    // Na prática, usaríamos um servidor, mas para demo usamos BroadcastChannel
    const users = new Set();
    users.add(myUsername);
    // Adiciona usuários de outras abas via mensagens
    document.getElementById('onlineUsers').textContent = `👥 ${users.size} online`;
    document.getElementById('memberCount').textContent = `👥 ${users.size} online`;
}

// ====== MODAL DE PERFIL ======
const profileModal = document.getElementById('profileModal');
const profileBtn = document.getElementById('profileBtn');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const cancelProfileBtn = document.getElementById('cancelProfileBtn');
const saveProfileBtn = document.getElementById('saveProfileBtn');

function openProfileModal() {
    document.getElementById('profileUsername').value = profileData.username;
    document.getElementById('avatarEmoji').value = profileData.avatar || '👤';
    document.getElementById('avatarColor').value = profileData.avatarColor || '#b31b1b';
    document.getElementById('profileStatus').value = profileData.status || 'online';
    document.getElementById('profileBio').value = profileData.bio || '';
    document.getElementById('profileAnimated').checked = profileData.animated !== false;
    
    const dec = profileData.decorations;
    document.getElementById('decorationGlow').checked = dec.glow || false;
    document.getElementById('decorationPulse').checked = dec.pulse || false;
    document.getElementById('decorationBorder').checked = dec.border || false;
    document.getElementById('decorationRainbow').checked = dec.rainbow || false;
    document.getElementById('decorationCrown').checked = dec.crown || false;
    document.getElementById('decorationSparkle').checked = dec.sparkle || false;
    
    updateProfilePreview();
    profileModal.classList.add('active');
}

function updateProfilePreview() {
    const preview = document.getElementById('profileAvatarPreview');
    const url = document.getElementById('avatarUrl').value.trim();
    const emoji = document.getElementById('avatarEmoji').value || '👤';
    const color = document.getElementById('avatarColor').value;
    
    if (url) {
        preview.innerHTML = `<img src="${url}" alt="avatar" />`;
        preview.style.background = 'transparent';
    } else {
        preview.textContent = emoji;
        preview.style.background = color;
        preview.style.color = '#fff';
    }
}

document.getElementById('avatarFile').addEventListener('change', function(e) {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('avatarUrl').value = event.target.result;
            updateProfilePreview();
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('avatarEmoji').addEventListener('input', updateProfilePreview);
document.getElementById('avatarColor').addEventListener('input', updateProfilePreview);
document.getElementById('avatarUrl').addEventListener('input', updateProfilePreview);

function closeProfileModal() {
    profileModal.classList.remove('active');
}

profileBtn.addEventListener('click', openProfileModal);
closeProfileBtn.addEventListener('click', closeProfileModal);
cancelProfileBtn.addEventListener('click', closeProfileModal);
profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeProfileModal();
});

saveProfileBtn.addEventListener('click', function() {
    const oldUsername = profileData.username;
    
    profileData.username = document.getElementById('profileUsername').value.trim() || profileData.username;
    profileData.avatar = document.getElementById('avatarEmoji').value || '👤';
    profileData.avatarColor = document.getElementById('avatarColor').value || '#b31b1b';
    profileData.avatarUrl = document.getElementById('avatarUrl').value.trim();
    profileData.status = document.getElementById('profileStatus').value;
    profileData.bio = document.getElementById('profileBio').value;
    profileData.animated = document.getElementById('profileAnimated').checked;
    
    profileData.decorations = {
        glow: document.getElementById('decorationGlow').checked,
        pulse: document.getElementById('decorationPulse').checked,
        border: document.getElementById('decorationBorder').checked,
        rainbow: document.getElementById('decorationRainbow').checked,
        crown: document.getElementById('decorationCrown').checked,
        sparkle: document.getElementById('decorationSparkle').checked
    };
    
    saveProfile();
    updateProfileUI();
    
    if (oldUsername !== profileData.username) {
        broadcastMessage({
            type: 'system',
            text: `${oldUsername} mudou o nome para ${profileData.username}`,
            avatar: '✏️'
        });
    } else {
        broadcastMessage({
            type: 'system',
            text: `${profileData.username} atualizou o perfil! ✨`,
            avatar: '🎨'
        });
    }
    
    closeProfileModal();
});

// ====== CHAT ======
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', () => {
    const text = msgInput.value.trim();
    if (text) {
        sendMessage(text);
        msgInput.value = '';
    }
});

msgInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

// ====== CANAIS ======
document.querySelectorAll('.channel').forEach(ch => {
    ch.addEventListener('click', function() {
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const name = this.dataset.channel || this.textContent.trim();
        document.getElementById('currentChannel').textContent = name;
        
        if (this.classList.contains('voice-channel')) {
            document.getElementById('callChannel').textContent = `#${name}`;
        }
        
        broadcastMessage({
            type: 'system',
            text: `${profileData.username} entrou no canal #${name}`,
            avatar: '🔔'
        });
    });
});

// ====== ÁUDIO ======
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let recordingTimer = null;
let seconds = 0;

const audioBtn = document.getElementById('audioBtn');
const audioRecorder = document.getElementById('audioRecorder');
const startRecordBtn = document.getElementById('startRecordBtn');
const stopRecordBtn = document.getElementById('stopRecordBtn');
const sendAudioBtn = document.getElementById('sendAudioBtn');
const cancelAudioBtn = document.getElementById('cancelAudioBtn');
const audioTimer = document.getElementById('audioTimer');
const audioPreview = document.getElementById('audioPreview');

audioBtn.addEventListener('click', () => {
    audioRecorder.style.display = audioRecorder.style.display === 'none' ? 'block' : 'none';
});

startRecordBtn.addEventListener('click', async function() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        isRecording = true;
        seconds = 0;
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPreview.src = audioUrl;
            audioPreview.style.display = 'block';
            sendAudioBtn.disabled = false;
        };
        
        mediaRecorder.start();
        startRecordBtn.disabled = true;
        stopRecordBtn.disabled = false;
        audioBtn.classList.add('recording');
        
        recordingTimer = setInterval(() => {
            seconds++;
            const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            audioTimer.textContent = `${mins}:${secs}`;
        }, 1000);
        
    } catch (err) {
        console.error('Erro ao acessar microfone:', err);
        alert('Permita o acesso ao microfone para gravar áudio!');
    }
});

stopRecordBtn.addEventListener('click', () => {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        clearInterval(recordingTimer);
        startRecordBtn.disabled = false;
        stopRecordBtn.disabled = true;
        audioBtn.classList.remove('recording');
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
});

sendAudioBtn.addEventListener('click', () => {
    if (audioPreview.src && audioPreview.src !== '') {
        sendMessage(audioPreview.src, true);
        audioPreview.style.display = 'none';
        audioPreview.src = '';
        sendAudioBtn.disabled = true;
        audioTimer.textContent = '00:00';
        audioRecorder.style.display = 'none';
    }
});

cancelAudioBtn.addEventListener('click', () => {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        clearInterval(recordingTimer);
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    audioPreview.style.display = 'none';
    audioPreview.src = '';
    sendAudioBtn.disabled = true;
    audioTimer.textContent = '00:00';
    startRecordBtn.disabled = false;
    stopRecordBtn.disabled = true;
    audioBtn.classList.remove('recording');
    audioRecorder.style.display = 'none';
});

// ====== COMPARTILHAR TELA ======
let screenStream = null;
const shareScreenBtn = document.getElementById('shareScreenBtn');
const screenSharePanel = document.getElementById('screenSharePanel');
const screenVideo = document.getElementById('screenVideo');
const stopShareBtn = document.getElementById('stopShareBtn');

shareScreenBtn.addEventListener('click', async function() {
    if (screenStream) {
        stopScreenShare();
        return;
    }
    
    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({ 
            video: true,
            audio: true 
        });
        
        screenVideo.srcObject = screenStream;
        screenSharePanel.style.display = 'block';
        shareScreenBtn.classList.add('active');
        shareScreenBtn.innerHTML = '<i class="fas fa-desktop"></i> Compartilhando';
        broadcastMessage({
            type: 'system',
            text: `${profileData.username} está compartilhando a tela`,
            avatar: '🖥️'
        });
        
        screenStream.getVideoTracks()[0].onended = () => {
            stopScreenShare();
        };
        
    } catch (err) {
        console.error('Erro ao compartilhar tela:', err);
        alert('Permita o compartilhamento de tela para usar esta função!');
    }
});

function stopScreenShare() {
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;
    }
    screenVideo.srcObject = null;
    screenSharePanel.style.display = 'none';
    shareScreenBtn.classList.remove('active');
    shareScreenBtn.innerHTML = '<i class="fas fa-desktop"></i> Compartilhar';
    broadcastMessage({
        type: 'system',
        text: `${profileData.username} parou de compartilhar a tela`,
        avatar: '🖥️'
    });
}

stopShareBtn.addEventListener('click', stopScreenShare);

// ====== CALL DE VOZ ======
let callActive = false;
let localStream = null;
let isMuted = false;
let isDeafened = false;

const callBtn = document.getElementById('callBtn');
const callPanel = document.getElementById('callPanel');
const endCallBtn = document.getElementById('endCallBtn');
const leaveCallBtn = document.getElementById('leaveCallBtn');
const muteMicBtn = document.getElementById('muteMicBtn');
const deafenBtn = document.getElementById('deafenBtn');
const videoBtn = document.getElementById('videoBtn');
const screenShareCallBtn = document.getElementById('screenShareCallBtn');
const callUsersContainer = document.getElementById('callUsersContainer');

let callUsers = [];

function updateCallUsers() {
    callUsersContainer.innerHTML = '';
    
    // Usuário local
    const localDiv = document.createElement('div');
    localDiv.className = 'call-user active-speaker';
    localDiv.id = 'localUser';
    localDiv.innerHTML = `
        <div class="avatar-container">
            <div class="avatar" style="background: ${profileData.avatarColor};">
                ${profileData.avatar}
            </div>
            <div class="speaking-indicator active"></div>
        </div>
        <span class="call-username">${profileData.username} (Você)</span>
        <span class="call-status">🟢</span>
    `;
    callUsersContainer.appendChild(localDiv);
    
    // Usuários remotos (simulados)
    const remoteUsers = ['João', 'Maria', 'Pedro'];
    remoteUsers.forEach(name => {
        if (name !== profileData.username) {
            const div = document.createElement('div');
            div.className = 'call-user';
            div.innerHTML = `
                <div class="avatar-container">
                    <div class="avatar" style="background: #${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')};">
                        ${name[0]}
                    </div>
                    <div class="speaking-indicator"></div>
                </div>
                <span class="call-username">${name}</span>
                <span class="call-status">🟢</span>
            `;
            callUsersContainer.appendChild(div);
        }
    });
    
    // Simula indicadores de fala
    setInterval(() => {
        document.querySelectorAll('.speaking-indicator').forEach((ind) => {
            if (Math.random() > 0.4) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });
    }, 2000);
}

function updateCallButtonText() {
    if (callActive) {
        callBtn.innerHTML = `<i class="fas fa-phone"></i> ${translations.inCall || 'Em chamada'}`;
    } else {
        callBtn.innerHTML = `<i class="fas fa-phone"></i> ${translations.enterCall || 'Entrar na Call'}`;
    }
}

callBtn.addEventListener('click', async function() {
    if (callActive) {
        leaveCall();
        return;
    }
    
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ 
            audio: true,
            video: false 
        });
        
        callActive = true;
        callPanel.classList.add('active');
        callBtn.classList.add('in-call');
        updateCallButtonText();
        
        broadcastMessage({
            type: 'system',
            text: `${profileData.username} entrou na chamada de voz`,
            avatar: '📞'
        });
        
        updateCallUsers();
        
    } catch (err) {
        console.error('Erro ao acessar microfone:', err);
        alert('Permita o acesso ao microfone para entrar na chamada!');
    }
});

function leaveCall() {
    callActive = false;
    callPanel.classList.remove('active');
    callBtn.classList.remove('in-call');
    updateCallButtonText();
    
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    broadcastMessage({
        type: 'system',
        text: `${profileData.username} saiu da chamada de voz`,
        avatar: '📞'
    });
}

endCallBtn.addEventListener('click', leaveCall);
leaveCallBtn.addEventListener('click', leaveCall);

muteMicBtn.addEventListener('click', function() {
    isMuted = !isMuted;
    this.innerHTML = isMuted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
    this.classList.toggle('muted');
    this.classList.toggle('active');
    
    if (localStream) {
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !isMuted;
        });
    }
});

deafenBtn.addEventListener('click', function() {
    isDeafened = !isDeafened;
    this.innerHTML = isDeafened ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    this.classList.toggle('muted');
    this.classList.toggle('active');
});

videoBtn.addEventListener('click', function() {
    this.innerHTML = this.innerHTML.includes('video') ? '<i class="fas fa-video-slash"></i>' : '<i class="fas fa-video"></i>';
    this.classList.toggle('muted');
    this.classList.toggle('active');
});

screenShareCallBtn.addEventListener('click', function() {
    if (!screenStream) {
        shareScreenBtn.click();
    } else {
        stopScreenShare();
    }
});

// ====== IDIOMA ======
document.getElementById('langBtn').addEventListener('click', () => {
    const langs = ['pt', 'en', 'es', 'fr'];
    let idx = langs.indexOf(currentLang);
    idx = (idx + 1) % langs.length;
    setLanguage(langs[idx]);
});

// ====== INICIALIZAÇÃO ======
function initApp() {
    setLanguage('pt');
    loadProfile();
    updateMemberCount();
    updateOnlineUsers();
    updateCallUsers();
    updateCallButtonText();
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        const container = document.getElementById('messageContainer');
        container.innerHTML = `
            <div class="message system welcome-msg">
                <div class="msg-content" style="text-align:center;width:100%;">
                    <p style="color:#888;font-style:italic;">${translations.welcome || 'Bem-vindo ao DiscorServer! 🚀'}</p>
                    <p style="color:#555;font-size:12px;">As mensagens são em tempo real entre todas as abas!</p>
                </div>
            </div>
        `;
    }, 100);
    
    setInterval(updateOnlineUsers, 10000);
}

// Mostra app se já estiver logado (para recarregar)
if (localStorage.getItem('discorserver_logged')) {
    const saved = localStorage.getItem('discorserver_login_data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            myUsername = data.username;
            myAvatar = data.avatar;
            myColor = data.color;
            loginOverlay.classList.add('hidden');
            document.getElementById('app').style.display = 'flex';
            initApp();
        } catch (e) {}
    }
}

// Salva dados de login
loginBtn.addEventListener('click', () => {
    localStorage.setItem('discorserver_logged', 'true');
    localStorage.setItem('discorserver_login_data', JSON.stringify({
        username: myUsername,
        avatar: myAvatar,
        color: myColor
    }));
});
