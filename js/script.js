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
const totalTimeLarge = document = document.getElementById('totalTimeLarge');
const downloadBtnLarge = document.getElementById('downloadBtnLarge');
const queueList = document.getElementById('queueList');

const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const overlay = document.getElementById('overlay');
const sidebarHomeLink = document.getElementById('sidebarHomeLink');
const sidebarContributorsLink = document.getElementById('sidebarContributorsLink');

let currentPlaylist = [];
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let recentlyPlayed = [];

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

async function searchSongs(query) {
    hideAllSections();
    loadingElement.style.display = 'flex';
    resultsContainer.innerHTML = '';
    
    resultsSection.classList.add('active');
    searchResultTitle.textContent = `Hasil Pencarian: "${query}"`;
    
    try {
        const response = await fetch(`${API_URL.SEARCH}?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        loadingElement.style.display = 'none';
        
        if (!data.status || !data.data || data.data.length === 0) {
            noResultsElement.style.display = 'block';
            return;
        }
        
        currentPlaylist = UTILS.formatSearchResults(data.data);
        displayResults(currentPlaylist);
    } catch (error) {
        console.error('Error fetching search results:', error);
        loadingElement.style.display = 'none';
        noResultsElement.style.display = 'block';
    }
}

async function showRecommendedSongs() {
    hideAllSections();
    loadingElement.style.display = 'flex';
    recommendedList.innerHTML = '';
    recommendedSection.style.display = 'block';

    try {
        const query = APP_DEFAULTS.DEFAULT_SEARCH;
        const response = await fetch(`${API_URL.SEARCH}?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        loadingElement.style.display = 'none';

        if (!data.status || !data.data || data.data.length === 0) {
            recommendedList.innerHTML = `<div class="no-results"><p>Tidak ada rekomendasi saat ini.</p></div>`;
            return;
        }

        const recommendedSongs = UTILS.formatSearchResults(data.data);
        displaySongsInContainer(recommendedSongs, recommendedList);
        currentPlaylist = recommendedSongs;
    } catch (error) {
        console.error('Error fetching recommended songs:', error);
        loadingElement.style.display = 'none';
        recommendedList.innerHTML = `<div class="no-results"><p>Gagal mengambil rekomendasi.</p></div>`;
    }
}

function displaySongsInContainer(songs, containerElement) {
    containerElement.innerHTML = '';
    
    songs.forEach(song => {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        songCard.dataset.songId = song.id;
        
        const needsScrolling = UTILS.needsScrolling(song.title);
        
        songCard.innerHTML = `
            <img src="${song.thumbnail}" alt="${song.title}" class="song-thumbnail">
            <div class="song-info">
                <div class="${needsScrolling ? 'scrolling-text' : 'song-title'}">
                    ${needsScrolling ? `<div class="scrolling-text-content">${song.title}</div>` : song.title}
                </div>
                <div class="song-artist">${song.artist}</div>
                <div class="song-duration">${song.timestamp || '0:00'}</div>
            </div>
        `;
        
        songCard.addEventListener('click', () => {
            const index = currentPlaylist.findIndex(s => s.id === song.id);
            playSong(index);
            updateQueue();
        });
        
        containerElement.appendChild(songCard);
    });
}

function displayResults(songs) {
    displaySongsInContainer(songs, resultsContainer);
}

async function playSong(index) {
    if (index < 0 || index >= currentPlaylist.length) return;
    
    currentSongIndex = index;
    const song = currentPlaylist[index];
    
    loadingElement.style.display = 'flex';
    
    try {
        const response = await fetch(`${API_URL.DOWNLOAD_MP3}?url=${encodeURIComponent(song.videoUrl)}`);
        const data = await response.json();
        
        const downloadUrl = data && data.data && data.data.dl ? data.data.dl : null;
        
        if (!downloadUrl) {
            throw new Error('Failed to get audio URL');
        }
        
        miniThumbnail.src = song.thumbnail;
        
        if (UTILS.needsScrolling(song.title)) {
            miniTitle.className = 'scrolling-text';
            miniTitle.innerHTML = `<div class="scrolling-text-content">${song.title}</div>`;
        } else {
            miniTitle.className = 'song-title';
            miniTitle.textContent = song.title;
        }
        
        miniArtist.textContent = song.artist;
        
        fullThumbnail.src = song.thumbnail;
        
        if (UTILS.needsScrolling(song.title, 30)) {
            fullTitle.className = 'now-title-large scrolling-text';
            fullTitle.innerHTML = `<div class="scrolling-text-content">${song.title}</div>`;
        } else {
            fullTitle.className = 'now-title-large';
            fullTitle.textContent = song.title;
        }
        
        fullArtist.textContent = song.artist;
        
        const playIcon = isPlaying ? 'fa-pause' : 'fa-play';
        miniPlayBtn.innerHTML = `<i class="fas ${playIcon}"></i>`;
        playBtnLarge.innerHTML = `<i class="fas ${playIcon}"></i>`;
        
        audioPlayer.src = downloadUrl;
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtnLarge.innerHTML = '<i class="fas fa-pause"></i>';
                playerMini.classList.remove('hidden');
                addToRecentlyPlayed(song);
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    } catch (error) {
        console.error('Error getting audio URL:', error);
        alert('Failed to play this song. Please try another one.');
    } finally {
        loadingElement.style.display = 'none';
    }
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
            <img src="${song.thumbnail}" alt="${song.title}" class="history-thumbnail">
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
    
    for (let i = 0; i < APP_DEFAULTS.MAX_QUEUE_ITEMS; i++) {
        const nextIndex = (currentSongIndex + i + 1) % currentPlaylist.length;
        if (nextIndex !== currentSongIndex) {
            const song = currentPlaylist[nextIndex];
            
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            
            const needsScrolling = UTILS.needsScrolling(song.title);
            
            queueItem.innerHTML = `
                <img src="${song.thumbnail}" alt="${song.title}" class="queue-thumbnail">
                <div class="queue-info">
                    <div class="${needsScrolling ? 'queue-title scrolling-text' : 'queue-title'}">
                        ${needsScrolling ? `<div class="scrolling-text-content">${song.title}</div>` : song.title}
                    </div>
                    <div class="queue-artist">${song.artist}</div>
                </div>
                <div class="queue-duration">${song.timestamp || '0:00'}</div>
            </div>
        `;
            
            queueItem.addEventListener('click', () => {
                playSong(nextIndex);
                updateQueue();
            });
            
            queueList.appendChild(queueItem);
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
        miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtnLarge.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioPlayer.pause();
        isPlaying = false;
        miniPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtnLarge.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function playNextSong() {
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
    if (isShuffle) {
        shuffleBtn.style.color = 'var(--primary)';
    } else {
        shuffleBtn.style.color = 'var(--light)';
    }
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    if (isRepeat) {
        repeatBtn.style.color = 'var(--primary)';
    } else {
        repeatBtn.style.color = 'var(--light)';
    }
}

function downloadCurrentSong() {
    if (currentPlaylist.length === 0 || currentSongIndex < 0) return;
    
    const song = currentPlaylist[currentSongIndex];
    
    loadingElement.style.display = 'flex';
    
    fetch(`${API_URL.DOWNLOAD_MP3}?url=${encodeURIComponent(song.videoUrl)}`)
        .then(response => response.json())
        .then(data => {
            loadingElement.style.display = 'none';
            
            const downloadUrl = data && data.data && data.data.dl ? data.data.dl : null;
            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            } else {
                alert('Failed to get download link. Please try again.');
            }
        })
        .catch(error => {
            loadingElement.style.display = 'none';
            console.error('Error getting MP3 download URL:', error);
            alert('Failed to download. Please try again later.');
        });
}

function loadRecentlyPlayed() {
    const storedRecent = localStorage.getItem(APP_DEFAULTS.STORAGE_KEY);
    if (storedRecent) {
        try {
            recentlyPlayed = JSON.parse(storedRecent);
            updateRecentlyPlayed();
        } catch (e) {
            console.error('Error parsing stored recently played:', e);
        }
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
            <img src="${contributor.photo}" alt="${contributor.name}" class="contributor-photo">
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
    loadRecentlyPlayed();
    showWelcomePanel();
    
    if (!welcomePanel.classList.contains('show')) {
        setTimeout(() => {
            showRecommendedSongs();
        }, 700);
    }
    
    setupEventListeners();
}

function setupEventListeners() {
    welcomeCloseBtn.addEventListener('click', () => {
        welcomePanel.classList.remove('show');
        setTimeout(() => {
            welcomePanel.classList.add('hidden');
            showRecommendedSongs(); 
        }, 600);
    });
    
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRecommendedSongs(); 
    });
    
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchSongs(query);
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchSongs(query);
            }
        }
    });
    
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
    
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', () => {
        if (isRepeat) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNextSong();
        }
    });
    
    downloadBtnLarge.addEventListener('click', downloadCurrentSong);

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
}

document.addEventListener('DOMContentLoaded', initApp);