// ===== ГЛОБАЛЬНЫЕ ПЕРЕВОДЫ =====
const translations = {
    ru: {
        home: 'Главная',
        music: 'Музыка',
        dashboard: 'Статистика',
        moderators: 'Модераторы',
        settings: 'Настройки',
        widgets: 'Виджеты для OBS',
        heroTitle: '🎵 LakeBot',
        heroDesc: 'Музыкальный бот для управления стримом с удобным веб-интерфейсом',
        heroSub: 'Подключайся к Twitch и начни управлять музыкой прямо сейчас',
        feature1Title: 'Заказ музыки',
        feature1Desc: 'Зрители могут заказывать треки через чат с помощью команды !play или !sr',
        feature2Title: 'Статистика',
        feature2Desc: 'Отслеживайте популярные треки, активность зрителей и историю заказов',
        feature3Title: 'Виджеты для OBS',
        feature3Desc: 'Красивые виджеты для отображения на стриме: плеер, очередь и сейчас играет',
        footer: 'LakeBot — музыкальный бот для Twitch',
        nowPlaying: 'СЕЙЧАС ИГРАЕТ',
        noTrack: 'Нет активного трека',
        orderedBy: 'Заказал',
        votes: 'Голосов',
        back: '◀ Назад',
        skip: '⏭ Пропустить',
        vote: '🗳 Голосовать',
        queueTitle: '📋 Очередь заказов',
        clear: '🗑 Очистить',
        placeholder: 'Вставьте ссылку YouTube...',
        addBtn: '🎵 ЗАКАЗАТЬ',
        emptyQueue: '✨ Очередь пуста ✨',
        footerMusic: 'LakeBot — музыкальный бот для Twitch | Музыка',
        waitingTrack: 'Ожидание трека...',
        statsHeroTitle: 'Статистика LakeBot',
        statsHeroDesc: 'Аналитика работы вашего музыкального бота',
        totalSongs: 'Всего треков',
        totalUsers: 'Пользователей',
        queue: 'В очереди',
        votesStats: 'Голосов',
        historyTitle: '📜 Последние заказы',
        emptyHistory: '📭 История пуста',
        footerStats: 'LakeBot — музыкальный бот для Twitch | Статистика',
        modTitle: '👥 Модераторы сайта',
        modSubtitle: 'Найдите и добавьте пользователей Twitch, которые могут управлять ботом на этом сайте',
        searchPlaceholder: 'Поиск пользователей Twitch...',
        emptyMods: '📭 Модераторы не добавлены',
        footerMods: 'LakeBot — музыкальный бот для Twitch | Модераторы',
        remove: 'Удалить',
        widgetsHeroTitle: '🧩 Виджеты для OBS',
        widgetsHeroDesc: 'Скопируйте URL и добавьте как источник "Браузер" в OBS Studio',
        widgetPlayerTitle: '🎬 Видеоплеер',
        widget1Title: '🎧 Сейчас играет',
        widget2Title: '📋 Очередь заказов',
        widget3Title: '📜 История заказов',
        sizeLabel: '📐 Рекомендуемый размер:',
        footerWidgets: 'LakeBot — музыкальный бот для Twitch | Виджеты для OBS',
        settingsHeroTitle: 'Настройки LakeBot',
        settingsHeroDesc: 'Настройте бота под свои потребности',
        langTitle: '🌍 Язык',
        themeTitle: '🎨 Оформление',
        themePurpleTitle: '🟣 Фиолетовая',
        themePurpleDesc: 'Deep purple стиль (по умолчанию)',
        themeDarkTitle: '⚫ Тёмная',
        themeDarkDesc: 'Чёрная тема',
        themeLightTitle: '⚪ Светлая',
        themeLightDesc: 'Белая тема',
        musicSettingsTitle: '🎵 Настройки музыки',
        maxDurationLabel: '📺 Максимальная длительность видео (секунд)',
        maxTracksLabel: '🎵 Максимум треков на пользователя',
        voteThresholdLabel: '🗳️ Порог голосования для пропуска',
        durationHint: '8 минут = 480 секунд',
        chatCommandsTitle: '💬 Команды Twitch чата',
        widgetSettingsTitle: '🖥️ Настройки виджета OBS',
        marqueeLabel: '📜 Бегущая строка для длинных названий',
        marqueeDesc: 'Если название трека не помещается, оно будет плавно прокручиваться',
        marqueeSpeedLabel: '⚡ Скорость прокрутки (секунд)',
        marqueeSpeedDesc: 'Меньше число = быстрее прокрутка',
        saveBtn: '💾 Сохранить все настройки',
        footerSettings: 'LakeBot — музыкальный бот для Twitch | Настройки',
        secretText: '🔐 Секретная кнопка',
        secretSoundText: '🔊 Секретный звук!',
        secretCooldown: '⏳ Подождите {seconds} секунд',
        authBtn: '🔐 Войти через Twitch',
        votesLabel: '🎫 Голосов: {votes}/{threshold}'
    },
    en: {
        home: 'Home',
        music: 'Music',
        dashboard: 'Dashboard',
        moderators: 'Moderators',
        settings: 'Settings',
        widgets: 'OBS Widgets',
        heroTitle: '🎵 LakeBot',
        heroDesc: 'Music bot for stream management with a convenient web interface',
        heroSub: 'Connect to Twitch and start managing music right now',
        feature1Title: 'Music ordering',
        feature1Desc: 'Viewers can order tracks via chat using !play or !sr command',
        feature2Title: 'Statistics',
        feature2Desc: 'Track popular tracks, viewer activity and order history',
        feature3Title: 'OBS Widgets',
        feature3Desc: 'Beautiful widgets for streaming: player, queue and now playing',
        footer: 'LakeBot — music bot for Twitch',
        nowPlaying: 'NOW PLAYING',
        noTrack: 'No active track',
        orderedBy: 'Ordered by',
        votes: 'Votes',
        back: '◀ Back',
        skip: '⏭ Skip',
        vote: '🗳 Vote',
        queueTitle: '📋 Order queue',
        clear: '🗑 Clear',
        placeholder: 'Paste YouTube link...',
        addBtn: '🎵 ORDER',
        emptyQueue: '✨ Queue is empty ✨',
        footerMusic: 'LakeBot — music bot for Twitch | Music',
        waitingTrack: 'Waiting for track...',
        statsHeroTitle: 'LakeBot Statistics',
        statsHeroDesc: 'Analytics of your music bot',
        totalSongs: 'Total tracks',
        totalUsers: 'Users',
        queue: 'In queue',
        votesStats: 'Votes',
        historyTitle: '📜 Recent orders',
        emptyHistory: '📭 History is empty',
        footerStats: 'LakeBot — music bot for Twitch | Statistics',
        modTitle: '👥 Website Moderators',
        modSubtitle: 'Search and add Twitch users who can manage the bot on this website',
        searchPlaceholder: 'Search Twitch users...',
        emptyMods: '📭 No moderators added yet',
        footerMods: 'LakeBot — music bot for Twitch | Moderators',
        remove: 'Remove',
        widgetsHeroTitle: '🧩 OBS Widgets',
        widgetsHeroDesc: 'Copy the URL and add as "Browser" source in OBS Studio',
        widgetPlayerTitle: '🎬 Video Player',
        widget1Title: '🎧 Now Playing',
        widget2Title: '📋 Order Queue',
        widget3Title: '📜 Order History',
        sizeLabel: '📐 Recommended size:',
        footerWidgets: 'LakeBot — music bot for Twitch | OBS Widgets',
        settingsHeroTitle: 'LakeBot Settings',
        settingsHeroDesc: 'Configure the bot to your needs',
        langTitle: '🌍 Language',
        themeTitle: '🎨 Appearance',
        themePurpleTitle: '🟣 Purple',
        themePurpleDesc: 'Deep purple style (default)',
        themeDarkTitle: '⚫ Dark',
        themeDarkDesc: 'Black theme',
        themeLightTitle: '⚪ Light',
        themeLightDesc: 'White theme',
        musicSettingsTitle: '🎵 Music Settings',
        maxDurationLabel: '📺 Max video duration (seconds)',
        maxTracksLabel: '🎵 Max tracks per user',
        voteThresholdLabel: '🗳️ Vote skip threshold',
        durationHint: '8 minutes = 480 seconds',
        chatCommandsTitle: '💬 Twitch Chat Commands',
        widgetSettingsTitle: '🖥️ OBS Widget Settings',
        marqueeLabel: '📜 Marquee for long titles',
        marqueeDesc: 'If the track title doesn\'t fit, it will scroll smoothly',
        marqueeSpeedLabel: '⚡ Scroll speed (seconds)',
        marqueeSpeedDesc: 'Lower number = faster scroll',
        saveBtn: '💾 Save all settings',
        footerSettings: 'LakeBot — music bot for Twitch | Settings',
        secretText: '🔐 Secret button',
        secretSoundText: '🔊 Secret sound!',
        secretCooldown: '⏳ Wait {seconds} seconds',
        authBtn: '🔐 Login with Twitch',
        votesLabel: '🎫 Votes: {votes}/{threshold}'
    }
};

let currentLanguage = 'ru';
let currentTheme = 'purple';
let previewMode = false;
let originalTheme = 'purple';
let previewTimeout;
let secretCooldown = false;
let cooldownTimer = null;
let cooldownEndTime = null;
let currentUser = null;

// ===== ОБНОВЛЕНИЕ ЯЗЫКА =====
function updatePageLanguage() {
    const t = translations[currentLanguage] || translations.ru;
    const currentPath = window.location.pathname;
    
    // Сайдбар
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const sidebarKeys = ['home', 'music', 'dashboard', 'moderators', 'settings', 'widgets'];
    sidebarItems.forEach((item, index) => {
        if (index < sidebarKeys.length) {
            const span = item.querySelector('span:last-child');
            if (span) span.textContent = t[sidebarKeys[index]];
        }
    });
    
    // Кнопка авторизации
    const authSection = document.getElementById('authSection');
    if (authSection) {
        if (currentUser) {
            authSection.innerHTML = `<div class="user-info"><span>${currentUser.username}</span><div class="user-avatar">${currentUser.username.charAt(0).toUpperCase()}</div></div>`;
        } else {
            authSection.innerHTML = `<a href="/auth/twitch" class="auth-btn">${t.authBtn}</a>`;
        }
    }
    
    // Футер
    const footer = document.querySelector('.footer p');
    if (footer) {
        if (currentPath.includes('/music')) footer.textContent = t.footerMusic;
        else if (currentPath.includes('/dashboard')) footer.textContent = t.footerStats;
        else if (currentPath.includes('/moderators')) footer.textContent = t.footerMods;
        else if (currentPath.includes('/widgets')) footer.textContent = t.footerWidgets;
        else if (currentPath.includes('/settings')) footer.textContent = t.footerSettings;
        else footer.textContent = t.footer;
    }
    
    // Главная
    if (currentPath === '/' || currentPath === '/index.html') {
        const ids = ['heroTitle', 'heroDesc', 'heroSub', 'feature1Title', 'feature1Desc', 'feature2Title', 'feature2Desc', 'feature3Title', 'feature3Desc'];
        const keys = ['heroTitle', 'heroDesc', 'heroSub', 'feature1Title', 'feature1Desc', 'feature2Title', 'feature2Desc', 'feature3Title', 'feature3Desc'];
        ids.forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.textContent = t[keys[i]];
        });
    }
    
    // Музыка
    if (currentPath.includes('/music')) {
        const map = {
            'nowPlayingLabel': 'nowPlaying',
            'backBtn': 'back',
            'skipBtn': 'skip',
            'voteBtn': 'vote',
            'queueTitle': 'queueTitle',
            'clearBtn': 'clear',
            'addBtn': 'addBtn',
            'songUrl': 'placeholder',
            'placeholderText': 'waitingTrack',
            'emptyQueue': 'emptyQueue'
        };
        for (const [id, key] of Object.entries(map)) {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'songUrl') el.placeholder = t[key];
                else if (id === 'backBtn' || id === 'skipBtn' || id === 'voteBtn' || id === 'clearBtn') el.innerHTML = t[key];
                else if (id === 'queueTitle' || id === 'addBtn') el.innerHTML = t[key];
                else el.textContent = t[key];
            }
        }
        const npTitle = document.getElementById('npTitle');
        if (npTitle && (npTitle.textContent === 'Нет активного трека' || npTitle.textContent === 'No active track')) {
            npTitle.textContent = t.noTrack;
        }
        const npVotes = document.getElementById('npVotes');
        if (npVotes) {
            const match = npVotes.textContent.match(/\d+/g);
            if (match) {
                npVotes.textContent = t.votesLabel.replace('{votes}', match[0] || '0').replace('{threshold}', match[1] || '2');
            }
        }
    }
    
    // Статистика
    if (currentPath.includes('/dashboard')) {
        const map = {
            'heroTitle': 'statsHeroTitle',
            'heroDesc': 'statsHeroDesc',
            'totalSongsLabel': 'totalSongs',
            'totalUsersLabel': 'totalUsers',
            'queueLabel': 'queue',
            'votesLabel': 'votesStats',
            'historyTitle': 'historyTitle',
            'emptyHistory': 'emptyHistory'
        };
        for (const [id, key] of Object.entries(map)) {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'historyTitle') el.innerHTML = t[key];
                else el.textContent = t[key];
            }
        }
    }
    
    // Модераторы
    if (currentPath.includes('/moderators')) {
        const map = {
            'title': 'modTitle',
            'subtitle': 'modSubtitle',
            'searchInput': 'searchPlaceholder',
            'emptyList': 'emptyMods'
        };
        for (const [id, key] of Object.entries(map)) {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'title') el.innerHTML = t[key];
                else if (id === 'searchInput') el.placeholder = t[key];
                else el.textContent = t[key];
            }
        }
    }
    
    // Виджеты
    if (currentPath.includes('/widgets')) {
        const map = {
            'heroTitle': 'widgetsHeroTitle',
            'heroDesc': 'widgetsHeroDesc',
            'widgetPlayerTitle': 'widgetPlayerTitle',
            'widget1Title': 'widget1Title',
            'widget2Title': 'widget2Title',
            'widget3Title': 'widget3Title'
        };
        for (const [id, key] of Object.entries(map)) {
            const el = document.getElementById(id);
            if (el) el.innerHTML = t[key];
        }
        document.querySelectorAll('.widget-hint span:first-child').forEach(el => {
            if (el) el.textContent = t.sizeLabel;
        });
    }
    
    // Настройки
    if (currentPath.includes('/settings')) {
        const map = {
            'heroTitle': 'settingsHeroTitle',
            'heroDesc': 'settingsHeroDesc',
            'langTitle': 'langTitle',
            'themeTitle': 'themeTitle',
            'themePurpleTitle': 'themePurpleTitle',
            'themePurpleDesc': 'themePurpleDesc',
            'themeDarkTitle': 'themeDarkTitle',
            'themeDarkDesc': 'themeDarkDesc',
            'themeLightTitle': 'themeLightTitle',
            'themeLightDesc': 'themeLightDesc',
            'musicSettingsTitle': 'musicSettingsTitle',
            'maxDurationLabel': 'maxDurationLabel',
            'maxTracksLabel': 'maxTracksLabel',
            'voteThresholdLabel': 'voteThresholdLabel',
            'durationHint': 'durationHint',
            'chatCommandsTitle': 'chatCommandsTitle',
            'widgetSettingsTitle': 'widgetSettingsTitle',
            'marqueeLabel': 'marqueeLabel',
            'marqueeDesc': 'marqueeDesc',
            'marqueeSpeedLabel': 'marqueeSpeedLabel',
            'marqueeSpeedDesc': 'marqueeSpeedDesc',
            'saveBtn': 'saveBtn'
        };
        for (const [id, key] of Object.entries(map)) {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'saveBtn') el.innerHTML = t[key];
                else if (id === 'maxDurationLabel' || id === 'maxTracksLabel' || id === 'voteThresholdLabel') el.innerHTML = t[key];
                else if (id === 'langTitle' || id === 'themeTitle') el.innerHTML = t[key];
                else el.textContent = t[key];
            }
        }
        const secretBtn = document.getElementById('secretPageBtn');
        if (secretBtn && !secretCooldown) {
            secretBtn.innerHTML = t.secretText;
        }
    }
}

// ===== ЗАГРУЗКА ЯЗЫКА =====
async function loadLanguage() {
    try {
        const savedLang = localStorage.getItem('lakebot_language');
        if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
            currentLanguage = savedLang;
            updatePageLanguage();
            return;
        }
        const res = await fetch('/api/settings');
        const settings = await res.json();
        if (settings.language) {
            currentLanguage = settings.language;
            localStorage.setItem('lakebot_language', settings.language);
            updatePageLanguage();
        }
    } catch (e) {}
}

// ===== ПРОВЕРКА АВТОРИЗАЦИИ =====
async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
            currentUser = data.user;
            updatePageLanguage();
        }
    } catch (e) {}
}

// ===== ТЕМЫ =====
function applyTheme(theme) {
    document.body.classList.remove('purple', 'dark', 'light');
    document.body.classList.add(theme);
    currentTheme = theme;
    localStorage.setItem('lakebot_theme', theme);
}

async function loadSavedTheme() {
    try {
        const savedTheme = localStorage.getItem('lakebot_theme');
        if (savedTheme) { applyTheme(savedTheme); return; }
        const res = await fetch('/api/settings');
        const settings = await res.json();
        if (settings.site_theme) applyTheme(settings.site_theme);
    } catch (e) {}
}

function previewTheme(theme) {
    if (!previewMode) {
        originalTheme = currentTheme;
        previewMode = true;
        showPreviewBanner();
    }
    applyTheme(theme);
    if (previewTimeout) clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
        if (previewMode) cancelPreview();
    }, 5000);
}

function cancelPreview() {
    if (previewMode) {
        applyTheme(originalTheme);
        previewMode = false;
        hidePreviewBanner();
        if (previewTimeout) clearTimeout(previewTimeout);
    }
}

async function saveTheme(theme) {
    await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'site_theme', value: theme })
    });
    currentTheme = theme;
    originalTheme = theme;
    if (previewMode) {
        previewMode = false;
        hidePreviewBanner();
        if (previewTimeout) clearTimeout(previewTimeout);
    }
    localStorage.setItem('lakebot_theme', theme);
    showNotification('Тема сохранена!', 'success');
}

function showPreviewBanner() {
    let banner = document.getElementById('previewBannerGlobal');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'previewBannerGlobal';
        banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:linear-gradient(135deg,#ffaa00,#ff8800);color:#1a1a2e;text-align:center;padding:10px;font-size:13px;font-weight:600;z-index:9999;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;';
        document.body.appendChild(banner);
    }
    const texts = { ru: '🎨 РЕЖИМ ПРЕДПРОСМОТРА ТЕМЫ — изменения не сохранены', en: '🎨 THEME PREVIEW MODE — changes not saved' };
    banner.innerHTML = '<span>' + (texts[currentLanguage] || texts.ru) + '</span><div style="display:flex;gap:12px;"><button id="saveThemeBtn" style="background:#28a745;border:none;padding:5px 15px;border-radius:20px;color:white;cursor:pointer;font-weight:600;">💾 Сохранить</button><button id="cancelPreviewBtn" style="background:#dc3545;border:none;padding:5px 15px;border-radius:20px;color:white;cursor:pointer;font-weight:600;">❌ Отмена</button></div>';
    document.getElementById('saveThemeBtn').onclick = () => { saveTheme(currentTheme); hidePreviewBanner(); };
    document.getElementById('cancelPreviewBtn').onclick = () => { cancelPreview(); showNotification('Предпросмотр отменён', 'info'); };
    banner.style.display = 'flex';
}

function hidePreviewBanner() { const banner = document.getElementById('previewBannerGlobal'); if (banner) banner.style.display = 'none'; }

function showNotification(message, type) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = 'position:fixed;bottom:20px;right:20px;background:' + (type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#9146ff') + ';color:white;padding:12px 24px;border-radius:12px;z-index:10000;animation:slideIn 0.3s ease-out;font-weight:500;';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// ===== СЕКРЕТНАЯ КНОПКА =====
function initSecretButton() {
    const secretPageBtn = document.getElementById('secretPageBtn');
    if (!secretPageBtn) return;
    
    const secretSound1 = document.getElementById('secretSound1');
    const secretSound2 = document.getElementById('secretSound2');
    const secretSound3 = document.getElementById('secretSound3');
    const secretSound4 = document.getElementById('secretSound4');
    
    function saveCooldownState() {
        if (secretCooldown && cooldownEndTime) {
            localStorage.setItem('lakebot_secret_cooldown', cooldownEndTime.toString());
        } else {
            localStorage.removeItem('lakebot_secret_cooldown');
        }
    }
    
    function restoreCooldownState() {
        const savedCooldown = localStorage.getItem('lakebot_secret_cooldown');
        if (savedCooldown) {
            const endTime = parseInt(savedCooldown);
            const now = Date.now();
            if (endTime > now) {
                const remainingSeconds = Math.ceil((endTime - now) / 1000);
                if (remainingSeconds > 0) {
                    secretCooldown = true;
                    secretPageBtn.classList.add('disabled');
                    let seconds = remainingSeconds;
                    const updateButton = function() {
                        if (seconds > 0 && secretCooldown) {
                            secretPageBtn.innerHTML = '⏳ ' + seconds + 's';
                            seconds--;
                            cooldownTimer = setTimeout(updateButton, 1000);
                        } else {
                            const t = translations[currentLanguage] || translations.ru;
                            secretPageBtn.innerHTML = t.secretText;
                            secretPageBtn.classList.remove('disabled');
                            secretCooldown = false;
                            clearTimeout(cooldownTimer);
                            cooldownTimer = null;
                            localStorage.removeItem('lakebot_secret_cooldown');
                        }
                    };
                    updateButton();
                    return;
                }
            }
        }
        secretCooldown = false;
        secretPageBtn.classList.remove('disabled');
        const t = translations[currentLanguage] || translations.ru;
        secretPageBtn.innerHTML = t.secretText;
        localStorage.removeItem('lakebot_secret_cooldown');
    }
    
    function startCooldown() {
        secretCooldown = true;
        secretPageBtn.classList.add('disabled');
        const endTime = Date.now() + 15000;
        cooldownEndTime = endTime;
        saveCooldownState();
        let seconds = 15;
        const updateButton = function() {
            if (seconds > 0 && secretCooldown) {
                secretPageBtn.innerHTML = '⏳ ' + seconds + 's';
                seconds--;
                cooldownTimer = setTimeout(updateButton, 1000);
            } else {
                const t = translations[currentLanguage] || translations.ru;
                secretPageBtn.innerHTML = t.secretText;
                secretPageBtn.classList.remove('disabled');
                secretCooldown = false;
                clearTimeout(cooldownTimer);
                cooldownTimer = null;
                localStorage.removeItem('lakebot_secret_cooldown');
            }
        };
        updateButton();
    }
    
    secretPageBtn.addEventListener('click', function() {
        if (secretCooldown) {
            const t = translations[currentLanguage] || translations.ru;
            const msg = t.secretCooldown.replace('{seconds}', '15');
            showNotification(msg, 'error');
            return;
        }
        
        let sound;
        if (currentLanguage === 'ru') {
            const random = Math.random() < 0.5 ? 1 : 2;
            sound = random === 1 ? secretSound1 : secretSound2;
        } else {
            const random = Math.random() < 0.5 ? 3 : 4;
            sound = random === 3 ? secretSound3 : secretSound4;
        }
        
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(function(e) { 
                console.log('Audio play failed:', e);
                const audio = new Audio(sound.src);
                audio.play().catch(function(e2) { console.log('Audio fallback failed:', e2); });
            });
        }
        
        const t = translations[currentLanguage] || translations.ru;
        showNotification(t.secretSoundText, 'info');
        startCooldown();
    });
    
    restoreCooldownState();
}

// ===== УНИВЕРСАЛЬНЫЙ БУРГЕР-МЕНЮ =====
function initBurgerMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (!burgerMenu || !sidebar || !overlay) {
        return;
    }

    // Удаляем старые обработчики (клонируем, чтобы снять все события)
    const newBurger = burgerMenu.cloneNode(true);
    burgerMenu.parentNode.replaceChild(newBurger, burgerMenu);
    
    const newBurgerMenu = document.getElementById('burgerMenu');
    const newSidebar = document.getElementById('sidebar');
    const newOverlay = document.getElementById('overlay');

    function toggleMenu(e) {
        if (e) e.stopPropagation();
        newBurgerMenu.classList.toggle('active');
        newSidebar.classList.toggle('open');
        newOverlay.classList.toggle('active');
        document.body.style.overflow = newSidebar.classList.contains('open') ? 'hidden' : '';
    }

    newBurgerMenu.addEventListener('click', toggleMenu);

    newOverlay.addEventListener('click', function(e) {
        if (newSidebar.classList.contains('open')) {
            toggleMenu(e);
        }
    });

    document.querySelectorAll('.sidebar-item').forEach(function(item) {
        item.addEventListener('click', function() {
            if (newSidebar.classList.contains('open')) {
                newBurgerMenu.classList.remove('active');
                newSidebar.classList.remove('open');
                newOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && newSidebar.classList.contains('open')) {
            newBurgerMenu.classList.remove('active');
            newSidebar.classList.remove('open');
            newOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    loadSavedTheme();
    loadLanguage();
    checkAuth();
    initBurgerMenu();
    initSecretButton();
    
    // Обновляем голоса на странице музыки
    if (window.location.pathname.includes('/music')) {
        const npVotes = document.getElementById('npVotes');
        if (npVotes) {
            const match = npVotes.textContent.match(/\d+/g);
            const t = translations[currentLanguage] || translations.ru;
            if (match) {
                npVotes.textContent = t.votesLabel.replace('{votes}', match[0] || '0').replace('{threshold}', match[1] || '2');
            } else {
                npVotes.textContent = t.votesLabel.replace('{votes}', '0').replace('{threshold}', '2');
            }
        }
    }
});

// ===== ЭКСПОРТ =====
window.themeManager = { previewTheme, saveTheme, cancelPreview, currentTheme };
window.setLanguage = function(lang) {
    currentLanguage = lang;
    localStorage.setItem('lakebot_language', lang);
    updatePageLanguage();
};
window.getCurrentLanguage = function() { return currentLanguage; };
window.translations = translations;
window.currentUser = currentUser;