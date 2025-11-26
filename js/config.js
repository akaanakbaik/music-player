const API_URL = {
    SEARCH: 'https://api.siputzx.my.id/api/s/youtube',
    DOWNLOAD_MP3: 'https://api.nekolabs.web.id/downloader/youtube/v5',
    DOWNLOAD_MP3_FALLBACK: 'https://api.nekolabs.web.id/downloader/youtube/v4'
};

const APP_DEFAULTS = {
    DEFAULT_SEARCH: 'musik trending terbaru',
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
            thumbnail: item.thumbnail || item.thumbnail_url || item.image || '/api/placeholder/300/300',
            duration: durationInSeconds,
            timestamp: item.duration_formatted || item.timestamp || this.formatTime(durationInSeconds) || '0:00',
            videoUrl: item.url || item.link || item.videoUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''),
            views: item.views || '0'
        };
    },

    formatSearchResults: function(items) {
        if (!items) return [];

        const sourceItems = Array.isArray(items)
            ? items
            : Array.isArray(items.data)
                ? items.data
                : Array.isArray(items.results)
                    ? items.results
                    : Array.isArray(items.items)
                        ? items.items
                        : [];

        return sourceItems.map(item => this.formatSong(item));
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