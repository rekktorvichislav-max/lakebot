// Загрузка статистики для дашборда
async function loadDashboardStats() {
    try {
        const res = await fetch('/api/stats');
        const stats = await res.json();
        
        document.getElementById('statSongs').textContent = stats.total_songs || 0;
        document.getElementById('statUsers').textContent = stats.total_users || 0;
        document.getElementById('statCommands').textContent = stats.total_commands || 0;
        document.getElementById('statQueue').textContent = stats.queue_length || 0;
        
        // Обновляем "Сейчас играет"
        const nowPlayingTitle = document.getElementById('nowPlayingTitle');
        if (nowPlayingTitle && stats.current_song) {
            nowPlayingTitle.textContent = stats.current_song.title;
        }
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

// Загрузка последних заказов
async function loadRecentOrders() {
    try {
        const res = await fetch('/api/history?limit=10');
        const history = await res.json();
        
        const container = document.getElementById('recentList');
        if (!history || history.length === 0) {
            container.innerHTML = '<div class="recent-item">Нет заказов</div>';
            return;
        }
        
        container.innerHTML = history.map(item => `
            <div class="recent-item">
                <div class="recent-title">${escapeHtml(item.title || item.video_id)}</div>
                <div class="recent-user">👤 ${escapeHtml(item.user)}</div>
                <div class="recent-time">${formatTime(item.created_at)}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки истории:', error);
    }
}

// Загрузка активности для графика
async function loadActivityChart() {
    try {
        const res = await fetch('/api/stats/activity');
        const data = await res.json();
        
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels || ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                datasets: [{
                    label: 'Заказы',
                    data: data.values || [0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#9146ff',
                    backgroundColor: 'rgba(145, 70, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#e0e0ff' }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#e0e0ff' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#e0e0ff' }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Ошибка загрузки графика:', error);
    }
}

// Инициализация дашборда
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    loadRecentOrders();
    loadActivityChart();
    
    // Обновление каждые 30 секунд
    setInterval(() => {
        loadDashboardStats();
        loadRecentOrders();
    }, 30000);
});