<template>
  <div class="music-player">
    <div class="player-info">
      <img :src="currentMusic.cover" alt="封面" class="player-cover" />
      <div class="song-info">
        <h4>{{ currentMusic.name }}</h4>
        <p>{{ currentMusic.singer }}</p>
      </div>
    </div>
    <div class="player-controls">
      <button @click="handlePrev" class="control-btn">上一首</button>
      <button @click="togglePlay" class="play-btn">
        {{ isPlaying ? "⏸" : "▶" }}
      </button>
      <button @click="handleNext" class="control-btn">下一首</button>
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
      duration: 0,
      currentTime: 0,
      wasPlaying: false, // 记录拖动前的播放状态
    };
  },
  computed: {
    ...mapState(["playState", "musicList", "volume"]),
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
    ...mapMutations(["playMusic", "pauseMusic", "updateCurrentTime"]),

    // 切换播放/暂停状态
    togglePlay() {
      if (!this.currentMusic.url) return;

      if (this.isPlaying) {
        this.pauseMusic();
      } else {
        this.playMusic(this.currentMusic);
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
        this.duration = audio.duration;
      }
    },

    // 更新播放时间（进度条拖动）
    updateTime(time) {
      const audio = this.$refs.audio;
      if (audio) {
        audio.currentTime = time;
        this.currentTime = time;
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
/* 保持原有样式不变 */
.music-player {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: #fff;
  border-top: 1px solid #eee;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 99;
}
.player-info {
  display: flex;
  align-items: center;
  width: 250px;
}
.player-cover {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 10px;
  object-fit: cover;
}
.song-info {
  overflow: hidden;
}
.song-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}
.player-controls {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.control-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
}
.play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #42b983;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.player-progress {
  width: 400px;
}
audio {
  display: none;
}
</style>
