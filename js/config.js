const API_URL = {
    SEARCH: 'https://api.siputzx.my.id/api/s/youtube',
    SEARCH_FALLBACK: 'https://apis.prexzyvilla.site/search/youtube',
    DOWNLOAD_MP3: 'https://api.nekolabs.web.id/downloader/youtube/v5',
    DOWNLOAD_MP3_FALLBACK: 'https://api.nekolabs.web.id/downloader/youtube/v4'
};

const APP_DEFAULTS = {
    DEFAULT_SEARCH: 'musik trending terbaru',
    RECOMMENDED_COUNT: 5,
    SEARCH_RESULT_COUNT: 5,
    MAX_RECENT_ITEMS: 15,
    MAX_QUEUE_ITEMS: 8,
    STORAGE_KEY: 'recentlyPlayed',
    FAVORITES_KEY: 'favoriteSongs',
    VOLUME_KEY: 'playerVolume',
    DEFAULT_QUALITY: '128kbps',
    SERVER: 'auto'
};

const DEFAULT_THUMBNAIL = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="thumb" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23646cff" offset="0"/><stop stop-color="%23feb47b" offset="1"/></linearGradient></defs><rect width="300" height="300" fill="url(%23thumb)"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="30" font-family="Arial" fill="white">Music</text></svg>';

const OFFLINE_AUDIO_SRC = 'data:audio/wav;base64,' +
    'UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YSADAAAAAOAP4R1YKAsuTC4TKf8eQRF4AYTxRuNt2EHSf9E81urfY+0P/RMNjRvEJmYt' +
    'qi5pKiUh9RNpBFj0p+UU2v3SONH71NXdueoh+jkKHRkJJZQs2i6VKykjlRZVBzj3JOji2+bTINHm0+LbJOg491UHlRYpI5Ur2i6ULAklHRk5CiH6uerV3fvU' +
    'ONH90hTap+VY9GkE9RMlIWkqqi5mLcQmjRsTDQ/9Y+3q3zzWf9FB0m3YRuOE8XgBQRH/HhMpTC4LLlgo4R3gDwAAIPAf4qjX9dG00e3WAeG/7oj+fA66HJMn' +
    'vy2BLsQpFiCdEvEC7fJz5DzZmtJW0ZfV294L7Jf7qAtZGuwlAy3ILgUrKyJHFd8Fx/Xj5vfabNMm0WvU19xr6av4yAjcFx4kGizgLhosHiTcF8gIq/hr6dfc' +
    'a9Qm0WzT99rj5sf13wVHFSsiBSvILgMt7CVZGqgLl/sL7Nvel9VW0ZrSPNlz5O3y8QKdEhYgxCmBLr8tkye6HHwOiP6/7gHh7da00fXRqNcf4iDwAADgD+Ed' +
    'WCgLLkwuEyn/HkEReAGE8UbjbdhB0n/RPNbq32PtD/0TDY0bxCZmLaouaSolIfUTaQRY9KflFNr90jjR+9TV3bnqIfo5Ch0ZCSWULNoulSspI5UWVQc49yTo' +
    '4tvm0yDR5tPi2yToOPdVB5UWKSOVK9oulCwJJR0ZOQoh+rnq1d371DjR/dIU2qflWPRpBPUTJSFpKqouZi3EJo0bEw0P/WPt6t881n/RQdJt2EbjhPF4AUER' +
    '/x4TKUwuCy5YKOEd4A8AACDwH+Ko1/XRtNHt1gHhv+6I/nwOuhyTJ78tgS7EKRYgnRLxAu3yc+Q82ZrSVtGX1dveC+yX+6gLWRrsJQMtyC4FKysiRxXfBcf1' +
    '4+b32mzTJtFr1Nfca+mr+MgI3BceJBos4C4aLB4k3BfICKv4a+nX3GvUJtFs0/fa4+bH9d8FRxUrIgUryC4DLewlWRqoC5f7C+zb3pfVVtGa0jzZc+Tt8vEC' +
    'nRIWIMQpgS6/LZMnuhx8Doj+v+4B4e3WtNH10ajXH+Ig8A==';

const OFFLINE_SONGS = [
    {
        id: 'offline-1',
        title: 'Nada Sunrise',
        artist: 'Music Player',
        thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g1" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23ff7e5f" offset="0"/><stop stop-color="%23feb47b" offset="1"/></linearGradient></defs><rect width="300" height="300" fill="url(%23g1)"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="36" font-family="Arial" fill="white">Sunrise</text></svg>',
        duration: 2,
        timestamp: '0:02',
        videoUrl: OFFLINE_AUDIO_SRC,
        audioUrl: OFFLINE_AUDIO_SRC,
        views: '1200'
    },
    {
        id: 'offline-2',
        title: 'Langkah Ringan',
        artist: 'Music Player',
        thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g2" x1="0" x2="1" y1="1" y2="0"><stop stop-color="%2336d1dc" offset="0"/><stop stop-color="%235ffbf1" offset="1"/></linearGradient></defs><rect width="300" height="300" fill="url(%23g2)"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="32" font-family="Arial" fill="white">Ringan</text></svg>',
        duration: 2,
        timestamp: '0:02',
        videoUrl: OFFLINE_AUDIO_SRC,
        audioUrl: OFFLINE_AUDIO_SRC,
        views: '980'
    },
    {
        id: 'offline-3',
        title: 'Senandung Malam',
        artist: 'Music Player',
        thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g3" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%235a3f37" offset="0"/><stop stop-color="%232e1f24" offset="1"/></linearGradient></defs><rect width="300" height="300" fill="url(%23g3)"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="30" font-family="Arial" fill="white">Malam</text></svg>',
        duration: 2,
        timestamp: '0:02',
        videoUrl: OFFLINE_AUDIO_SRC,
        audioUrl: OFFLINE_AUDIO_SRC,
        views: '1530'
    },
    {
        id: 'offline-4',
        title: 'Langit Cerah',
        artist: 'Music Player',
        thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g4" x1="0" x2="1" y1="1" y2="0"><stop stop-color="%237477c0" offset="0"/><stop stop-color="%23646cff" offset="1"/></linearGradient></defs><rect width="300" height="300" fill="url(%23g4)"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="30" font-family="Arial" fill="white">Cerah</text></svg>',
        duration: 2,
        timestamp: '0:02',
        videoUrl: OFFLINE_AUDIO_SRC,
        audioUrl: OFFLINE_AUDIO_SRC,
        views: '2210'
    },
    {
        id: 'offline-5',
        title: 'Kilau Kota',
        artist: 'Music Player',
        thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g5" x1="0" x2="1" y1="0" y2="1"><stop stop-color="%23ff9966" offset="0"/><stop stop-color="%23ff5e62" offset="1"/></linearGradient></defs><rect width="300" height="300" fill="url(%23g5)"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="30" font-family="Arial" fill="white">Kota</text></svg>',
        duration: 2,
        timestamp: '0:02',
        videoUrl: OFFLINE_AUDIO_SRC,
        audioUrl: OFFLINE_AUDIO_SRC,
        views: '1875'
    }
];

const CONTRIBUTORS_DATA = [
    {
        name: 'FastURL API',
        photo: 'https://cloudkuimages.guru/uploads/images/683f272fb23a0.jpg',
        description: 'Penyedia API YouTube Search & Download'
    },
    {
        name: 'FlowFalcon',
        photo: 'https://cloudkuimages.guru/uploads/images/683f2708af49d.jpg',
        description: 'Penyedia Template Web.'
    },
    {
        name: 'Aka',
        photo: DEFAULT_THUMBNAIL,
        description: 'Pengembang Dan Update Source Web'
    }
];

const UTILS = {
    formatTime: function(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    parseDuration: function(duration) {
        if (!duration) return 0;

        if (typeof duration === 'number') {
            return duration;
        }

        const timeParts = duration.split(':').map(part => parseInt(part, 10));
        if (timeParts.length === 3) {
            return timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
        }

        if (timeParts.length === 2) {
            return timeParts[0] * 60 + timeParts[1];
        }

        return 0;
    },
    
    needsScrolling: function(text, maxLength = 20) {
        return text && text.length > maxLength;
    },
    
    formatSong: function(item) {
        const durationInSeconds = this.parseDuration(item.duration || item.duration_raw || item.timestamp);
        const videoId = item.id || item.videoId || item.video_id || '';

        return {
            id: videoId,
            title: item.title || 'Unknown Title',
            artist: item.channel || item.author || item.uploader || 'Unknown Artist',
            thumbnail: item.thumbnail || item.thumbnail_url || item.image || DEFAULT_THUMBNAIL,
            duration: durationInSeconds,
            timestamp: item.duration_formatted || item.timestamp || this.formatTime(durationInSeconds) || '0:00',
            videoUrl: item.url || item.link || item.videoUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''),
            audioUrl: item.audioUrl || item.audio_url || OFFLINE_AUDIO_SRC,
            views: item.views || '0'
        };
    },

    formatSearchResults: function(items) {
        if (!items) return [];

        const candidates = [
            items,
            items?.data,
            items?.results,
            items?.items,
            items?.result,
            items?.data?.result,
            items?.data?.items
        ];

        const sourceItems = candidates.find(Array.isArray) || [];

        return sourceItems.map(item => this.formatSong(item));
    },

    searchOfflineSongs: function(query, limit = APP_DEFAULTS.SEARCH_RESULT_COUNT) {
        if (!query) return this.limitSongs(OFFLINE_SONGS, limit).map(item => this.formatSong(item));

        const lowerQuery = query.toLowerCase();
        const filtered = OFFLINE_SONGS.filter(song =>
            song.title.toLowerCase().includes(lowerQuery) ||
            song.artist.toLowerCase().includes(lowerQuery)
        );

        return this.limitSongs(filtered.length ? filtered : OFFLINE_SONGS, limit)
            .map(item => this.formatSong(item));
    },

    limitSongs: function(songs, limit = APP_DEFAULTS.SEARCH_RESULT_COUNT) {
        return Array.isArray(songs) ? songs.slice(0, limit) : [];
    },

    getOfflineRecommendations: function() {
        return this.limitSongs(OFFLINE_SONGS, APP_DEFAULTS.RECOMMENDED_COUNT)
            .map(item => this.formatSong(item));
    },
    
    getDownloadUrl: function(data) {
        if (!data) return null;

        if (data.download_url) return data.download_url;
        if (data.url) return data.url;
        if (data.result && data.result.download_url) return data.result.download_url;
        if (data.result && data.result.url) return data.result.url;
        if (data.data && data.data.download_url) return data.data.download_url;
        if (data.data && data.data.url) return data.data.url;

        return null;
    },

    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
};