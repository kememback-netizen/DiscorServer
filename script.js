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
        cancel: 'Cancelar'
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
        cancel: 'Cancel'
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
        cancel: 'Cancelar'
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
        cancel: 'Annuler'
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
    document.querySelector('.channel-info span').textContent = t.channel || 'Canal';
    document.querySelector('.call-header span').innerHTML = `<i class="fas fa-phone"></i> ${t.call || 'Chamada'}`;
    document.getElementById('msgInput').placeholder = t.msgPlaceholder || 'Mensagem...';
    document.getElementById('audioTimer').textContent = '00:00';
}

// ====== Perfil ======
let profileData = {
    username: 'DiscorServer',
    avatar: 'D',
    avatarColor: '#b31b1b',
    status: 'online',
    bio: '',
    animated: true
};

function updateProfileUI() {
    const mainAvatar = document.getElementById('mainAvatar');
    const mainUsername = document.getElementById('mainUsername');
    const profileAvatarPreview = document.getElementById('profileAvatarPreview');
    
    mainAvatar.textContent = profileData.avatar;
    mainAvatar.style.background = profileData.avatarColor;
    mainUsername.innerHTML = `${profileData.username} <span class="badge">ADM</span>`;
    
    if (profileData.animated) {
        mainAvatar.classList.add('animated-avatar');
        profileAvatarPreview.classList.add('animated');
    } else {
        mainAvatar.classList.remove('animated-avatar');
        profileAvatarPreview.classList.remove('animated');
    }
    
    // Atualiza status
    const statusMap = {
        online: '🟢 Online',
        idle: '🟡 Ausente',
        dnd: '🔴 Não perturbe',
        offline: '⚫ Offline'
    };
    document.querySelector('.username .badge').textContent = statusMap[profileData.status] || 'ADM';
}

// ====== Modal de Perfil ======
const profileModal = document.getElementById('profileModal');
const profileBtn = document.getElementById('profileBtn');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const cancelProfileBtn = document.getElementById('cancelProfileBtn');
const saveProfileBtn = document.getElementById('saveProfileBtn');

function openProfileModal() {
    document.getElementById('profileUsername').value = profileData.username;
    document.getElementById('avatarEmoji').value = profileData.avatar;
    document.getElementById('avatarColor').value = profileData.avatarColor;
    document.getElementById('profileStatus').value = profileData.status;
    document.getElementById('profileBio').value = profileData.bio || '';
    document.getElementById('profileAnimated').checked = profileData.animated;
    document.getElementById('profileAvatarPreview').textContent = profileData.avatar;
    document.getElementById('profileAvatarPreview').style.background = profileData.avatarColor;
    profileModal.classList.add('active');
}

function closeProfileModal() {
    profileModal.classList.remove('active');
}

profileBtn.addEventListener('click', openProfileModal);
closeProfileBtn.addEventListener('click', closeProfileModal);
cancelProfileBtn.addEventListener('click', closeProfileModal);
profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeProfileModal();
});

document.getElementById('avatarEmoji').addEventListener('input', function() {
    document.getElementById('profileAvatarPreview').textContent = this.value || '👤';
});

document.getElementById('avatarColor').addEventListener('input', function() {
    document.getElementById('profileAvatarPreview').style.background = this.value;
});

saveProfileBtn.addEventListener('click', function() {
    profileData.username = document.getElementById('profileUsername').value || 'Usuário';
    profileData.avatar = document.getElementById('avatarEmoji').value || '👤';
    profileData.avatarColor = document.getElementById('avatarColor').value || '#b31b1b';
    profileData.status = document.getElementById('profileStatus').value;
    profileData.bio = document.getElementById('profileBio').value;
    profileData.animated = document.getElementById('profileAnimated').checked;
    
    updateProfileUI();
    
    // Adiciona mensagem de sistema
    addMessage(`Perfil atualizado: ${profileData.username}`, 'Sistema', '⚙️', false);
    closeProfileModal();
});

// ====== Chat ======
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const msgContainer = document.getElementById('messageContainer');

function addMessage(text, username = 'Você', avatar = '👤', isAnimated = false, isAudio = false) {
    const div = document.createElement('div');
    div.className = 'message';
    const avatarClass = isAnimated ? 'avatar animated-avatar' : 'avatar';
    const audioHtml = isAudio ? `<audio controls src="${text}" style="max-width: 300px; border-radius: 20px;"></audio>` : `<p>${text}</p>`;
    
    div.innerHTML = `
        <div class="${avatarClass}" style="background: ${isAnimated ? '#b31b1b' : '#2a2a2a'};">${avatar}</div>
        <div class="msg-content">
            <span class="username">${username}</span>
            <span class="timestamp">${translations.now || 'agora'}</span>
            ${audioHtml}
        </div>
    `;
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

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

// ====== Canais ======
document.querySelectorAll('.channel').forEach(ch => {
    ch.addEventListener('click', function() {
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const name = this.dataset.channel || this.textContent.trim();
        document.getElementById('currentChannel').textContent = name;
        addMessage(`Entrou no canal #${name}`, 'Sistema', '🔔', false);
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
        media
