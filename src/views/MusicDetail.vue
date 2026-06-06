<template>
  <div class="music-detail-page">
    <nav-bar />
    <div class="detail-content">
      <div class="detail-header">
        <img :src="currentMusic.cover" alt="封面" class="detail-cover" />
        <div class="detail-info">
          <h1>{{ currentMusic.name }}</h1>
          <p>歌手：{{ currentMusic.singer }}</p>
          <p>时长：{{ currentMusic.duration }}</p>
          <p>分类：{{ typeTitle[currentMusic.type] }}</p>
          <div class="detail-actions">
            <button @click="handlePlayMusic" class="play-btn">立即播放</button>
            <button @click="handleCollect" class="collect-btn">
              {{ isCollected(currentMusic.id) ? "取消收藏" : "收藏歌曲" }}
            </button>
          </div>
        </div>
      </div>
      <div class="detail-player">
        <h3>歌曲播放</h3>
        <music-player />
      </div>
      <comment-section :music-id="currentMusic.id" />
      <div class="related-music" v-if="relatedMusic.length > 0">
        <h3>相关推荐</h3>
        <div class="related-list">
          <music-card
            v-for="music in relatedMusic"
            :key="music.id"
            :music="music"
            @play-music="handlePlayMusic"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import NavBar from "@/components/NavBar.vue";
import MusicCard from "@/components/MusicCard.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";
import CommentSection from "@/components/CommentSection.vue";

export default {
  name: "MusicDetail",
  components: {
    NavBar,
    MusicCard,
    MusicPlayer,
    CommentSection,
  },
  computed: {
    ...mapState(["musicList", "collectList"]),
    ...mapGetters(["isCollected"]),
    currentMusic() {
      const id = Number(this.$route.params.id);
      return (
        this.musicList.find((music) => music.id === id) || this.musicList[0]
      );
    },
    typeTitle() {
      return {
        pop: "流行音乐",
        rock: "摇滚音乐",
        classic: "古典音乐",
      };
    },
    relatedMusic() {
      // 只有1首歌时不显示相关推荐
      return this.musicList
        .filter(
          (music) =>
            music.type === this.currentMusic.type &&
            music.id !== this.currentMusic.id
        )
        .slice(0, 4);
    },
  },
  methods: {
    ...mapMutations([
      "playMusic",
      "collectMusic",
      "cancelCollect",
      "setCurrentMusic",
    ]),
    handlePlayMusic(music = this.currentMusic) {
      this.playMusic(music);
      // 同步触发全局播放事件，确保播放器状态一致
      this.$root.$emit("play-music-from-card", music);
    },
    handleCollect() {
      if (this.isCollected(this.currentMusic.id)) {
        this.cancelCollect(this.currentMusic.id);
      } else {
        this.collectMusic(this.currentMusic);
      }
    },
  },
  mounted() {
    // 更新当前歌曲信息，但不自动播放
    this.setCurrentMusic(this.currentMusic);
  },
};
</script>

<style scoped>
.music-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  position: relative;
  overflow-x: hidden;
}

.music-detail-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(102, 126, 234, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(118, 75, 162, 0.15) 0%,
      transparent 50%
    );
  pointer-events: none;
  z-index: 0;
}

.detail-content {
  padding: 16px 30px;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-header {
  display: flex;
  gap: 25px;
  margin-bottom: 25px;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: slideInLeft 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.detail-cover {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(102, 126, 234, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: coverFloat 6s ease-in-out infinite;
}

@keyframes coverFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.detail-cover:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6), 0 0 60px rgba(102, 126, 234, 0.4);
}

.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.detail-info h1 {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%,
  100% {
    text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
  }
  50% {
    text-shadow: 0 0 50px rgba(102, 126, 234, 0.5);
  }
}

.detail-info p {
  margin: 4px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-info p::before {
  content: "";
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.detail-actions {
  margin-top: 14px;
  display: flex;
  gap: 12px;
}

.play-btn {
  padding: 10px 26px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.play-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.play-btn:hover::before {
  left: 100%;
}

.play-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
}

.play-btn:active {
  transform: translateY(-1px);
}

.collect-btn {
  padding: 10px 26px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.collect-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(102, 126, 234, 0.6);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.collect-btn:active {
  transform: translateY(-1px);
}

.detail-player {
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.detail-player h3,
.related-music h3 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  position: relative;
  display: inline-block;
}

.detail-player h3::after,
.related-music h3::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
}

.related-music {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.related-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}

@media (max-width: 968px) {
  .detail-content {
    padding: 30px 20px;
  }

  .detail-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 30px;
  }

  .detail-cover {
    width: 220px;
    height: 220px;
  }

  .detail-info h1 {
    font-size: 32px;
  }

  .detail-info p {
    justify-content: center;
  }

  .detail-actions {
    justify-content: center;
  }

  .related-list {
    justify-content: center;
  }
}
</style>
