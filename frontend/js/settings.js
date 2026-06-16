// Загрузка настроек при открытии страницы
async function loadSettings() {
    try {
        const res = await fetch('/api/settings');
        const settings = await res.json();
        
        // Общие настройки
        if (settings.max_tracks) document.getElementById('maxTracks').value = settings.max_tracks;
        if (settings.max_duration) document.getElementById('maxDuration').value = settings.max_duration;
        if (settings.vote_threshold) document.getElementById('voteThreshold').value = settings.vote_threshold;
        
        // Настройки бота
        if (settings.cmd_prefix) document.getElementById('cmdPrefix').value = settings.cmd_prefix;
        if (settings.bot_status) document.getElementById('botStatus').value = settings.bot_status;
        if (settings.notify_channel) document.getElementById('notifyChannel').value = settings.notify_channel;
        
        // Настройки виджетов
        if (settings.widget_bg_color) document.getElementById('widgetBgColor').value = settings.widget_bg_color;
        if (settings.widget_accent_color) document.getElementById('widgetAccentColor').value = settings.widget_accent_color;
        if (settings.widget_opacity) document.getElementById('widgetOpacity').value = settings.widget_opacity;
    } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
    }
}

// Сохранение общих настроек
async function saveGeneralSettings() {
    const data = {
        max_tracks: document.getElementById('maxTracks').value,
        max_duration: document.getElementById('maxDuration').value,
        vote_threshold: document.getElementById('voteThreshold').value
    };
    
    try {
        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            showNotification('✅ Настройки сохранены', 'success');
        }
    } catch (error) {
        showNotification('❌ Ошибка сохранения', 'error');
    }
}

// Сохранение настроек бота
async function saveBotSettings() {
    const data = {
        cmd_prefix: document.getElementById('cmdPrefix').value,
        bot_status: document.getElementById('botStatus').value,
        notify_channel: document.getElementById('notifyChannel').value
    };
    
    try {
        const res = await fetch('/api/settings/bot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            showNotification('✅ Настройки бота сохранены', 'success');
        }
    } catch (error) {
        showNotification('❌ Ошибка сохранения', 'error');
    }
}

// Сохранение настроек Twitch
async function saveTwitchSettings() {
    const data = {
        bot_name: document.getElementById('botName').value,
        bot_token: document.getElementById('botToken').value,
        client_id: document.getElementById('clientId').value,
        client_secret: document.getElementById('clientSecret').value
    };
    
    try {
        const res = await fetch('/api/settings/twitch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            showNotification('✅ Настройки Twitch сохранены', 'success');
        }
    } catch (error) {
        showNotification('❌ Ошибка сохранения', 'error');
    }
}

// Сохранение настроек YouTube
async function saveYoutubeSettings() {
    const data = {
        youtube_api_key: document.getElementById('youtubeApiKey').value,
        search_mode: document.getElementById('searchMode').value
    };
    
    try {
        const res = await fetch('/api/settings/youtube', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            showNotification('✅ Настройки YouTube сохранены', 'success');
        }
    } catch (error) {
        showNotification('❌ Ошибка сохранения', 'error');
    }
}

// Сохранение настроек виджетов
async function saveWidgetSettings() {
    const data = {
        widget_bg_color: document.getElementById('widgetBgColor').value,
        widget_accent_color: document.getElementById('widgetAccentColor').value,
        widget_opacity: document.getElementById('widgetOpacity').value
    };
    
    try {
        const res = await fetch('/api/settings/widgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            showNotification('✅ Настройки виджетов сохранены', 'success');
        }
    } catch (error) {
        showNotification('❌ Ошибка сохранения', 'error');
    }
}

// Очистка всей истории
async function clearAllData() {
    if (!confirm('⚠️ Вы уверены? Вся история заказов будет удалена навсегда!')) return;
    
    try {
        const res = await fetch('/api/admin/clear-history', { method: 'POST' });
        if (res.ok) {
            showNotification('✅ История очищена', 'success');
        }
    } catch (error) {
        showNotification('❌ Ошибка', 'error');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});