// Глобальные переменные
let socket = null;
let currentUser = null;
let apiBase = '';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initSocket();
    loadUserData();
});

// Подключение к WebSocket
function initSocket() {
    socket = io();
    
    socket.on('connect', () => {
        console.log('✅ WebSocket подключен');
    });
    
    socket.on('disconnect', () => {
        console.log('❌ WebSocket отключен');
    });
    
    socket.on('queueUpdate', (data) => {
        updateQueueUI(data);
    });
    
    socket.on('currentUpdate', (data) => {
        updateNowPlayingUI(data);
    });
    
    socket.on('voteUpdate', (data) => {
        updateVoteUI(data);
    });
}

// Загрузка данных пользователя
async function loadUserData() {
    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            currentUser = await res.json();
            updateUserUI();
        }
    } catch (e) {
        console.log('Не авторизован');
    }
}

// Обновление UI пользователя
function updateUserUI() {
    if (currentUser) {
        const userNameEl = document.querySelector('.user-name');
        const userAvatarEl = document.querySelector('.user-avatar');
        if (userNameEl) userNameEl.textContent = currentUser.username;
        if (userAvatarEl) userAvatarEl.textContent = currentUser.username.charAt(0).toUpperCase();
    }
}

// Функции для виджетов
function copyToClipboard(elementId) {
    const input = document.getElementById(elementId);
    if (!input) return;
    
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    
    const btn = input.nextElementSibling;
    const originalText = btn.textContent;
    btn.textContent = '✅ Скопировано!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

// Форматирование времени
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#44ff88' : type === 'error' ? '#ff5555' : '#9146ff'};
        color: ${type === 'success' || type === 'info' ? '#0a0a1a' : '#fff'};
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}