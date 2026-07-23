// ====== Múltiplos idiomas ======
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
        inCall: 'Em chamada'
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
        inCall: 'In call'
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
        inCall: 'En llamada'
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
        inCall: 'En appel'
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
    const t = translations;
    document.getElementById('langLabel').textContent = currentLang.toUpperCase();
    document.getElementById('msgInput').placeholder = t.msgPlaceholder || 'Mensagem...';
    document.getElementById('audioTimer').textContent = '00:00';
}

// ====== PERFIL COM localStorage ======
let profileData = {
    username: 'DiscorServer',
    avatar: 'D',
    avatarColor: '#b31b1b',
    avatarUrl: '',
    status: 'online',
    bio: '',
    animated: true,
    decorations: {
        glow: false,
        pulse: false,
        border: false,
        rainbow: false,
        crown: false,
        sparkle: false
    }
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
        } catch (e) {
            console.error('Erro ao carregar perfil:', e);
        }
    }
    updateProfileUI();
}

function saveProfile() {
    localStorage.setItem('discorserver_profile', JSON.stringify(profileData));
}

function updateProfileUI() {
    const mainAvatar = document.getElementById('mainAvatar');
    const mainUsername = document.getElementById('mainUsername');
    const profileAvatarPreview = document.getElementById('profileAvatarPreview');
    
    // Avatar
    if (profileData.avatarUrl && profileData.avatarUrl.trim() !== '') {
        mainAvatar.innerHTML = `<img src="${profileData.avatarUrl}" class="avatar-img" alt="avatar" />`;
        mainAvatar.style.background = 'transparent';
    } else {
        mainAvatar.textContent = profileData.avatar || '👤';
        mainAvatar.style.background = profileData.avatarColor || '#b31b1b';
        mainAvatar.style.color = '#fff';
    }
    
    // Nome
    mainUsername.innerHTML = `${profileData.username} <span class="badge">${getStatusText()}</span>`;
    
    // Preview modal
    if (profileData.avatarUrl && profileData.avatarUrl.trim() !== '') {
        profileAvatarPreview.innerHTML = `<img src="${profileData.avatarUrl}" alt="avatar" />`;
        profileAvatarPreview.style.background = 'transparent';
    } else {
        profileAvatarPreview.textContent = profileData.avatar || '👤';
        profileAvatarPreview.style.background = profileData.avatarColor || '#b31b1b';
        profileAvatarPreview.style.color = '#fff';
    }
    
    // Animações
    if (profileData.animated) {
        mainAvatar.classList.add('animated-avatar');
        profileAvatarPreview.classList.add('animated');
    } else {
        mainAvatar.classList.remove('animated-avatar');
        profileAvatarPreview.classList.remove('animated');
    }
    
    // Decorações
    applyDecorations(mainAvatar);
    
    updateMemberCount();
}

function applyDecorations(element) {
    const dec = profileData.decorations;
    // Remove todas as classes de decoração
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
    const map = {
        online: '🟢',
        idle: '🟡',
        dnd: '🔴',
        offline: '⚫'
    };
    return map[status] || '🟢';
}

// ====== CHAT GLOBAL ======
let messages = [];
const MAX_MESSAGES = 100;

function loadMessages() {
    const saved = localStorage.getItem('discorserver_messages');
    if (saved) {
        try {
            messages = JSON.parse(saved);
            if (!Array.isArray(messages)) messages = [];
            if (messages.length > MAX_MESSAGES) messages = messages.slice(-MAX_MESSAGES);
        } catch (e) {
            messages = [];
        }
    }
    renderMessages();
}

function saveMessages() {
    if (messages.length > MAX_MESSAGES) messages = messages.slice(-MAX_MESSAGES);
    localStorage.setItem('discorserver_messages', JSON.stringify(messages));
}

function addMessage(text, username = 'Você', avatar = '👤', isAnimated = false, isAudio = false, isSystem = false) {
    const message = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        text: text,
        username: username,
        avatar: avatar,
        avatarColor: profileData.avatarColor || '#b31b1b',
        avatarUrl: profileData.avatarUrl || '',
        isAnimated: isAnimated,
        isAudio: isAudio,
        isSystem: isSystem,
        timestamp: new Date().toISOString(),
        status: profileData.status || 'online'
    };
    messages.push(message);
    if (messages.length > MAX_MESSAGES) messages = messages.slice(-MAX_MESSAGES);
    saveMessages();
    renderMessages();
}

function renderMessages() {
    const container = document.getElementById('messageContainer');
    container.innerHTML = '';
    
    if (messages.length === 0) {
        const t = translations;
        container.innerHTML = `
            <div class="message system">
                <div class="msg-content" style="text-align:center;width:100%;">
                    <p style="color:#888;font-style:italic;">${t.welcome || 'Bem-vindo ao DiscorServer! 🚀'}</p>
                    <p style="color:#555;font-size:12px;">As mensagens são salvas automaticamente</p>
                </div>
            </div>
        `;
        return;
    }
    
    messages.forEach(msg => {
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
                    <span class="badge">${getStatusEmoji(msg.status)}</span>
                </span>
                <span class="timestamp">${timestamp}</span>
                ${contentHtml}
            </div>
        `;
        container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
}

function updateMemberCount() {
    const baseMembers = 3;
    const extra = Math.min(Math.floor(messages.length / 10), 10);
    const total = baseMembers + extra;
    document.getElementById('memberCount').textContent = `👥 ${total} online`;
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
    
    // Decorações
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

// Upload de foto
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
    
    profileData.username = document.getElementById('profileUsername').value.trim() || 'Usuário';
    profileData.avatar = document.getElementById('avatarEmoji').value || '👤';
    profileData.avatarColor = document.getElementById('avatarColor').value || '#b31b1b';
    profileData.avatarUrl = document.getElementById('avatarUrl').value.trim();
    profileData.status = document.getElementById('profileStatus').value;
    profileData.bio = document.getElementById('profileBio').value;
    profileData.animated = document.getElementById('profileAnimated').checked;
    
    // Decorações
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
        addMessage(`${oldUsername} mudou o nome para ${profileData.username}`, 'Sistema', '⚙️', false, false, true);
    } else {
        addMessage(`Perfil atualizado com novas decorações! ✨`, 'Sistema', '🎨', false, false, true);
    }
    
    closeProfileModal();
});

// ====== CHAT ======
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', () => {
    const text = msgInput.value.trim();
    if (text) {
        addMessage(text, profileData.username, profileData.avatar, profileData.animated);
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
        
        // Se for canal de voz, atualiza info da call
        if (this.classList.contains('voice-channel')) {
            document.getElementById('callChannel').textContent = `#${name}`;
        }
        
        addMessage(`Entrou no canal #${name}`, 'Sistema', '🔔', false, false, true);
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
        addMessage(audioPreview.src, profileData.username, profileData.avatar, profileData.animated, true);
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
        addMessage('Começou a compartilhar a tela', profileData.username, profileData.avatar, profileData.animated);
        
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
    addMessage('Parou de compartilhar a tela', 'Sistema', '🖥️', false, false, true);
}

stopShareBtn.addEventListener('click', stopScreenShare);

// ====== CALL DE VOZ (WebRTC SIMULADO) ======
let callActive = false;
let localStream = null;
let peerConnections = [];
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

// Usuários simulados na call
let callUsers = [
    { id: 'user1', name: 'João', avatar: 'J', color: '#2a6b2a', status: 'online' },
    { id: 'user2', name: 'Maria', avatar: 'M', color: '#6b2a6b', status: 'online' }
];

function updateCallUsers() {
    callUsersContainer.innerHTML = '';
    
    // Usuário local
    const localDiv = document.createElement('div');
    localDiv.className = 'call-user active-speaker';
    localDiv.id = 'localUser';
    localDiv.innerHTML = `
        <div class="avatar-container">
            <div class="avatar" id="callerAvatar" style="background: ${profileData.avatarColor};">
                ${profileData.avatar}
            </div>
            <div class="speaking-indicator active"></div>
        </div>
        <span class="call-username">${profileData.username} (Você)</span>
        <span class="call-status">🟢</span>
    `;
    callUsersContainer.appendChild(localDiv);
    
    // Usuários remotos
    callUsers.forEach(user => {
        const div = document.createElement('div');
        div.className = 'call-user';
        div.innerHTML = `
            <div class="avatar-container">
                <div class="avatar" style="background: ${user.color};">
                    ${user.avatar}
                </div>
                <div class="speaking-indicator"></div>
            </div>
            <span class="call-username">${user.name}</span>
            <span class="call-status">🟢</span>
        `;
        callUsersContainer.appendChild(div);
    });
}

callBtn.addEventListener('click', async function() {
    if (callActive) {
        // Sai da call
        leaveCall();
        return;
    }
    
    try {
        // Pede acesso ao microfone
        localStream = await navigator.mediaDevices.getUserMedia({ 
            audio: true,
            video: false 
        });
        
        callActive = true;
        callPanel.classList.add('active');
        callBtn.classList.add('in-call');
        callBtn.innerHTML = `<i class="fas fa-phone"></i> ${translations.inCall || 'Em chamada'}`;
        
        addMessage(`Entrou na chamada de voz`, 'Sistema', '📞', false, false, true);
        
        // Simula outros usuários entrando
        setTimeout(() => {
            addMessage('João entrou na chamada', 'Sistema', '📞', false, false, true);
            updateCallUsers();
        }, 1000);
        
        setTimeout(() => {
            addMessage('Maria entrou na chamada', 'Sistema', '📞', false, false, true);
            updateCallUsers();
        }, 2000);
        
        updateCallUsers();
        
        // Simula detecção de voz (ativa o indicador)
        setInterval(() => {
            const indicators = document.querySelectorAll('.speaking-indicator');
            indicators.forEach((ind, index) => {
                if (Math.random() > 0.5) {
                    ind.classList.add('active');
                } else {
                    ind.classList.remove('active');
                }
            });
        }, 2000);
        
    } catch (err) {
        console.error('Erro ao acessar microfone:', err);
        alert('Permita o acesso ao microfone para entrar na chamada!');
    }
});

function leaveCall() {
    callActive = false;
    callPanel.classList.remove('active');
    callBtn.classList.remove('in-call');
    callBtn.innerHTML = `<i class="fas fa-phone"></i> ${translations.enterCall || 'Entrar na Call'}`;
    
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    addMessage('Saiu da chamada de voz', 'Sistema', '📞', false, false, true);
}

endCallBtn.addEventListener('click', leaveCall);
leaveCallBtn.addEventListener('click', leaveCall);

// Controles da chamada
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
    
    addMessage(isMuted ? 'Microfone silenciado' : 'Microfone ativado', 'Sistema', '🎤', false, false, true);
});

deafenBtn.addEventListener('click', function() {
    isDeafened = !isDeafened;
    this.innerHTML = isDeafened ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    this.classList.toggle('muted');
    this.classList.toggle('active');
    
    // Simula silenciar áudio de todos
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.muted = isDeafened;
    });
    
    addMessage(isDeafened ? 'Áudio silenciado' : 'Áudio ativado', 'Sistema', '🔇', false, false, true);
});

videoBtn.addEventListener('click', function() {
    this.innerHTML = this.innerHTML.includes('video') ? '<i class="fas fa-video-slash"></i>' : '<i class="fas fa-video"></i>';
    this.classList.toggle('muted');
    this.classList.toggle('active');
    addMessage('Câmera alternada', 'Sistema', '📹', false, false, true);
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
function init() {
    setLanguage('pt');
    loadProfile();
    loadMessages();
    updateMemberCount();
    updateCallUsers();
    
    setTimeout(() => {
        addMessage('João entrou no servidor', 'Sistema', '👋', false, false, true);
    }, 1000);
    
    setTimeout(() => {
        addMessage('Maria entrou no servidor', 'Sistema', '👋', false, false, true);
    }, 2000);
    
    setInterval(updateMemberCount, 30000);
}

init();
