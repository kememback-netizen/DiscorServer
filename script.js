// ====== Múltiplos idiomas (carregando JSON externo) ======
let currentLang = 'pt';
let translations = {};

async function loadLanguage(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        translations = await response.json();
        applyLanguage();
    } catch (error) {
        console.error('Erro ao carregar idioma:', error);
        // Fallback para português
        if (lang !== 'pt') {
            loadLanguage('pt');
        }
    }
}

function applyLanguage() {
    const t = translations;
    document.getElementById('langLabel').textContent = currentLang.toUpperCase();
    document.querySelector('.channel-info span').textContent = t.channel || 'Canal';
    document.querySelector('.call-header span').innerHTML = `<i class="fas fa-phone"></i> ${t.call || 'Chamada'}`;
    document.getElementById('msgInput').placeholder = t.msgPlaceholder || 'Mensagem...';
    
    // Atualiza mensagens existentes
    const msgs = document.querySelectorAll('.message');
    if (msgs.length >= 2) {
        msgs[0].querySelector('.msg-content p').textContent = t.welcome || 'Bem-vindo ao DiscorServer! 🚀';
        msgs[1].querySelector('.msg-content p').textContent = t.animated || 'Meu perfil é animado! ✨';
    }
    
    // Atualiza botão de chamada
    const callBtn = document.getElementById('callBtn');
    if (callPanel.classList.contains('active')) {
        callBtn.innerHTML = `<i class="fas fa-phone"></i> ${t.call || 'Chamada'}`;
    }
}

function setLanguage(lang) {
    currentLang = lang;
    loadLanguage(lang);
}

// ====== Chat ======
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const msgContainer = document.getElementById('messageContainer');

function addMessage(text, username = 'Você', avatar = '👤', isAnimated = false) {
    const div = document.createElement('div');
    div.className = 'message';
    const avatarClass = isAnimated ? 'avatar animated-avatar' : 'avatar';
    const t = translations;
    div.innerHTML = `
        <div class="${avatarClass}" style="background: #2a2a2a;">${avatar}</div>
        <div class="msg-content">
            <span class="username">${username}</span>
            <span class="timestamp">${t.now || 'agora'}</span>
            <p>${text}</p>
        </div>
    `;
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

sendBtn.addEventListener('click', () => {
    const text = msgInput.value.trim();
    if (text) {
        const t = translations;
        addMessage(text, t.you || 'Você', '👤', false);
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
        const t = translations;
        addMessage(`Entrou no canal #${name}`, 'Sistema', '🔔', false);
    });
});

// ====== Call ======
const callBtn = document.getElementById('callBtn');
const callPanel = document.getElementById('callPanel');
const endCallBtn = document.getElementById('endCallBtn');

callBtn.addEventListener('click', () => {
    callPanel.classList.toggle('active');
    const t = translations;
    callBtn.innerHTML = callPanel.classList.contains('active') 
        ? `<i class="fas fa-phone"></i> ${t.call || 'Chamada'}` 
        : `<i class="fas fa-phone"></i> ${t.call || 'Call'}`;
});

endCallBtn.addEventListener('click', () => {
    callPanel.classList.remove('active');
    const t = translations;
    callBtn.innerHTML = `<i class="fas fa-phone"></i> ${t.call || 'Call'}`;
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