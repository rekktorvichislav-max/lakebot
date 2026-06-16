// Функции для страницы музыки

// Заказ трека
async function addSong() {
    const urlInput = document.getElementById('songUrl');
    const url = urlInput.value.trim();
    
    if (!url) {
        showNotification('Введите ссылку на YouTube', 'error');
        return;
    }
    
    const addBtn = document.querySelector('.add-btn');
    addBtn.textContent = '⏳ Загрузка...';
    addBtn.disabled = true;
    
    try {
        const res = await fetch('/api/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, user: currentUser?.username || 'Anonymous' })
        });
        
        const data = await res.json();
        
        if (data.success) {
            showNotification(`✅ ${data.message}`, 'success');
            urlInput.value = '';
            loadQueue();
        } else {
            showNotification(`❌ ${data.message}`, 'error');
        }
    } catch (error) {
        showNotification('❌ Ошибка подключения к серверу', 'error');
    } finally {
        addBtn.textContent = '🎵 ЗАКАЗАТЬ';
        addBtn.disabled = false;
    }
}

// Пропуск трека
async function skipTrack() {
    if (!confirm('Пропустить текущий трек?')) return;
    
    try {
        await fetch('/api/skip', { method: 'POST', body: JSON.stringify({ by: 'GUI' }), headers: { 'Content-Type': 'application/json' } });
        showNotification('⏭️ Трек пропущен', 'success');
    } catch (error) {
        showNotification('❌ Ошибка', 'error');
    }
}

// Возврат трека
async function backTrack() {
    try {
        const res = await fetch('/api/back', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            showNotification('⏮️ Трек возвращён', 'success');
        } else {
            showNotification('❌ Нет предыдущего трека', 'error');
        }
    } catch (error) {
        showNotification('❌ Ошибка', 'error');
    }
}

// Голосование за пропуск
async function voteSkip() {
    try {
        const res = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: currentUser?.username || 'Anonymous' })
        });
        const data = await res.json();
        
        if (data.skipped) {
            showNotification('🎫 Трек пропущен по голосованию!', 'success');
        } else if (data.success) {
            showNotification(`🎫 Голос учтён! (${data.votes}/${data.threshold})`, 'info');
        } else {
            showNotification(`❌ ${data.message}`, 'error');
        }
    } catch (error) {
        showNotification('❌ Ошибка', 'error');
    }
}

// Очистка очереди
async function clearQueue() {
    if (!confirm('Очистить всю очередь?')) return;
    
    try {
        await fetch('/api/clear', { method: 'POST' });
        showNotification('🗑️ Очередь очищена', 'success');
        loadQueue();
    } catch (error) {
        showNotification('❌ Ошибка', 'error');
    }
}

// Загрузка очереди
async function loadQueue() {
    try {
        const res = await fetch('/api/queue');
        const data = await res.json();
        updateQueueUI(data.queue);
        updateNowPlayingUI(data.current);
    } catch (error) {
        console.error('Ошибка загрузки очереди:', error);
    }
}

// Обновление UI очереди
function updateQueueUI(queue) {
    const container = document.getElementById('queueList');
    if (!container) return;
    
    if (!queue || queue.length === 0) {
        container.innerHTML = '<div class="empty-queue">✨ Очередь пуста ✨</div>';
        return;
    }
    
    container.innerHTML = queue.map((item, idx) => `
        <div class="queue-item">
            <div class="queue-number">${idx + 1}</div>
            <div class="queue-info">
                <div class="queue-title">${escapeHtml(item.title || item.video_id)}</div>
                <div class="queue-user">👤 ${escapeHtml(item.user)}</div>
            </div>
        </div>
    `).join('');
}

// Обновление UI текущего трека
function updateNowPlayingUI(current) {
    const npTitle = document.getElementById('npTitle');
    const npUser = document.getElementById('npUser');
    const npThumbnail = document.getElementById('npThumbnail');
    
    if (!npTitle) return;
    
    if (current) {
        npTitle.textContent = current.title || current.video_id;
        npUser.textContent = `👤 Заказал: ${current.user}`;
        if (npThumbnail) {
            npThumbnail.innerHTML = `<img src="${current.thumbnail || 'assets/default-cover.png'}" alt="cover">`;
        }
    } else {
        npTitle.textContent = 'Нет активного трека';
        npUser.textContent = '—';
        if (npThumbnail) {
            npThumbnail.innerHTML = `<img src="assets/default-cover.png" alt="cover">`;
        }
    }
}

// Обновление UI голосования
function updateVoteUI(voteData) {
    const voteCountSpan = document.getElementById('voteCount');
    const voteThresholdSpan = document.getElementById('voteThreshold');
    
    if (voteCountSpan) voteCountSpan.textContent = voteData.votes || 0;
    if (voteThresholdSpan) voteThresholdSpan.textContent = voteData.threshold || 2;
}

// HTML экранирование
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addSongBtn');
    if (addBtn) addBtn.addEventListener('click', addSong);
    
    const songInput = document.getElementById('songUrl');
    if (songInput) {
        songInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addSong();
        });
    }
    
    loadQueue();
});