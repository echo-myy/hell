<template>
  <div class="music-player">
    <div class="player-info">
      <img
        :src="currentMusic.cover"
        alt="封面"
        class="player-cover"
        :class="{ rotating: isPlaying }"
      />
      <div class="song-info">
        <h4>{{ currentMusic.name }}</h4>
        <p>{{ currentMusic.singer }}</p>
      </div>
    </div>
    <div class="player-controls">
      <button @click="handlePrev" class="control-btn">⏮</button>
      <button @click="togglePlay" class="play-btn">
        {{ isPlaying ? "⏸" : "▶" }}
      </button>
      <button @click="handleNext" class="control-btn">⏭</button>
    </div>
    <div class="player-progress">
      <progress-bar
        :current-time="currentTime"
        :duration="duration"
        @update-time="updateTime"
        @drag-start="handleDragStart"
        @drag-end="handleDragEnd"
      />
    </div>
    <audio
      ref="audio"
      :src="currentMusic.url"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleEnded"
      :volume="volume"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ProgressBar from "./ProgressBar.vue";

export default {
  name: "MusicPlayer",
  components: { ProgressBar },
  data() {
    return {
      wasPlaying: false, // 记录拖动前的播放状态
    };
  },
  computed: {
    ...mapState([
      "playState",
      "musicList",
      "volume",
      "duration",
      "currentTime",
    ]),
    currentMusic() {
      // 确保currentMusic始终有默认值，避免空引用
      return (
        this.playState.currentMusic ||
        this.musicList[0] || {
          cover: "",
          name: "暂无歌曲",
          singer: "",
          url: "",
        }
      );
    },
    isPlaying() {
      return this.playState.isPlaying;
    },
  },
  watch: {
    // 监听当前播放歌曲变化，自动加载并播放
    "playState.currentMusic": {
      handler(newVal, oldVal) {
        if (newVal && newVal.id !== oldVal?.id) {
          this.$nextTick(() => {
            const audio = this.$refs.audio;
            if (audio && newVal.url) {
              audio.load();
              if (this.isPlaying) {
                audio.play().catch((err) => {
                  console.error("播放失败:", err);
                  // 自动降级为暂停状态
                  this.pauseMusic();
                });
              }
            }
          });
        }
      },
      deep: true,
    },
    // 监听播放状态变化
    isPlaying(newVal) {
      const audio = this.$refs.audio;
      if (!audio || !this.currentMusic.url) return;

      if (newVal) {
        audio.play().catch((err) => console.error("播放失败:", err));
      } else {
        audio.pause();
      }
    },
  },
  methods: {
    ...mapMutations([
      "playMusic",
      "pauseMusic",
      "updateCurrentTime",
      "setDuration",
      "addRecentPlay",
    ]),

    // 切换播放/暂停状态
    togglePlay() {
      if (!this.currentMusic.url) return;

      if (this.isPlaying) {
        this.pauseMusic();
      } else {
        this.playMusic(this.currentMusic);
        this.addRecentPlay(this.currentMusic);
      }
    },

    // 处理音频时间更新
    handleTimeUpdate() {
      const audio = this.$refs.audio;
      if (audio) {
        this.currentTime = audio.currentTime;
        this.updateCurrentTime(audio.currentTime);
      }
    },

    // 处理音频元数据加载完成
    handleLoadedMetadata() {
      const audio = this.$refs.audio;
      if (audio) {
        this.setDuration(audio.duration);
      }
    },

    // 更新播放时间（进度条拖动）
    updateTime(time) {
      const audio = this.$refs.audio;
      if (audio) {
        audio.currentTime = time;
        this.updateCurrentTime(time);
      }
    },

    // 上一首
    handlePrev() {
      if (!this.currentMusic.id || this.musicList.length === 0) return;

      const currentIndex = this.musicList.findIndex(
        (item) => item.id === this.currentMusic.id
      );
      const prevIndex =
        (currentIndex - 1 + this.musicList.length) % this.musicList.length;
      this.playMusic(this.musicList[prevIndex]);
    },

    // 下一首
    handleNext() {
      if (!this.currentMusic.id || this.musicList.length === 0) return;

      const currentIndex = this.musicList.findIndex(
        (item) => item.id === this.currentMusic.id
      );
      const nextIndex = (currentIndex + 1) % this.musicList.length;
      this.playMusic(this.musicList[nextIndex]);
    },

    // 处理播放结束
    handleEnded() {
      this.handleNext();
    },

    // 处理进度条拖动开始
    handleDragStart() {
      const audio = this.$refs.audio;
      if (audio) {
        this.wasPlaying = this.isPlaying; // 保存拖动前的播放状态
        if (this.isPlaying) {
          this.pauseMusic(); // 拖动时暂停播放
        }
      }
    },

    // 处理进度条拖动结束
    handleDragEnd() {
      const audio = this.$refs.audio;
      if (audio && this.wasPlaying) {
        this.playMusic(this.currentMusic); // 恢复播放状态
      }
    },
  },
  mounted() {
    // 监听全局播放事件
    this.$root.$on("play-music-from-card", (music) => {
      this.playMusic(music);
    });
  },
  beforeDestroy() {
    this.$root.$off("play-music-from-card");
  },
};
</script>

<style scoped>
.music-player {
  display: flex;
  align-items: center;
  padding: 12px 32px;
  background: linear-gradient(
    180deg,
    rgba(26, 26, 46, 0.98) 0%,
    rgba(22, 33, 62, 0.98) 100%
  );
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  z-index: 99;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.player-info {
  display: flex;
  align-items: center;
  width: 280px;
}

.player-cover {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-right: 16px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex-shrink: 0;
}

.player-cover:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.song-info {
  overflow: hidden;
  text-align: left;
  flex: 1;
  min-width: 0;
}

.song-info h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
  transition: color 0.3s ease;
}

.song-info h4:hover {
  color: #667eea;
}

.song-info p {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-controls {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 20px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
  color: white;
}

.control-btn:active {
  transform: scale(0.95);
}

.play-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.play-btn:active {
  transform: scale(0.95);
}

.player-progress {
  width: 450px;
  padding: 0 20px;
}

audio {
  display: none;
}

/* 平板端优化（768px - 1023px） */
@media (min-width: 768px) and (max-width: 1023px) {
  .music-player {
    padding: 12px 24px;
    height: 80px;
  }

  .player-info {
    width: 220px;
  }

  .player-cover {
    width: 52px;
    height: 52px;
  }

  .song-info h4 {
    font-size: 14px;
  }

  .song-info p {
    font-size: 12px;
  }

  .player-controls {
    gap: 16px;
  }

  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .play-btn {
    width: 50px;
    height: 50px;
    font-size: 22px;
  }

  .player-progress {
    width: 300px;
    padding: 0 16px;
  }
}

/* 平板竖屏（768px - 1023px） */
@media (min-width: 768px) and (max-width: 1023px) and (orientation: portrait) {
  .music-player {
    flex-wrap: nowrap;
  }

  .player-info {
    flex: 0 0 200px;
  }

  .player-controls {
    flex: 0 0 auto;
  }

  .player-progress {
    flex: 1;
    min-width: 200px;
  }
}

/* 手机端隐藏（在App.vue中由MiniPlayer替代） */
@media (max-width: 767px) {
  .music-player {
    display: none;
  }
}

/* 超大屏幕（>1400px） */
@media (min-width: 1400px) {
  .player-info {
    width: 320px;
  }

  .player-progress {
    width: 520px;
  }

  .player-controls {
    gap: 32px;
  }

  .control-btn {
    width: 48px;
    height: 48px;
    font-size: 22px;
  }

  .play-btn {
    width: 60px;
    height: 60px;
    font-size: 26px;
  }
}
</style>
