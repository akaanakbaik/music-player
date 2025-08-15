const API_URL = {
    SEARCH: 'https://api.fasturl.link/youtube/search',
    DOWNLOAD_MP3: 'https://api.fasturl.link/downup/ytmp3'
};

const APP_DEFAULTS = {
    DEFAULT_SEARCH: 'popular songs 2025',
    MAX_RECENT_ITEMS: 15,
    MAX_QUEUE_ITEMS: 8,
    STORAGE_KEY: 'recentlyPlayed',
    FAVORITES_KEY: 'favoriteSongs',
    VOLUME_KEY: 'playerVolume',
    DEFAULT_QUALITY: '128kbps',
    SERVER: 'auto'
};

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
        photo: './media/aka.jpg',
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
    
    needsScrolling: function(text, maxLength = 20) {
        return text && text.length > maxLength;
    },
    
    formatSong: function(item) {
        return {
            id: item.id || item.videoId || '',
            title: item.title || 'Unknown Title',
            artist: item.channel || item.author || 'Unknown Artist',
            thumbnail: item.thumbnail || '/api/placeholder/300/300',
            duration: item.duration || 0,
            timestamp: item.duration_formatted || '0:00',
            videoUrl: item.url || `https://www.youtube.com/watch?v=${item.id}`,
            views: item.views || '0'
        };
    },
    
    formatSearchResults: function(items) {
        if (!Array.isArray(items)) return [];
        return items.map(item => this.formatSong(item));
    },
    
    getDownloadUrl: function(data) {
        return data && data.download_url ? data.download_url : null;
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