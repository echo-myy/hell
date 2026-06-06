<template>
  <div class="collection-page">
    <nav-bar />
    <div class="collection-content">
      <div class="page-header">
        <div class="header-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>
        <div class="header-content">
          <h1 class="page-title">我的收藏</h1>
          <p class="page-subtitle">{{ collectList.length }} 首收藏歌曲</p>
        </div>
      </div>
      <div class="collection-list">
        <div
          class="music-item fade-in"
          v-for="(music, index) in collectList"
          :key="music.id"
          :style="{ animationDelay: `${index * 0.08}s` }"
        >
          <music-card :music="music" @play-music="handlePlayMusic" />
        </div>
      </div>
      <div class="empty-tip" v-if="collectList.length === 0">
        <div class="empty-icon">💝</div>
        <p>暂无收藏音乐</p>
        <p class="empty-hint">快去首页收藏喜欢的歌曲吧~</p>
      </div>
    </div>
    <div class="bg-decoration bg-1"></div>
    <div class="bg-decoration bg-2"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NavBar from "@/components/NavBar.vue";
import MusicCard from "@/components/MusicCard.vue";

export default {
  name: "CollectionPage",
  components: { NavBar, MusicCard },
  computed: {
    ...mapState(["collectList"]),
  },
  created() {
    const localCollect = JSON.parse(localStorage.getItem("collectList")) || [];
    if (localCollect.length > 0 && this.collectList.length === 0) {
      this.$store.state.collectList = localCollect;
    }
  },
  methods: {
    ...mapMutations(["playMusic"]),
    handlePlayMusic(music) {
      this.playMusic(music);
    },
  },
};
</script>

<style scoped>
.collection-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #1a1a2e 0%,
    #16213e 30%,
    #0f3460 70%,
    #1a1a2e 100%
  );
  overflow: hidden;
}

.bg-decoration {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.bg-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -200px;
  right: -200px;
  animation: float 20s ease-in-out infinite;
}

.bg-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -100px;
  left: -100px;
  animation: float 25s ease-in-out infinite reverse;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.05);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

.collection-content {
  position: relative;
  z-index: 1;
  padding: 40px 60px;
  padding-bottom: 140px;
}

.page-header {
  position: relative;
  margin-bottom: 40px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.3) 0%,
    rgba(118, 75, 162, 0.3) 100%
  );
}

.circle-1 {
  width: 150px;
  height: 150px;
  top: -50px;
  right: 50px;
  animation: pulse 4s ease-in-out infinite;
}

.circle-2 {
  width: 100px;
  height: 100px;
  bottom: -30px;
  left: 100px;
  animation: pulse 3s ease-in-out infinite 1s;
}

.circle-3 {
  width: 80px;
  height: 80px;
  top: 20px;
  left: 300px;
  animation: pulse 3.5s ease-in-out infinite 0.5s;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

.header-content {
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #fff 0%, #a8edea 50%, #fed6e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.3);
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.collection-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 28px;
}

.music-item {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  animation: fadeIn 0.6s ease-out;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.6;
  animation: heartbeat 2s ease-in-out infinite;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  10% {
    transform: scale(1.1);
  }
  20% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.1);
  }
  40%,
  100% {
    transform: scale(1);
  }
}

.empty-tip p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  margin: 8px 0;
  text-align: center;
}

.empty-hint {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

@media (max-width: 768px) {
  .collection-content {
    padding: 24px 20px;
    padding-bottom: 140px;
  }

  .page-header {
    padding: 28px 24px;
  }

  .page-title {
    font-size: 28px;
  }

  .collection-list {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}
</style>
