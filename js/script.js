const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const resultsContainer = document.getElementById('results');
const resultsSection = document.getElementById('resultsSection');
const searchResultTitle = document.getElementById('searchResultTitle');
const loadingElement = document.querySelector('.loading');
const noResultsElement = document.querySelector('.no-results');
const audioPlayer = document.getElementById('audioPlayer');
const welcomePanel = document.getElementById('welcomePanel');
const welcomeCloseBtn = document.getElementById('welcomeCloseBtn');
const logoLink = document.getElementById('logoLink');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');
const contributorsSection = document.getElementById('contributorsSection');
const contributorsGrid = document.getElementById('contributorsGrid');

const recommendedSection = document.getElementById('recommendedSection');
const recommendedList = document.getElementById('recommendedList');

const playerMini = document.getElementById('playerMini');
const playerFull = document.getElementById('playerFull');
const minimizeBtn = document.getElementById('minimizeBtn');

const miniThumbnail = document.getElementById('miniThumbnail');
const miniTitle = document.getElementById('miniTitle');
const miniArtist = document.getElementById('miniArtist');
const miniPlayBtn = document.getElementById('miniPlayBtn');
const miniNextBtn = document.getElementById('miniNextBtn');

const fullThumbnail = document.getElementById('fullThumbnail');
const fullTitle = document.getElementById('fullTitle');
const fullArtist = document.getElementById('fullArtist');
const playBtnLarge = document.getElementById('playBtnLarge');
const prevBtnLarge = document.getElementById('prevBtnLarge');
const nextBtnLarge = document.getElementById('nextBtnLarge');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressBarLarge = document.getElementById('progressBarLarge');
const progressLarge = document.getElementById('progressLarge');
const currentTimeLarge = document.getElementById('currentTimeLarge');
const totalTimeLarge = document.getElementById('totalTimeLarge');
const downloadBtnLarge = document.getElementById('downloadBtnLarge');
const queueList = document.getElementById('queueList');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');

const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const overlay = document.getElementById('overlay');
const sidebarHomeLink = document.getElementById('sidebarHomeLink');
const sidebarContributorsLink = document.getElementById('sidebarContributorsLink');
const sidebarFavoritesLink = document.getElementById('sidebarFavoritesLink');

let currentPlaylist = [];
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let recentlyPlayed = [];
let favoriteSongs = [];
let currentVolume = 1;
let isMuted = false;
let isLoading = false;
let searchTimeout = null;

// Debounced search function
const debouncedSearch = UTILS.debounce((query) => {
    if (query.trim()) {
        searchSongs(query);
    }
}, 500);

function showWelcomePanel() {
    setTimeout(() => {
        welcomePanel.classList.add('show');
    }, 100);
}

function hideAllSections() {
    historySection.style.display = 'none';
    resultsSection.classList.remove('active');
    contributorsSection.style.display = 'none';
    recommendedSection.style.display = 'none';
    loadingElement.style.display = 'none';
    noResultsElement.style.display = 'none';
    document.body.classList.remove('page-contributors');
}

function showLoadingState(message = 'Mengambil data...') {
    if (isLoading) return;
    isLoading = true;
    
    loadingElement.style.display = 'flex';
    const loadingText = loadingElement.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = message;
    }
    
    // Add loading animation to search button
    if (searchBtn) {
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mencari...';
    }
}

function hideLoadingState() {
    isLoading = false;
    loadingElement.style.display = 'none';
    
    // Reset search button
    if (searchBtn) {
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Cari';
    }
}

async function searchSongs(query) {
    if (isLoading) return;
    
    hideAllSections();
    showLoadingState('Mencari lagu...');
    resultsContainer.innerHTML = '';
    
    resultsSection.classList.add('active');
    searchResultTitle.textContent = `Hasil Pencarian: "${query}"`;
    
    try {
        const response = await fetch(`${API_URL.SEARCH}?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        hideLoadingState();
        
        if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
            noResultsElement.style.display = 'block';
            UTILS.showNotification('Tidak ada hasil ditemukan untuk pencarian ini', 'info');
            return;
        }
        
        currentPlaylist = UTILS.formatSearchResults(data.results);
        displayResults(currentPlaylist);
        UTILS.showNotification(`Ditemukan ${currentPlaylist.length} lagu`, 'success');
        
    } catch (error) {
        console.error('Error fetching search results:', error);
        hideLoadingState();
        noResultsElement.style.display = 'block';
        UTILS.showNotification('Gagal mencari lagu. Silakan coba lagi.', 'error');
    }
}

async function showRecommendedSongs() {
    hideAllSections();
    showLoadingState('Memuat rekomendasi...');
    recommendedList.innerHTML = '';
    recommendedSection.style.display = 'block';

    try {
        const query = APP_DEFAULTS.DEFAULT_SEARCH;
        const response = await fetch(`${API_URL.SEARCH}?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        hideLoadingState();

        if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
            recommendedList.innerHTML = `<div class="no-results"><p>Tidak ada rekomendasi saat ini.</p></div>`;
            return;
        }

        const recommendedSongs = UTILS.formatSearchResults(data.results);
        displaySongsInContainer(recommendedSongs, recommendedList);
        currentPlaylist = recommendedSongs;
        
    } catch (error) {
        console.error('Error fetching recommended songs:', error);
        hideLoadingState();
        recommendedList.innerHTML = `<div class="no-results"><p>Gagal mengambil rekomendasi.</p></div>`;
        UTILS.showNotification('Gagal memuat rekomendasi', 'error');
    }
}

function displaySongsInContainer(songs, containerElement) {
    containerElement.innerHTML = '';
    
    songs.forEach((song, index) => {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        songCard.dataset.songId = song.id;
        
        const needsScrolling = UTILS.needsScrolling(song.title);
        const isFavorite = favoriteSongs.some(fav => fav.id === song.id);
        
        songCard.innerHTML = `
            <div class="song-card-overlay">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-song-index="${index}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="play-overlay-btn" data-song-index="${index}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <img src="${song.thumbnail}" alt="${song.title}" class="song-thumbnail" loading="lazy">
            <div class="song-info">
                <div class="${needsScrolling ? 'scrolling-text' : 'song-title'}">
                    ${needsScrolling ? `<div class="scrolling-text-content">${song.title}</div>` : song.title}
                </div>
                <div class="song-artist">${song.artist}</div>
                <div class="song-meta">
                    <span class="song-duration">${song.timestamp || '0:00'}</span>
                    ${song.views ? `<span class="song-views">${formatViews(song.views)}</span>` : ''}
                </div>
            </div>
        `;
        
        // Add event listeners
        const playBtn = songCard.querySelector('.play-overlay-btn');
        const favoriteBtn = songCard.querySelector('.favorite-btn');
        
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songIndex = parseInt(e.target.closest('.play-overlay-btn').dataset.songIndex);
            playSong(songIndex);
            updateQueue();
        });
        
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songIndex = parseInt(e.target.closest('.favorite-btn').dataset.songIndex);
            toggleFavorite(songs[songIndex]);
            favoriteBtn.classList.toggle('active');
        });
        
        songCard.addEventListener('click', () => {
            const index = currentPlaylist.findIndex(s => s.id === song.id);
            playSong(index);
            updateQueue();
        });
        
        containerElement.appendChild(songCard);
    });
}

function formatViews(views) {
    if (!views) return '';
    const num = parseInt(views.replace(/[^\d]/g, ''));
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M views';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K views';
    }
    return num + ' views';
}

function displayResults(songs) {
    displaySongsInContainer(songs, resultsContainer);
}

async function playSong(index) {
    if (index < 0 || index >= currentPlaylist.length || isLoading) return;
    
    currentSongIndex = index;
    const song = currentPlaylist[index];
    
    showLoadingState('Memuat audio...');
    
    try {
        const downloadUrl = `${API_URL.DOWNLOAD_MP3}?url=${encodeURIComponent(song.videoUrl)}&quality=${APP_DEFAULTS.DEFAULT_QUALITY}&server=${APP_DEFAULTS.SERVER}`;
        
        const response = await fetch(downloadUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const audioUrl = UTILS.getDownloadUrl(data);
        
        if (!audioUrl) {
            throw new Error('Failed to get audio URL');
        }
        
        // Update UI
        updatePlayerUI(song);
        
        // Set audio source and play
        audioPlayer.src = audioUrl;
        audioPlayer.volume = currentVolume;
        
        await audioPlayer.play();
        
        isPlaying = true;
        updatePlayButtons();
        playerMini.classList.remove('hidden');
        addToRecentlyPlayed(song);
        
        hideLoadingState();
        UTILS.showNotification(`Memutar: ${song.title}`, 'success');
        
    } catch (error) {
        console.error('Error playing song:', error);
        hideLoadingState();
        UTILS.showNotification('Gagal memutar lagu. Silakan coba lagi.', 'error');
    }
}

function updatePlayerUI(song) {
    // Update mini player
    miniThumbnail.src = song.thumbnail;
    
    if (UTILS.needsScrolling(song.title)) {
        miniTitle.className = 'scrolling-text';
        miniTitle.innerHTML = `<div class="scrolling-text-content">${song.title}</div>`;
    } else {
        miniTitle.className = 'song-title';
        miniTitle.textContent = song.title;
    }
    
    miniArtist.textContent = song.artist;
    
    // Update full player
    fullThumbnail.src = song.thumbnail;
    
    if (UTILS.needsScrolling(song.title, 30)) {
        fullTitle.className = 'now-title-large scrolling-text';
        fullTitle.innerHTML = `<div class="scrolling-text-content">${song.title}</div>`;
    } else {
        fullTitle.className = 'now-title-large';
        fullTitle.textContent = song.title;
    }
    
    fullArtist.textContent = song.artist;
}

function updatePlayButtons() {
    const playIcon = isPlaying ? 'fa-pause' : 'fa-play';
    miniPlayBtn.innerHTML = `<i class="fas ${playIcon}"></i>`;
    playBtnLarge.innerHTML = `<i class="fas ${playIcon}"></i>`;
}

function addToRecentlyPlayed(song) {
    recentlyPlayed = recentlyPlayed.filter(s => s.id !== song.id);
    recentlyPlayed.unshift(song);
    
    if (recentlyPlayed.length > APP_DEFAULTS.MAX_RECENT_ITEMS) {
        recentlyPlayed = recentlyPlayed.slice(0, APP_DEFAULTS.MAX_RECENT_ITEMS);
    }
    
    updateRecentlyPlayed();
    localStorage.setItem(APP_DEFAULTS.STORAGE_KEY, JSON.stringify(recentlyPlayed));
}

function updateRecentlyPlayed() {
    if (recentlyPlayed.length === 0) {
        historyList.innerHTML = `
            <div class="no-history">
                <p>Belum ada lagu yang diputar</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = '';
    
    recentlyPlayed.forEach(song => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const needsScrolling = UTILS.needsScrolling(song.title, 25);
        
        historyItem.innerHTML = `
            <img src="${song.thumbnail}" alt="${song.title}" class="history-thumbnail" loading="lazy">
            <div class="history-info">
                <div class="${needsScrolling ? 'history-title scrolling-text' : 'history-title'}">
                    ${needsScrolling ? `<div class="scrolling-text-content">${song.title}</div>` : song.title}
                </div>
                <div class="history-artist">${song.artist}</div>
            </div>
            <div class="history-duration">${song.timestamp || '0:00'}</div>
        `;
        
        historyItem.addEventListener('click', () => {
            if (!currentPlaylist.some(s => s.id === song.id)) {
                currentPlaylist.unshift(song);
            }
            
            const index = currentPlaylist.findIndex(s => s.id === song.id);
            playSong(index);
            updateQueue();
        });
        
        historyList.appendChild(historyItem);
    });
}

function updateQueue() {
    queueList.innerHTML = '';
    
    let addedCount = 0;
    for (let i = 1; i <= APP_DEFAULTS.MAX_QUEUE_ITEMS && addedCount < APP_DEFAULTS.MAX_QUEUE_ITEMS; i++) {
        const nextIndex = (currentSongIndex + i) % currentPlaylist.length;
        if (nextIndex !== currentSongIndex && currentPlaylist[nextIndex]) {
            const song = currentPlaylist[nextIndex];
            
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            
            const needsScrolling = UTILS.needsScrolling(song.title);
            
            queueItem.innerHTML = `
                <img src="${song.thumbnail}" alt="${song.title}" class="queue-thumbnail" loading="lazy">
                <div class="queue-info">
                    <div class="${needsScrolling ? 'queue-title scrolling-text' : 'queue-title'}">
                        ${needsScrolling ? `<div class="scrolling-text-content">${song.title}</div>` : song.title}
                    </div>
                    <div class="queue-artist">${song.artist}</div>
                </div>
                <div class="queue-duration">${song.timestamp || '0:00'}</div>
            `;
            
            queueItem.addEventListener('click', () => {
                playSong(nextIndex);
                updateQueue();
            });
            
            queueList.appendChild(queueItem);
            addedCount++;
        }
    }
    
    if (queueList.children.length === 0) {
        queueList.innerHTML = `
            <div class="no-results">
                <p>Tidak ada lagu berikutnya dalam antrean</p>
            </div>
        `;
    }
}

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        isPlaying = true;
    } else {
        audioPlayer.pause();
        isPlaying = false;
    }
    updatePlayButtons();
}

function playNextSong() {
    if (currentPlaylist.length === 0) return;
    
    if (isShuffle) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * currentPlaylist.length);
        } while (nextIndex === currentSongIndex && currentPlaylist.length > 1);
        
        playSong(nextIndex);
    } else {
        playSong((currentSongIndex + 1) % currentPlaylist.length);
    }
    updateQueue();
}

function playPreviousSong() {
    if (currentPlaylist.length === 0) return;
    
    playSong((currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length);
    updateQueue();
}

function updateProgressBar() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration || 1;
    const progressPercent = (currentTime / duration) * 100;
    
    progressLarge.style.width = `${progressPercent}%`;
    currentTimeLarge.textContent = UTILS.formatTime(currentTime);
    totalTimeLarge.textContent = UTILS.formatTime(duration);
}

function setProgress(e) {
    const rect = progressBarLarge.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    audioPlayer.currentTime = percentage * audioPlayer.duration;
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? 'var(--primary)' : 'var(--light)';
    UTILS.showNotification(`Shuffle ${isShuffle ? 'aktif' : 'nonaktif'}`, 'info');
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? 'var(--primary)' : 'var(--light)';
    UTILS.showNotification(`Repeat ${isRepeat ? 'aktif' : 'nonaktif'}`, 'info');
}

function toggleFavorite(song) {
    const existingIndex = favoriteSongs.findIndex(fav => fav.id === song.id);
    
    if (existingIndex > -1) {
        favoriteSongs.splice(existingIndex, 1);
        UTILS.showNotification('Dihapus dari favorit', 'info');
    } else {
        favoriteSongs.push(song);
        UTILS.showNotification('Ditambahkan ke favorit', 'success');
    }
    
    localStorage.setItem(APP_DEFAULTS.FAVORITES_KEY, JSON.stringify(favoriteSongs));
}

function setVolume(volume) {
    currentVolume = Math.max(0, Math.min(1, volume));
    audioPlayer.volume = currentVolume;
    
    if (volumeSlider) {
        volumeSlider.value = currentVolume * 100;
    }
    
    updateVolumeIcon();
    localStorage.setItem(APP_DEFAULTS.VOLUME_KEY, currentVolume.toString());
}

function updateVolumeIcon() {
    if (!volumeBtn) return;
    
    let icon = 'fa-volume-up';
    if (isMuted || currentVolume === 0) {
        icon = 'fa-volume-mute';
    } else if (currentVolume < 0.5) {
        icon = 'fa-volume-down';
    }
    
    volumeBtn.innerHTML = `<i class="fas ${icon}"></i>`;
}

function toggleMute() {
    isMuted = !isMuted;
    audioPlayer.volume = isMuted ? 0 : currentVolume;
    updateVolumeIcon();
}

async function downloadCurrentSong() {
    if (currentPlaylist.length === 0 || currentSongIndex < 0 || isLoading) return;
    
    const song = currentPlaylist[currentSongIndex];
    
    showLoadingState('Menyiapkan download...');
    
    try {
        const downloadUrl = `${API_URL.DOWNLOAD_MP3}?url=${encodeURIComponent(song.videoUrl)}&quality=${APP_DEFAULTS.DEFAULT_QUALITY}&server=${APP_DEFAULTS.SERVER}`;
        
        const response = await fetch(downloadUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const audioUrl = UTILS.getDownloadUrl(data);
        
        hideLoadingState();
        
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = `${song.title} - ${song.artist}.mp3`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            UTILS.showNotification('Download dimulai', 'success');
        } else {
            throw new Error('Download URL not found');
        }
    } catch (error) {
        hideLoadingState();
        console.error('Error downloading song:', error);
        UTILS.showNotification('Gagal mendownload. Silakan coba lagi.', 'error');
    }
}

function loadStoredData() {
    // Load recently played
    const storedRecent = localStorage.getItem(APP_DEFAULTS.STORAGE_KEY);
    if (storedRecent) {
        try {
            recentlyPlayed = JSON.parse(storedRecent);
            updateRecentlyPlayed();
        } catch (e) {
            console.error('Error parsing stored recently played:', e);
        }
    }
    
    // Load favorites
    const storedFavorites = localStorage.getItem(APP_DEFAULTS.FAVORITES_KEY);
    if (storedFavorites) {
        try {
            favoriteSongs = JSON.parse(storedFavorites);
        } catch (e) {
            console.error('Error parsing stored favorites:', e);
        }
    }
    
    // Load volume
    const storedVolume = localStorage.getItem(APP_DEFAULTS.VOLUME_KEY);
    if (storedVolume) {
        currentVolume = parseFloat(storedVolume);
        setVolume(currentVolume);
    }
}

function showHistorySection() {
    hideAllSections();
    historySection.style.display = 'block';
    updateRecentlyPlayed();
}

function showContributorsSection() {
    hideAllSections();
    contributorsSection.style.display = 'block';
    document.body.classList.add('page-contributors');
    displayContributors();
}

function displayContributors() {
    contributorsGrid.innerHTML = '';
    CONTRIBUTORS_DATA.forEach(contributor => {
        const contributorCard = document.createElement('div');
        contributorCard.className = 'contributor-card';
        contributorCard.innerHTML = `
            <img src="${contributor.photo}" alt="${contributor.name}" class="contributor-photo" loading="lazy">
            <h3 class="contributor-name">${contributor.name}</h3>
            <p class="contributor-description">${contributor.description}</p>
        `;
        contributorsGrid.appendChild(contributorCard);
    });
}

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.classList.add('sidebar-open');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
}

function initApp() {
    loadStoredData();
    showWelcomePanel();
    
    if (!welcomePanel.classList.contains('show')) {
        setTimeout(() => {
            showRecommendedSongs();
        }, 700);
    }
    
    setupEventListeners();
}

function setupEventListeners() {
    // Welcome panel
    welcomeCloseBtn.addEventListener('click', () => {
        welcomePanel.classList.remove('show');
        setTimeout(() => {
            welcomePanel.classList.add('hidden');
            showRecommendedSongs();
        }, 600);
    });
    
    // Navigation
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRecommendedSongs();
    });
    
    // Search
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query && !isLoading) {
            searchSongs(query);
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query && !isLoading) {
                searchSongs(query);
            }
        }
    });
    
    // Real-time search
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            debouncedSearch(query);
        }
    });
    
    // Player controls
    minimizeBtn.addEventListener('click', () => {
        playerFull.style.display = 'none';
        playerMini.classList.remove('hidden');
    });
    
    playerMini.addEventListener('click', function(e) {
        if (!e.target.classList.contains('control-btn') && !e.target.closest('.control-btn')) {
            playerFull.style.display = 'flex';
            playerMini.classList.add('hidden');
        }
    });
    
    miniPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });
    
    miniNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playNextSong();
    });
    
    playBtnLarge.addEventListener('click', togglePlay);
    prevBtnLarge.addEventListener('click', playPreviousSong);
    nextBtnLarge.addEventListener('click', playNextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    progressBarLarge.addEventListener('click', setProgress);
    
    // Volume controls
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            setVolume(e.target.value / 100);
        });
    }
    
    if (volumeBtn) {
        volumeBtn.addEventListener('click', toggleMute);
    }
    
    // Audio events
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', () => {
        if (isRepeat) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNextSong();
        }
    });
    
    audioPlayer.addEventListener('loadstart', () => {
        showLoadingState('Memuat audio...');
    });
    
    audioPlayer.addEventListener('canplay', () => {
        hideLoadingState();
    });
    
    audioPlayer.addEventListener('error', () => {
        hideLoadingState();
        UTILS.showNotification('Error memutar audio', 'error');
    });
    
    downloadBtnLarge.addEventListener('click', downloadCurrentSong);

    // Sidebar
    hamburgerMenu.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    sidebarHomeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRecommendedSongs();
        closeSidebar();
    });

    sidebarContributorsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showContributorsSection();
        closeSidebar();
    });
    
    if (sidebarFavoritesLink) {
        sidebarFavoritesLink.addEventListener('click', (e) => {
            e.preventDefault();
            showFavoritesSection();
            closeSidebar();
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                playNextSong();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                playPreviousSong();
                break;
            case 'ArrowUp':
                e.preventDefault();
                setVolume(currentVolume + 0.1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                setVolume(currentVolume - 0.1);
                break;
        }
    });
}

function showFavoritesSection() {
    hideAllSections();
    const favoritesSection = document.createElement('div');
    favoritesSection.className = 'favorites-section';
    favoritesSection.innerHTML = `
        <h2 class="section-title"><i class="fas fa-heart"></i> Lagu Favorit</h2>
        <div class="favorites-container" id="favoritesContainer"></div>
    `;
    
    // Insert after recommended section
    recommendedSection.parentNode.insertBefore(favoritesSection, recommendedSection.nextSibling);
    favoritesSection.style.display = 'block';
    
    const favoritesContainer = document.getElementById('favoritesContainer');
    
    if (favoriteSongs.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="no-results">
                <p>Belum ada lagu favorit</p>
            </div>
        `;
    } else {
        displaySongsInContainer(favoriteSongs, favoritesContainer);
        currentPlaylist = favoriteSongs;
    }
}

document.addEventListener('DOMContentLoaded', initApp);