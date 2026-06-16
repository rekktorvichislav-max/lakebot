const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const axios = require('axios');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

// Twitch OAuth
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '';
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || '';
const TWITCH_REDIRECT_URI = `http://localhost:${PORT}/auth/twitch/callback`;

// База данных
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const db = new sqlite3.Database(path.join(dbDir, 'lakebot.db'));

// ==================== СОЗДАНИЕ ТАБЛИЦ ====================
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        twitch_id TEXT UNIQUE,
        avatar TEXT,
        role TEXT DEFAULT 'viewer',
        is_owner INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS moderators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        twitch_id TEXT,
        avatar TEXT,
        added_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT,
        title TEXT,
        user_name TEXT,
        user_id INTEGER,
        duration INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT,
        title TEXT,
        user_name TEXT,
        user_id INTEGER,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        token TEXT,
        expires DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS chat_commands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        command_name TEXT UNIQUE,
        permission TEXT DEFAULT 'everyone',
        enabled INTEGER DEFAULT 1,
        cooldown INTEGER DEFAULT 5,
        response TEXT,
        aliases TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS banned_words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Настройки по умолчанию
    const defaultSettings = [
        ['max_duration', '480'],
        ['max_tracks_per_user', '5'],
        ['vote_threshold', '2'],
        ['site_name', 'LakeBot'],
        ['site_theme', 'purple'],
        ['language', 'ru'],
        ['marquee_enabled', 'true'],
        ['marquee_speed', '15'],
        ['cmd_prefix', '!'],
        ['bot_status', 'online']
    ];
    
    defaultSettings.forEach(([key, value]) => {
        db.get(`SELECT * FROM settings WHERE key = ?`, [key], (err, row) => {
            if (!row) db.run(`INSERT INTO settings (key, value) VALUES (?, ?)`, [key, value]);
        });
    });
    
    // Команды по умолчанию
    const defaultChatCommands = [
        ['!sr', 'everyone', 5, '🎵 Заказ трека: !sr [ссылка YouTube]', '!rs,!request'],
        ['!play', 'everyone', 5, '🎵 Заказ трека: !play [ссылка YouTube]', ''],
        ['!skip', 'moderator', 10, '⏭ Пропуск текущего трека', '!next'],
        ['!back', 'moderator', 10, '◀ Вернуться к предыдущему треку', '!previous'],
        ['!queue', 'everyone', 3, '📋 Показать текущую очередь', '!list,!q'],
        ['!voteskip', 'everyone', 5, '🗳 Голосовать за пропуск трека', '!vote'],
        ['!clear', 'broadcaster', 5, '🗑 Очистить всю очередь', '!purge'],
        ['!help', 'everyone', 3, '📜 Список доступных команд', '!commands']
    ];
    
    defaultChatCommands.forEach(([name, permission, cooldown, response, aliases]) => {
        db.get(`SELECT * FROM chat_commands WHERE command_name = ?`, [name], (err, row) => {
            if (!row) db.run(`INSERT INTO chat_commands (command_name, permission, cooldown, response, aliases) VALUES (?, ?, ?, ?, ?)`, 
                [name, permission, cooldown, response, aliases]);
        });
    });
});

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/widgets', express.static(path.join(__dirname, '../frontend/widgets')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use('/sounds', express.static(path.join(__dirname, '../sounds')));

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let songQueue = [];
let historyList = [];
let currentSong = null;
let voteSkip = new Set();
let settingsCache = {};
let chatCommandsCache = {};
let moderatorsList = [];
let bannedWordsList = [];

// ==================== ЗАГРУЗКА ДАННЫХ ====================
function loadSettings() {
    db.all(`SELECT * FROM settings`, (err, rows) => {
        if (rows) rows.forEach(row => { settingsCache[row.key] = row.value; });
    });
}
loadSettings();

function loadChatCommands() {
    db.all(`SELECT * FROM chat_commands WHERE enabled = 1`, (err, rows) => {
        chatCommandsCache = {};
        if (rows) {
            rows.forEach(row => { 
                chatCommandsCache[row.command_name] = { 
                    permission: row.permission, 
                    cooldown: row.cooldown, 
                    response: row.response,
                    aliases: row.aliases ? row.aliases.split(',') : []
                };
            });
        }
    });
}
loadChatCommands();

function loadModerators() {
    db.all(`SELECT username, avatar FROM moderators`, (err, rows) => {
        moderatorsList = rows ? rows.map(r => ({ username: r.username, avatar: r.avatar })) : [];
    });
}
loadModerators();

function loadBannedWords() {
    db.all(`SELECT word FROM banned_words`, (err, rows) => {
        bannedWordsList = rows ? rows.map(r => r.word) : [];
    });
}
loadBannedWords();

function getSetting(key, defaultValue) {
    return settingsCache[key] || defaultValue;
}

// ==================== УТИЛИТЫ ====================
function extractVideoId(url) {
    if (!url) return null;
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function getVideoTitle(videoId) {
    if (!YOUTUBE_API_KEY) {
        return 'Заказанный трек';
    }
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: { part: 'snippet', id: videoId, key: YOUTUBE_API_KEY }
        });
        if (response.data.items && response.data.items[0]) {
            return response.data.items[0].snippet.title;
        }
        return 'Заказанный трек';
    } catch (error) {
        return 'Заказанный трек';
    }
}

async function getVideoInfo(videoId) {
    const title = await getVideoTitle(videoId);
    return { 
        title: title, 
        thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        success: true
    };
}

function addToQueue(song, userName, userId) {
    songQueue.push({ ...song, userName, userId, requestedAt: new Date() });
    io.emit('queueUpdate', songQueue);
    if (!currentSong) playNext();
    return songQueue.length;
}

function playNext() {
    if (songQueue.length > 0) {
        currentSong = songQueue.shift();
        voteSkip.clear();
        io.emit('currentUpdate', currentSong);
        io.emit('queueUpdate', songQueue);
        const threshold = parseInt(getSetting('vote_threshold', '2'));
        io.emit('voteUpdate', { votes: 0, threshold: threshold });
        io.emit('statsUpdate', { queue_length: songQueue.length, votes: 0 });
    } else {
        currentSong = null;
        io.emit('currentUpdate', null);
    }
}

// ==================== API РОУТЫ ====================

// --- Музыка ---
app.get('/api/queue', (req, res) => {
    res.json({ queue: songQueue, current: currentSong });
});

app.get('/api/current', (req, res) => {
    res.json(currentSong);
});

app.post('/api/add', async (req, res) => {
    const { url, user, userId } = req.body;
    const videoId = extractVideoId(url);
    const maxTracks = parseInt(getSetting('max_tracks_per_user', '5'));
    
    if (!videoId) {
        return res.json({ success: false, message: '❌ Неверная ссылка YouTube' });
    }
    
    if (songQueue.some(s => s.video_id === videoId) || (currentSong && currentSong.video_id === videoId)) {
        return res.json({ success: false, message: '❌ Этот трек уже в очереди или играет!' });
    }
    
    const userSongs = songQueue.filter(s => s.userName === user).length;
    if (userSongs >= maxTracks) {
        return res.json({ success: false, message: `❌ Максимум ${maxTracks} треков на пользователя!` });
    }
    
    const info = await getVideoInfo(videoId);
    
    db.run(`INSERT INTO songs (video_id, title, user_name, user_id) VALUES (?, ?, ?, ?)`, 
        [videoId, info.title, user, userId || 0]);
    db.run(`INSERT INTO history (video_id, title, user_name, user_id, status) VALUES (?, ?, ?, ?, 'requested')`, 
        [videoId, info.title, user, userId || 0]);
    
    const position = addToQueue({ video_id: videoId, title: info.title, thumbnail: info.thumbnail }, user, userId);
    res.json({ success: true, message: `✅ Трек "${info.title}" добавлен в очередь!`, position: position });
});

app.post('/api/skip', (req, res) => {
    if (currentSong) {
        db.run(`UPDATE history SET status = 'skipped' WHERE video_id = ? AND status = 'requested'`, [currentSong.video_id]);
        historyList.push({ ...currentSong });
        playNext();
        res.json({ success: true, message: '⏭️ Трек пропущен' });
    } else {
        res.json({ success: false, message: '❌ Нет активного трека' });
    }
});

app.post('/api/back', (req, res) => {
    if (historyList.length > 0) {
        const lastSong = historyList.pop();
        songQueue.unshift(lastSong);
        io.emit('queueUpdate', songQueue);
        if (!currentSong) playNext();
        res.json({ success: true, message: '◀️ Вернулись к предыдущему треку' });
    } else {
        res.json({ success: false, message: '❌ Нет предыдущих треков' });
    }
});

app.post('/api/clear', (req, res) => {
    songQueue = [];
    io.emit('queueUpdate', songQueue);
    res.json({ success: true, message: '🗑️ Очередь очищена' });
});

app.post('/api/vote', (req, res) => {
    const { user } = req.body;
    const voteThreshold = parseInt(getSetting('vote_threshold', '2'));
    
    if (!currentSong) return res.json({ success: false, message: '❌ Нет активного трека' });
    if (voteSkip.has(user)) return res.json({ success: false, message: '❌ Вы уже голосовали!' });
    
    voteSkip.add(user);
    const votes = voteSkip.size;
    io.emit('voteUpdate', { votes, threshold: voteThreshold });
    
    if (votes >= voteThreshold) {
        db.run(`UPDATE history SET status = 'skipped' WHERE video_id = ? AND status = 'requested'`, [currentSong.video_id]);
        historyList.push({ ...currentSong });
        playNext();
        return res.json({ success: true, skipped: true, message: '🎫 Трек пропущен по голосованию!' });
    }
    res.json({ success: true, skipped: false, votes, threshold: voteThreshold, message: `🎫 Голос учтён! (${votes}/${voteThreshold})` });
});

// --- История ---
app.get('/api/history', (req, res) => {
    const limit = req.query.limit || 50;
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    const from = req.query.from || '';
    const to = req.query.to || '';
    
    let query = `SELECT * FROM history WHERE 1=1`;
    const params = [];
    
    if (search) {
        query += ` AND (title LIKE ? OR user_name LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }
    if (status !== 'all') {
        query += ` AND status = ?`;
        params.push(status);
    }
    if (from) {
        query += ` AND date(created_at) >= date(?)`;
        params.push(from);
    }
    if (to) {
        query += ` AND date(created_at) <= date(?)`;
        params.push(to);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(parseInt(limit));
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const formatted = rows.map(row => ({
                ...row,
                user: row.user_name
            }));
            res.json(formatted || []);
        }
    });
});

app.get('/api/history/export', (req, res) => {
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    
    let query = `SELECT * FROM history WHERE 1=1`;
    const params = [];
    
    if (search) {
        query += ` AND (title LIKE ? OR user_name LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }
    if (status !== 'all') {
        query += ` AND status = ?`;
        params.push(status);
    }
    query += ` ORDER BY created_at DESC`;
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        let csv = 'ID,Название,Пользователь,Статус,Дата\n';
        rows.forEach(row => {
            const statusMap = {
                'requested': 'Заказан',
                'played': 'Сыгран',
                'skipped': 'Пропущен'
            };
            csv += `${row.id},"${row.title || row.video_id}",${row.user_name},${statusMap[row.status] || row.status},${row.created_at}\n`;
        });
        
        res.header('Content-Type', 'text/csv');
        res.attachment('history_export.csv');
        res.send(csv);
    });
});

// --- Статистика ---
app.get('/api/stats', (req, res) => {
    db.get(`SELECT COUNT(*) as total_songs FROM songs`, (err, songsCount) => {
        db.get(`SELECT COUNT(DISTINCT user_name) as total_users FROM songs`, (err, usersCount) => {
            db.get(`SELECT COUNT(*) as total_commands FROM chat_commands`, (err, commandsCount) => {
                res.json({
                    total_songs: songsCount?.total_songs || 0,
                    total_users: usersCount?.total_users || 0,
                    total_commands: commandsCount?.total_commands || 0,
                    queue_length: songQueue.length,
                    current_song: currentSong,
                    votes: voteSkip.size,
                    threshold: parseInt(getSetting('vote_threshold', '2'))
                });
            });
        });
    });
});

app.get('/api/stats/activity', (req, res) => {
    db.all(`SELECT strftime('%w', created_at) as day, COUNT(*) as count 
            FROM history 
            WHERE created_at >= date('now', '-7 days')
            GROUP BY day 
            ORDER BY day`, (err, rows) => {
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const values = new Array(7).fill(0);
        if (rows) {
            rows.forEach(row => {
                const index = parseInt(row.day) === 0 ? 6 : parseInt(row.day) - 1;
                if (index >= 0 && index < 7) values[index] = row.count;
            });
        }
        res.json({ labels: days, values: values });
    });
});

// --- Команды чата ---
app.get('/api/chat-commands', (req, res) => {
    db.all(`SELECT * FROM chat_commands ORDER BY command_name`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const result = {};
            rows.forEach(row => {
                result[row.command_name] = {
                    permission: row.permission,
                    cooldown: row.cooldown,
                    response: row.response || '',
                    aliases: row.aliases ? row.aliases.split(',') : []
                };
            });
            res.json(result);
        }
    });
});

app.get('/api/chat-commands/:name', (req, res) => {
    const { name } = req.params;
    db.get(`SELECT * FROM chat_commands WHERE command_name = ?`, [name], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Command not found' });
        } else {
            res.json({
                command_name: row.command_name,
                permission: row.permission,
                cooldown: row.cooldown,
                response: row.response,
                aliases: row.aliases ? row.aliases.split(',') : [],
                enabled: row.enabled === 1
            });
        }
    });
});

app.post('/api/chat-commands', (req, res) => {
    const { command_name, permission, cooldown, response, aliases, enabled } = req.body;
    db.run(`INSERT OR REPLACE INTO chat_commands (command_name, permission, cooldown, response, aliases, enabled) VALUES (?, ?, ?, ?, ?, ?)`, 
        [command_name, permission || 'everyone', cooldown || 5, response || '', aliases || '', enabled !== undefined ? (enabled ? 1 : 0) : 1], 
        (err) => {
            if (!err) loadChatCommands();
            res.json({ success: !err, error: err ? err.message : null });
        });
});

app.put('/api/chat-commands/:name', (req, res) => {
    const { name } = req.params;
    const { permission, cooldown, response, aliases, enabled } = req.body;
    
    let query = `UPDATE chat_commands SET`;
    const params = [];
    const updates = [];
    
    if (permission !== undefined) { updates.push(' permission = ?'); params.push(permission); }
    if (cooldown !== undefined) { updates.push(' cooldown = ?'); params.push(cooldown); }
    if (response !== undefined) { updates.push(' response = ?'); params.push(response); }
    if (aliases !== undefined) { updates.push(' aliases = ?'); params.push(aliases); }
    if (enabled !== undefined) { updates.push(' enabled = ?'); params.push(enabled ? 1 : 0); }
    
    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }
    
    query += updates.join(',') + ' WHERE command_name = ?';
    params.push(name);
    
    db.run(query, params, (err) => {
        if (!err) loadChatCommands();
        res.json({ success: !err, error: err ? err.message : null });
    });
});

app.delete('/api/chat-commands/:name', (req, res) => {
    const { name } = req.params;
    db.run(`DELETE FROM chat_commands WHERE command_name = ?`, [name], (err) => {
        if (!err) loadChatCommands();
        res.json({ success: !err, error: err ? err.message : null });
    });
});

// --- Модераторы ---
app.get('/api/moderators', (req, res) => {
    res.json({ moderators: moderatorsList });
});

app.post('/api/moderators/add', (req, res) => {
    const { username, avatar, added_by } = req.body;
    db.run(`INSERT OR IGNORE INTO moderators (username, avatar, added_by) VALUES (?, ?, ?)`, 
        [username.toLowerCase(), avatar || '', added_by || ''], 
        (err) => {
            if (!err) loadModerators();
            res.json({ success: !err, message: err ? 'Ошибка добавления' : '✅ Модератор добавлен' });
        });
});

app.post('/api/moderators/remove', (req, res) => {
    const { username } = req.body;
    db.run(`DELETE FROM moderators WHERE username = ?`, [username.toLowerCase()], 
        (err) => {
            if (!err) loadModerators();
            res.json({ success: !err });
        });
});

// --- Поиск Twitch пользователей ---
app.get('/api/search-twitch', async (req, res) => {
    const { q } = req.query;
    if (!q || q.length < 2) {
        return res.json({ users: [] });
    }
    
    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
        return res.json({ users: [] });
    }
    
    try {
        const tokenRes = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        });
        
        const accessToken = tokenRes.data.access_token;
        
        const searchRes = await axios.get('https://api.twitch.tv/helix/search/channels', {
            params: { query: q, first: 20 },
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        const users = searchRes.data.data.map(user => ({
            username: user.broadcaster_login,
            display_name: user.display_name,
            avatar: user.thumbnail_url.replace('{width}', '50').replace('{height}', '50'),
            id: user.id
        }));
        
        res.json({ users });
    } catch (error) {
        console.error('Twitch search error:', error.message);
        res.json({ users: [] });
    }
});

// --- Бан-слова ---
app.get('/api/banned-words', (req, res) => {
    db.all(`SELECT word FROM banned_words`, (err, rows) => {
        res.json({ words: rows ? rows.map(r => r.word) : [] });
    });
});

app.post('/api/banned-words', (req, res) => {
    const { word } = req.body;
    if (!word || word.trim().length < 1) {
        return res.json({ success: false, message: '❌ Введите слово' });
    }
    db.run(`INSERT OR IGNORE INTO banned_words (word) VALUES (?)`, [word.toLowerCase().trim()], (err) => {
        if (!err) loadBannedWords();
        res.json({ success: !err, message: err ? '❌ Ошибка' : '✅ Слово добавлено' });
    });
});

app.delete('/api/banned-words/:word', (req, res) => {
    const { word } = req.params;
    db.run(`DELETE FROM banned_words WHERE word = ?`, [word.toLowerCase()], (err) => {
        if (!err) loadBannedWords();
        res.json({ success: !err });
    });
});

// --- Настройки ---
app.get('/api/settings', (req, res) => {
    db.all(`SELECT * FROM settings`, (err, rows) => {
        const settings = {};
        if (rows) rows.forEach(row => { settings[row.key] = row.value; });
        res.json(settings);
    });
});

app.post('/api/settings', (req, res) => {
    const { key, value } = req.body;
    db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, value], (err) => {
        if (!err) {
            loadSettings();
            if (key === 'site_theme') {
                io.emit('themeUpdate', value);
            }
            if (key === 'language') {
                io.emit('languageUpdate', value);
            }
        }
        res.json({ success: !err, error: err ? err.message : null });
    });
});

app.post('/api/settings/bot', (req, res) => {
    const { cmd_prefix, bot_status, notify_channel } = req.body;
    const settings = [
        ['cmd_prefix', cmd_prefix],
        ['bot_status', bot_status],
        ['notify_channel', notify_channel]
    ];
    let success = true;
    settings.forEach(([key, value]) => {
        if (value !== undefined) {
            db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, value], (err) => {
                if (err) success = false;
            });
        }
    });
    loadSettings();
    res.json({ success });
});

app.post('/api/settings/twitch', (req, res) => {
    const { bot_name, bot_token, client_id, client_secret } = req.body;
    const settings = [
        ['twitch_bot_name', bot_name],
        ['twitch_bot_token', bot_token],
        ['twitch_client_id', client_id],
        ['twitch_client_secret', client_secret]
    ];
    let success = true;
    settings.forEach(([key, value]) => {
        if (value !== undefined) {
            db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, value], (err) => {
                if (err) success = false;
            });
        }
    });
    loadSettings();
    res.json({ success });
});

app.post('/api/settings/youtube', (req, res) => {
    const { youtube_api_key, search_mode } = req.body;
    const settings = [
        ['youtube_api_key', youtube_api_key],
        ['search_mode', search_mode]
    ];
    let success = true;
    settings.forEach(([key, value]) => {
        if (value !== undefined) {
            db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, value], (err) => {
                if (err) success = false;
            });
        }
    });
    loadSettings();
    res.json({ success });
});

app.post('/api/settings/widgets', (req, res) => {
    const { widget_bg_color, widget_accent_color, widget_opacity } = req.body;
    const settings = [
        ['widget_bg_color', widget_bg_color],
        ['widget_accent_color', widget_accent_color],
        ['widget_opacity', widget_opacity]
    ];
    let success = true;
    settings.forEach(([key, value]) => {
        if (value !== undefined) {
            db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, value], (err) => {
                if (err) success = false;
            });
        }
    });
    loadSettings();
    res.json({ success });
});

// --- Тема (отдельный роут) ---
app.post('/api/theme', (req, res) => {
    const { theme } = req.body;
    db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('site_theme', ?)`, [theme], (err) => {
        if (!err) {
            loadSettings();
            io.emit('themeUpdate', theme);
        }
        res.json({ success: !err });
    });
});

// --- Админ ---
app.post('/api/admin/clear-history', (req, res) => {
    db.run(`DELETE FROM history`, (err) => {
        res.json({ success: !err });
    });
});

// ==================== TWITCH AUTH ====================
app.get('/auth/twitch', (req, res) => {
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_REDIRECT_URI}&response_type=code&scope=chat:read+chat:edit+user:read:email`;
    res.redirect(authUrl);
});

app.get('/auth/twitch/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.redirect('/');
    
    try {
        const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: TWITCH_REDIRECT_URI
            }
        });
        
        const { access_token } = tokenResponse.data;
        
        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: { 'Client-ID': TWITCH_CLIENT_ID, 'Authorization': `Bearer ${access_token}` }
        });
        
        const twitchUser = userResponse.data.data[0];
        
        db.get(`SELECT COUNT(*) as count FROM users WHERE is_owner = 1`, (err, ownerCount) => {
            const isOwner = ownerCount?.count === 0;
            
            db.get(`SELECT * FROM users WHERE username = ?`, [twitchUser.login], (err, user) => {
                if (!user) {
                    db.run(`INSERT INTO users (username, twitch_id, avatar, role, is_owner) VALUES (?, ?, ?, ?, ?)`,
                        [twitchUser.login, twitchUser.id, twitchUser.profile_image_url, isOwner ? 'broadcaster' : 'viewer', isOwner ? 1 : 0]);
                }
                
                const sessionToken = Math.random().toString(36).substring(2);
                db.run(`INSERT INTO sessions (user_id, token) VALUES (?, ?)`, [user?.id || 1, sessionToken]);
                res.cookie('lakebot_session', sessionToken, { maxAge: 7 * 24 * 60 * 60 * 1000 });
                res.redirect('/');
            });
        });
    } catch (error) {
        console.error('Twitch auth error:', error);
        res.redirect('/');
    }
});

app.get('/api/auth/me', (req, res) => {
    const sessionToken = req.cookies?.lakebot_session;
    if (!sessionToken) return res.json({ authenticated: false });
    
    db.get(`SELECT u.id, u.username, u.avatar, u.role, u.is_owner FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = ?`, [sessionToken], (err, user) => {
        if (user) {
            const isModerator = moderatorsList.some(m => m.username === user.username);
            res.json({ authenticated: true, user: { ...user, isModerator } });
        } else {
            res.json({ authenticated: false });
        }
    });
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('lakebot_session');
    res.json({ success: true });
});

// ==================== СТРАНИЦЫ ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/music', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/music.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

app.get('/widgets', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/widgets.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/settings.html'));
});

app.get('/moderators', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/moderators.html'));
});

app.get('/moderation', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/moderation.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// ==================== SOCKET.IO ====================
io.on('connection', (socket) => {
    console.log('[Socket] Новое подключение');
    socket.emit('queueUpdate', songQueue);
    socket.emit('currentUpdate', currentSong);
    const threshold = parseInt(getSetting('vote_threshold', '2'));
    socket.emit('voteUpdate', { votes: voteSkip.size, threshold: threshold });
    socket.emit('statsUpdate', { queue_length: songQueue.length, votes: voteSkip.size });
    
    const currentTheme = getSetting('site_theme', 'purple');
    socket.emit('themeUpdate', currentTheme);
    
    const currentLanguage = getSetting('language', 'ru');
    socket.emit('languageUpdate', currentLanguage);
});

// ==================== ЗАПУСК ====================
server.listen(PORT, () => {
    console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║                    LAKEBOT WEB SERVER                        ║`);
    console.log(`╠══════════════════════════════════════════════════════════════╣`);
    console.log(`║  🌐 http://localhost:${PORT}                                  ║`);
    console.log(`║  🎵 Музыка: http://localhost:${PORT}/music                    ║`);
    console.log(`║  📊 Статистика: http://localhost:${PORT}/dashboard           ║`);
    console.log(`║  ⚙️ Настройки: http://localhost:${PORT}/settings              ║`);
    console.log(`║  👥 Модераторы: http://localhost:${PORT}/moderators           ║`);
    console.log(`║  🧩 Виджеты: http://localhost:${PORT}/widgets                 ║`);
    
    if (!YOUTUBE_API_KEY) {
        console.log(`\n⚠️ YouTube API ключ не настроен!`);
        console.log(`   Названия треков будут показываться как "Заказанный трек"`);
        console.log(`   Чтобы получить ключ: https://console.cloud.google.com/`);
    } else {
        console.log(`\n✅ YouTube API ключ настроен!`);
    }
    
    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
        console.log(`\n⚠️ Twitch OAuth не настроен!`);
        console.log(`   Авторизация через Twitch не будет работать`);
        console.log(`   Настройте TWITCH_CLIENT_ID и TWITCH_CLIENT_SECRET в .env`);
    } else {
        console.log(`\n✅ Twitch OAuth настроен!`);
    }
    console.log(`╚══════════════════════════════════════════════════════════════╝\n`);
});