const API_URL = {
    SEARCH: 'https://api.siputzx.my.id/api/s/youtube',
    DOWNLOAD_MP3: 'https://api.siputzx.my.id/api/d/ytmp3'
};

const APP_DEFAULTS = {
    DEFAULT_SEARCH: 'popular songs 2025',
    MAX_RECENT_ITEMS: 10,
    MAX_QUEUE_ITEMS: 5,
    STORAGE_KEY: 'recentlyPlayed'
};

const CONTRIBUTORS_DATA = [
    {
        name: 'Siputzx',
        photo: 'https://cloudkuimages.guru/uploads/images/683f272fb23a0.jpg',
        description: 'Penyedia Api'
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
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },
    
    needsScrolling: function(text, maxLength = 20) {
        return text && text.length > maxLength;
    },
    
    formatSong: function(item) {
        return {
            id: item.videoId || '',
            title: item.title || 'Unknown Title',
            artist: (item.author && item.author.name) ? item.author.name : 'Unknown Artist',
            thumbnail: item.thumbnail || item.image || '/api/placeholder/300/300',
            duration: item.seconds || (item.duration ? item.duration.seconds : 0),
            timestamp: item.timestamp || (item.duration ? item.duration.timestamp : '0:00'),
            videoUrl: item.url || ''
        };
    },
    
    formatSearchResults: function(items) {
        if (!Array.isArray(items)) return [];
        return items.map(item => this.formatSong(item));
    },
    
    getDownloadUrl: function(data) {
        return data && data.dl ? data.dl : null;
    }
};
