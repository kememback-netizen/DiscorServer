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
        // Para todas as tracks
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
        // Se já está compartilhando, para
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
    addMessage('Parou de compartilhar a tela', 'Sistema', '🖥️', false);
}

stopShareBtn.addEventListener('click', stopScreenShare);

// ====== CALL ======
const callBtn = document.getElementById('callBtn');
const callPanel = document.getElementById('callPanel');
const endCallBtn = document.getElementById('endCallBtn');
let isMuted = false;

callBtn.addEventListener('click', () => {
    callPanel.classList.toggle('active');
    const t = translations;
    callBtn.innerHTML = callPanel.classList.contains('active') 
        ? `<i class="fas fa-phone"></i> ${t.call || 'Chamada'}` 
        : `<i class="fas fa-phone"></i> ${t.call || 'Call'}`;
    
    if (callPanel.classList.contains('active')) {
        addMessage('Iniciou uma chamada de voz', 'Sistema', '📞', false);
        // Atualiza nome do caller
        document.getElementById('callerName').textContent = profileData.username;
        document.getElementById('callerAvatar').textContent = profileData.avatar;
    }
});

endCallBtn.addEventListener('click', () => {
    callPanel.classList.remove('active');
    const t = translations;
    callBtn.innerHTML = `<i class="fas fa-phone"></i> ${t.call || 'Call'}`;
    addMessage('Encerrou a chamada', 'Sistema', '📞', false);
});

// Controles da chamada
document.getElementById('muteMicBtn').addEventListener('click', function() {
    isMuted = !isMuted;
    this.innerHTML = isMuted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
    this.style.background = isMuted ? '#ff4444' : '#2a2a2a';
});

document.getElementById('volumeBtn').addEventListener('click', function() {
    this.innerHTML = this.innerHTML.includes('volume-up') ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

document.getElementById('videoBtn').addEventListener('click', function() {
    this.innerHTML = this.innerHTML.includes('video') ? '<i class="fas fa-video-slash"></i>' : '<i class="fas fa-video"></i>';
    this.style.background = this.innerHTML.includes('video-slash') ? '#ff4444' : '#2a2a2a';
});

// ====== Idioma ======
document.getElementById('langBtn').addEventListener('click', () => {
    const langs = ['pt', 'en', 'es', 'fr'];
    let idx = langs.indexOf(currentLang);
    idx = (idx + 1) % langs.length;
    setLanguage(langs[idx]);
});

// ====== Inicialização ======
setLanguage('pt');
updateProfileUI();

// Mensagem de boas-vindas
setTimeout(() => {
    addMessage('Use o botão de perfil (👤) para personalizar seu avatar!', 'Sistema', '💡', false);
}, 500);
