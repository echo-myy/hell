<template>
  <div
    v-if="currentMusic && showMiniPlayer"
    class="mini-player"
    @click="expandPlayer"
  >
    <!-- 进度条 -->
    <div class="mini-progress" @click.stop>
      <div
        class="mini-progress-bar"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>

    <!-- 封面 -->
    <div class="mini-cover">
      <img
        :src="
          currentMusic.cover || currentMusic.cover_url || '/default-cover.jpg'
        "
        :alt="currentMusic.name || currentMusic.title"
        :class="{ rotating: isPlaying }"
      />
    </div>

    <!-- 信息 -->
    <div class="mini-info">
      <div class="mini-title">
        {{ currentMusic.name || currentMusic.title || "未知歌曲" }}
      </div>
      <div class="mini-artist">
        {{ currentMusic.singer || currentMusic.artist || "未知艺术家" }}
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="mini-controls" @click.stop>
      <button class="mini-btn" @click="togglePlay">
        <span v-if="isPlaying">⏸</span>
        <span v-else>▶️</span>
      </button>
      <button class="mini-btn" @click="nextMusic">
        <span>⏭</span>
      </button>
      <button class="mini-btn expand-btn" @click="expandPlayer">
        <span>🔝</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "MiniPlayer",
  computed: {
    ...mapState([
      "currentMusic",
      "isPlaying",
      "currentTime",
      "duration",
      "showMiniPlayer",
      "musicList",
    ]),
    progressPercent() {
      if (!this.duration) return 0;
      return (this.currentTime / this.duration) * 100;
    },
  },
  methods: {
    ...mapMutations([
      "playMusic",
      "pauseMusic",
      "nextMusic",
      "setShowFullScreenPlayer",
      "addRecentPlay",
    ]),
    togglePlay() {
      if (!this.currentMusic?.url) return;

      if (this.isPlaying) {
        this.pauseMusic();
      } else {
        this.playMusic(this.currentMusic);
        this.addRecentPlay(this.currentMusic);
      }
    },
    expandPlayer() {
      this.setShowFullScreenPlayer(true);
    },
  },
};
</script>

<style scoped>
/* 迷你播放器容器 */
.mini-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: linear-gradient(
    180deg,
    rgba(22, 22, 40, 0.98) 0%,
    rgba(28, 28, 50, 0.98) 100%
  );
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* 进度条 */
.mini-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2.5px;
  background: rgba(255, 255, 255, 0.12);
  cursor: pointer;
}

.mini-progress-bar {
  height: 100%;
  background: var(--theme-gradient);
  transition: width 0.1s linear;
}

/* 封面 */
.mini-cover {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
}

.mini-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.mini-cover img.rotating {
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

/* 信息 */
.mini-info {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
  overflow: hidden;
}

.mini-title {
  font-size: 14.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
}

.mini-artist {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
}

/* 控制按钮 */
.mini-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.mini-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.mini-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.mini-btn:active {
  transform: scale(0.95);
}

.expand-btn {
  background: var(--theme-gradient);
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.25);
}

.expand-btn:hover {
  transform: scale(1.1);
}

/* 电脑端隐藏迷你播放器 */
@media (min-width: 1024px) {
  .mini-player {
    display: none;
  }
}

/* 平板端调整 */
@media (min-width: 768px) and (max-width: 1023px) {
  .mini-player {
    height: 72px;
    padding: 0 20px;
  }

  .mini-cover {
    width: 56px;
    height: 56px;
  }

  .mini-btn {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
}

/* 手机端优化 */
@media (max-width: 767px) {
  .mini-player {
    height: 60px;
    padding: 0 12px;
  }

  .mini-cover {
    width: 44px;
    height: 44px;
    border-radius: 6px;
  }

  .mini-info {
    margin-left: 10px;
  }

  .mini-title {
    font-size: 14px;
  }

  .mini-artist {
    font-size: 11px;
  }

  .mini-controls {
    gap: 6px;
  }

  .mini-btn {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .mini-btn:nth-child(3) {
    display: none;
  }
}

/* 超小屏幕 */
@media (max-width: 360px) {
  .mini-player {
    padding: 0 8px;
  }

  .mini-cover {
    width: 40px;
    height: 40px;
  }

  .mini-info {
    margin-left: 8px;
  }

  .mini-btn {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}
</style>
