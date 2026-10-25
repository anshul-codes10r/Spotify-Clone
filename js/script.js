// Spotify Clone JavaScript
// ===== ELEMENTS =====

const audio = document.querySelector(".audio-element");
const songCards = document.querySelectorAll(".poster[data-song]");

const songImage = document.querySelector(".song-image");
const songTitle = document.querySelector(".song-title");
const songArtist = document.querySelector(".song-artist");

const playPauseBtn = document.querySelector(".play-pause-btn");
const previousBtn = document.querySelector(".previous-btn");
const nextBtn = document.querySelector(".next-btn");

const progressBar = document.querySelector(".progress-bar");
const currentTime = document.querySelector(".current-time");
const durationDisplay = document.querySelector(".duration");
const volumeBar = document.querySelector(".volume-bar");


// ===== SONG LIST =====

const songs = Array.from(songCards);
let currentSongIndex = -1;


// ===== FORMAT TIME =====

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}


// ===== PLAY / PAUSE ICON =====

function updatePlayButton(isPlaying) {
    const icon = playPauseBtn.querySelector("img");

    if (icon) {
        icon.src = isPlaying
            ? "assets/logo.svg/pause.svg"
            : "assets/logo.svg/play.svg";
    }

    playPauseBtn.setAttribute(
        "aria-label",
        isPlaying ? "Pause" : "Play"
    );
}


// ===== LOAD AND PLAY SONG =====

async function playSong(index) {
    if (index < 0 || index >= songs.length) return;

    currentSongIndex = index;

    const card = songs[index];
    const image = card.querySelector("img");
    const title = card.querySelector(".poster-title");
    const artist = card.querySelector(".creator-name, .genre");

    audio.src = card.dataset.song;

    if (image) songImage.src = image.src;

    if (title) {
        songTitle.textContent = title.textContent.trim();
    }

    songArtist.textContent = artist
        ? artist.textContent.trim()
        : "Unknown Artist";

    currentTime.textContent = "0:00";
    durationDisplay.textContent = "0:00";
    progressBar.value = 0;

    try {
        await audio.play();
        updatePlayButton(true);
    } catch (error) {
        updatePlayButton(false);
        console.error("Song playback failed:", error);
    }
}


// ===== CLICK SONG CARDS =====

songs.forEach((card, index) => {
    card.addEventListener("click", (event) => {
        event.preventDefault();
        playSong(index);
    });
});


// ===== PLAY / PAUSE =====

playPauseBtn.addEventListener("click", async () => {
    if (currentSongIndex === -1) {
        await playSong(0);
        return;
    }

    if (audio.paused) {
        try {
            await audio.play();
        } catch (error) {
            console.error("Unable to resume song:", error);
        }
    } else {
        audio.pause();
    }
});


// ===== NEXT SONG =====

nextBtn.addEventListener("click", () => {
    if (songs.length === 0) return;

    const nextIndex = currentSongIndex === -1
        ? 0
        : (currentSongIndex + 1) % songs.length;

    playSong(nextIndex);
});


// ===== PREVIOUS SONG =====

previousBtn.addEventListener("click", () => {
    if (songs.length === 0) return;

    const previousIndex = currentSongIndex === -1
        ? 0
        : (currentSongIndex - 1 + songs.length) % songs.length;

    playSong(previousIndex);
});


// ===== SONG DURATION =====

audio.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(audio.duration);
});


// ===== UPDATE PROGRESS =====

audio.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTime(audio.currentTime);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progressBar.value =
            (audio.currentTime / audio.duration) * 100;
    }
});


// ===== SEEK BAR =====

progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (Number(progressBar.value) / 100) * audio.duration;
    }
});


// ===== VOLUME =====

if (volumeBar) {
    audio.volume = Number(volumeBar.value) / 100;

    volumeBar.addEventListener("input", () => {
        audio.volume = Number(volumeBar.value) / 100;
    });
}


// ===== AUTOMATIC NEXT SONG =====

audio.addEventListener("ended", () => {
    if (songs.length > 0) {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        playSong(nextIndex);
    }
});


// ===== PLAYBACK STATE =====

audio.addEventListener("play", () => {
    updatePlayButton(true);
});

audio.addEventListener("pause", () => {
    updatePlayButton(false);
});
