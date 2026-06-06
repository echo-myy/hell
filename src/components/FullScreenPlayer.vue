<template>
  <transition name="slide-up">
    <div v-if="showFullScreenPlayer" class="fullscreen-player">
      <!-- 模糊背景 -->
      <div class="player-background">
        <img
          :src="
            currentMusic?.cover ||
            currentMusic?.cover_url ||
            '/default-cover.jpg'
          "
          alt=""
          class="bg-cover"
        />
        <div class="bg-overlay"></div>
      </div>

      <!-- 顶部栏 -->
      <div class="player-header">
        <button class="close-btn" @click="closePlayer">
          <span>↓</span>
        </button>
        <div class="player-mode">
          <span>{{ getPlayModeText() }}</span>
        </div>
      </div>

      <!-- 封面区域 - 点击切换歌词 -->
      <div class="cover-section" @click="toggleLyrics">
        <div
          class="cover-container"
          :class="{ rotating: isPlaying, 'low-opacity': showLyrics }"
        >
          <img
            :src="
              currentMusic?.cover ||
              currentMusic?.cover_url ||
              '/default-cover.jpg'
            "
            :alt="currentMusic?.name || currentMusic?.title"
            class="cover-image"
          />
        </div>

        <!-- 歌词区域 -->
        <transition name="fade">
          <div v-if="showLyrics" class="lyrics-section" ref="lyricsRef">
            <div
              v-for="(lyric, index) in lyrics"
              :key="index"
              class="lyric-item"
              :class="{ active: index === currentLyricIndex }"
            >
              {{ lyric.text }}
            </div>
            <div v-if="!lyrics.length" class="no-lyrics">
              <p>暂无歌词</p>
            </div>
          </div>
        </transition>
      </div>

      <!-- 歌曲信息 -->
      <div class="song-info">
        <h2 class="song-title">
          {{ currentMusic?.name || currentMusic?.title || "未知歌曲" }}
        </h2>
        <p class="song-artist">
          {{ currentMusic?.singer || currentMusic?.artist || "未知艺术家" }}
        </p>
      </div>

      <!-- 进度条 -->
      <div class="progress-section">
        <span class="time current">{{ formatTime(currentTime) }}</span>
        <div
          class="progress-bar-container"
          ref="progressContainer"
          @click="handleProgressClick"
        >
          <div class="progress-bar-bg">
            <div
              class="progress-bar-fill"
              :style="{ width: progressPercent + '%' }"
            >
              <div class="progress-thumb"></div>
            </div>
          </div>
        </div>
        <span class="time duration">{{ formatTime(duration) }}</span>
      </div>

      <!-- 播放控制 -->
      <div class="controls-section">
        <button class="control-btn mode-btn" @click="togglePlayMode">
          <span>{{ getPlayModeIcon() }}</span>
        </button>
        <button class="control-btn" @click="prevMusic">
          <span>⏮</span>
        </button>
        <button class="control-btn play-btn" @click="togglePlay">
          <span v-if="isPlaying">⏸</span>
          <span v-else>▶</span>
        </button>
        <button class="control-btn" @click="nextMusic">
          <span>⏭</span>
        </button>
        <button class="control-btn" @click="toggleFavorite">
          <span :class="{ active: isFavorite }">♥</span>
        </button>
      </div>

      <!-- 音量控制 -->
      <div class="volume-section">
        <span class="volume-icon">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          :value="volume * 100"
          @input="handleVolumeChange"
          class="volume-slider"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "FullScreenPlayer",
  data() {
    return {
      progressContainer: null,
      showLyrics: false,
      lyricsRef: null,
    };
  },
  mounted() {
    this.$root.$on("play-music-from-fullscreen", (music) => {
      this.playMusic(music);
    });
  },
  beforeDestroy() {
    this.$root.$off("play-music-from-fullscreen");
  },
  computed: {
    ...mapState([
      "currentMusic",
      "isPlaying",
      "currentTime",
      "duration",
      "volume",
      "playMode",
      "showFullScreenPlayer",
      "favorites",
    ]),
    isFavorite() {
      if (!this.currentMusic) return false;
      return this.favorites.some((m) => m.id === this.currentMusic.id);
    },
    progressPercent() {
      if (!this.duration) return 0;
      return (this.currentTime / this.duration) * 100;
    },
    lyrics() {
      return this.currentMusic?.lyrics || [];
    },
    currentLyricIndex() {
      if (!this.lyrics.length) return -1;
      for (let i = this.lyrics.length - 1; i >= 0; i--) {
        if (this.currentTime >= this.lyrics[i].time) {
          return i;
        }
      }
      return -1;
    },
  },
  watch: {
    showFullScreenPlayer(show) {
      if (show) {
        this.preventScroll();
      } else {
        this.allowScroll();
      }
    },
    currentLyricIndex(newIndex) {
      if (this.showLyrics && this.lyricsRef && newIndex >= 0) {
        const lyricElement = this.lyricsRef.children[newIndex];
        if (lyricElement) {
          lyricElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    },
  },
  methods: {
    ...mapMutations([
      "playMusic",
      "pauseMusic",
      "prevMusic",
      "nextMusic",
      "togglePlayMode",
      "addFavorite",
      "removeFavorite",
      "setShowFullScreenPlayer",
      "setCurrentTime",
      "setVolume",
      "addRecentPlay",
    ]),
    toggleFavorite() {
      if (this.currentMusic) {
        if (this.isFavorite) {
          this.removeFavorite(this.currentMusic.id);
        } else {
          this.addFavorite(this.currentMusic);
        }
      }
    },
    closePlayer() {
      this.setShowFullScreenPlayer(false);
    },
    togglePlay() {
      if (!this.currentMusic?.url) return;

      if (this.isPlaying) {
        this.pauseMusic();
      } else {
        this.playMusic(this.currentMusic);
        this.addRecentPlay(this.currentMusic);
      }
    },
    toggleLyrics() {
      this.showLyrics = !this.showLyrics;
    },
    handleVolumeChange(e) {
      this.setVolume(parseFloat(e.target.value) / 100);
    },
    handleProgressClick(e) {
      if (!this.$refs.progressContainer || !this.duration) return;
      const rect = this.$refs.progressContainer.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * this.duration;
      this.setCurrentTime(newTime);
    },
    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return "00:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    },
    getPlayModeIcon() {
      const modes = ["🔁", "🔂", "🔀"];
      return modes[this.playMode] || "🔁";
    },
    getPlayModeText() {
      const texts = ["列表循环", "单曲循环", "随机播放"];
      return texts[this.playMode] || "列表循环";
    },
    preventScroll() {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    },
    allowScroll() {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    },
  },
};
</script>

<style scoped>
.fullscreen-player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 背景 */
.player-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.bg-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(40px);
  transform: scale(1.2);
  opacity: 0.5;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(20, 20, 40, 0.8) 0%,
    rgba(30, 30, 60, 0.7) 50%,
    rgba(20, 20, 40, 0.9) 100%
  );
}

/* 顶部栏 */
.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  color: #fff;
}

.close-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.player-mode {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

/* 封面区域 */
.cover-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.cover-container {
  width: min(80vw, 320px);
  height: min(80vw, 320px);
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cover-container.rotating {
  animation: rotate 8s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-container.low-opacity {
  opacity: 0.25;
  transform: scale(0.75);
  filter: blur(1px);
}

/* 歌词区域 */
.lyrics-section {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  max-height: 65vh;
  overflow-y: auto;
  text-align: center;
  padding: 30px 20px;
  z-index: 10;
}

.lyrics-section::-webkit-scrollbar {
  display: none;
}

.lyric-item {
  padding: 10px 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.45);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.9;
  font-weight: 400;
}

.lyric-item.active {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  padding: 16px 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.no-lyrics {
  color: rgba(255, 255, 255, 0.4);
  font-size: 15px;
  padding: 30px 0;
}

/* 歌曲信息 */
.song-info {
  text-align: center;
  padding: 20px 24px;
  color: #fff;
  position: relative;
  z-index: 10;
}

.song-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.9) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}

.song-artist {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 400;
  letter-spacing: 0.5px;
}

/* 进度条 */
.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 20px;
}

.time {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  min-width: 45px;
  text-align: center;
}

.time.current {
  text-align: right;
}

.progress-bar-container {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: visible;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: var(--theme-gradient);
  border-radius: 3px;
  position: relative;
  transition: width 0.1s linear;
}

.progress-thumb {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.progress-bar-container:hover .progress-thumb {
  opacity: 1;
}

/* 控制按钮 */
.controls-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
}

.control-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.control-btn:active {
  transform: scale(0.95);
}

.control-btn.mode-btn {
  font-size: 18px;
}

.play-btn {
  width: 64px;
  height: 64px;
  background: var(--theme-gradient);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  font-size: 28px;
}

.play-btn:hover {
  background: var(--theme-gradient);
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.control-btn span.active {
  color: #ff4757;
}

/* 音量控制 */
.volume-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 48px 40px;
}

.volume-icon {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
}

.volume-slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: none;
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 平板端优化 */
@media (min-width: 768px) and (max-width: 1023px) {
  .cover-container {
    width: min(70vw, 400px);
    height: min(70vw, 400px);
  }

  .song-title {
    font-size: 26px;
  }

  .song-artist {
    font-size: 18px;
  }

  .controls-section {
    gap: 32px;
  }

  .control-btn {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }

  .play-btn {
    width: 72px;
    height: 72px;
    font-size: 32px;
  }
}

/* 手机端横屏 */
@media (max-width: 767px) and (orientation: landscape) {
  .fullscreen-player {
    flex-direction: row;
    padding: 20px;
  }

  .player-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 12px 20px;
  }

  .cover-section {
    flex: 0 0 40%;
    padding: 60px 0 0;
  }

  .cover-container {
    width: 80%;
    height: auto;
    aspect-ratio: 1;
  }

  .song-info {
    flex: 1;
    padding: 60px 20px 20px;
  }

  .progress-section {
    padding: 0 20px 10px;
  }

  .controls-section {
    padding: 10px 20px;
    gap: 16px;
  }

  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .play-btn {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }

  .volume-section {
    position: absolute;
    bottom: 20px;
    right: 20px;
    padding: 0;
    width: 200px;
  }
}

/* 响应式 */
@media (max-width: 767px) {
  .player-header {
    padding: 16px 20px;
  }

  .close-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .song-title {
    font-size: 20px;
  }

  .song-artist {
    font-size: 14px;
  }

  .progress-section {
    padding: 0 20px 16px;
  }

  .controls-section {
    gap: 20px;
    padding: 16px 20px;
  }

  .control-btn {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  .play-btn {
    width: 60px;
    height: 60px;
    font-size: 26px;
  }

  .volume-section {
    padding: 0 40px 32px;
  }
}
</style>
