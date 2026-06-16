// Загрузка команд
async function loadCommands() {
    try {
        const res = await fetch('/api/commands');
        const commands = await res.json();
        
        const tbody = document.getElementById('commandsList');
        if (!commands || commands.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Нет добавленных команд</td></tr>';
            return;
        }
        
        tbody.innerHTML = commands.map(cmd => `
            <tr>
                <td><code>${escapeHtml(cmd.name)}</code></td>
                <td>${escapeHtml(cmd.response.substring(0, 50))}${cmd.response.length > 50 ? '...' : ''}</td>
                <td>${cmd.cooldown || 0} сек</td>
                <td>
                    <span class="status-${cmd.enabled ? 'enabled' : 'disabled'}">
                        ${cmd.enabled ? '✅ Вкл' : '❌ Выкл'}
                    </span>
                </td>
                <td>
                    <button onclick="editCommand('${cmd.name}')" style="background: #4ecdc4; border: none; border-radius: 4px; padding: 4px 8px; margin-right: 4px;">✏️</button>
                    <button onclick="deleteCommand('${cmd.name}')" style="background: #ff5555; border: none; border-radius: 4px; padding: 4px 8px;">🗑️</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки команд:', error);
    }
}

// Открыть модальное окно добавления команды
function openAddCommandModal() {
    document.getElementById('addCommandModal').style.display = 'block';
}

// Закрыть модальное окно
function closeAddCommandModal() {
    document.getElementById('addCommandModal').style.display = 'none';
    document.getElementById('cmdName').value = '';
    document.getElementById('cmdResponse').value = '';
    document.getElementById('cmdCooldown').value = '0';
}

// Добавить команду
async function addCommand() {
    const name = document.getElementById('cmdName').value.trim();
    const response = document.getElementById('cmdResponse').value.trim();
    const cooldown = parseInt(document.getElementById('cmdCooldown').value) || 0;
    
    if (!name || !response) {
        showNotification('Заполните все поля!', 'error');
        return;
    }
    
    if (!name.startsWith('!')) {
        showNotification('Команда должна начинаться с !', 'error');
        return;
    }
    
    try {
        const res = await fetch('/api/commands', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, response, cooldown })
        });
        
        if (res.ok) {
            showNotification('✅ Команда добавлена', 'success');
            closeAddCommandModal();
            loadCommands();
        } else {
            showNotification('❌ Ошибка', 'error');
        }
    } catch (error) {
        showNotification('❌ Ошибка', 'error');
    }
}

// Редактирование команды
async function editCommand(name) {
    const newResponse = prompt('Введите новый ответ для команды:', '');
    if (!newResponse) return;
    
    try {
        const res = await fetch(`/api/commands/${encodeURIComponent(name)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response: newResponse })
        });
        
        if (res.ok) {
            showNotification('✅ Команда обновлена', 'success');
            loadCommands();
        }
    } catch (error) {
        showNotification('❌ Ошибка', 'error');
    }
}

// Удаление команды
async function deleteCommand(name) {
    if (!confirm(`Удалить команду ${name}?`)) return;
    
    try {
        const res = await fetch(`/api/commands/${encodeURIComponent(name)}`, { method: 'DELETE' });
        
        if (res.ok) {
            showNotification('✅ Команда удалена', 'success');
            loadCommands();
        }
    } catch (error) {
        showNotification('❌ Ошибка', 'error');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadCommands();
    
    // Закрытие модального окна при клике вне его
    window.onclick = function(event) {
        const modal = document.getElementById('addCommandModal');
        if (event.target === modal) {
            closeAddCommandModal();
        }
    };
});