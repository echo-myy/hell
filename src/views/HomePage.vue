<template>
  <div class="home-container">
    <nav-bar></nav-bar>
    <div class="main-content">
      <side-bar @change-type="handleChangeType"></side-bar>
      <div class="content-right">
        <div class="hero-section">
          <div class="hero-content">
            <div class="hero-text">
              <h1>发现音乐</h1>
              <p>探索无限音乐世界，发现你的专属旋律</p>
              <button class="hero-play-btn">开始探索</button>
            </div>
            <div class="hero-visual">
              <div class="hero-cover">
                <img :src="heroMusic.cover" alt="封面" />
                <div class="cover-overlay"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-header">
          <search-bar @search="handleSearch" />
          <button @click="showAddModal = true" class="add-music-btn">
            <span class="btn-icon">+</span>
            添加音乐
          </button>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-icon">🎵</span>
            <div class="stat-info">
              <p class="stat-value">{{ musicList.length }}</p>
              <p class="stat-label">音乐总数</p>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">❤️</span>
            <div class="stat-info">
              <p class="stat-value">{{ collectCount }}</p>
              <p class="stat-label">我的收藏</p>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🔥</span>
            <div class="stat-info">
              <p class="stat-value">{{ recentCount }}</p>
              <p class="stat-label">最近播放</p>
            </div>
          </div>
        </div>

        <div class="section-title">
          <h2>热门推荐</h2>
          <p>{{ filteredMusicList.length }} 首歌曲</p>
        </div>
        <div class="music-list">
          <div
            class="music-item fade-in"
            v-for="(music, index) in filteredMusicList"
            :key="music.id"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <music-card :music="music" @play="handlePlayMusic"></music-card>
          </div>
        </div>
        <div v-if="filteredMusicList.length === 0" class="empty-state">
          <div class="empty-icon">🎵</div>
          <p>暂无音乐</p>
        </div>
        <modal-dialog
          :visible="showAddModal"
          @update:visible="showAddModal = $event"
          title="添加新音乐"
          :show-footer="false"
        >
          <add-music-form
            ref="addMusicForm"
            @add-music="onAddMusic"
          ></add-music-form>
        </modal-dialog>
      </div>

      <div class="content-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">
            <span class="title-icon">🎶</span>
            热门排行
          </h3>
          <div class="top-music-list">
            <div
              v-for="(music, index) in topMusic"
              :key="music.id"
              class="top-item"
              :class="{
                top1: index === 0,
                top2: index === 1,
                top3: index === 2,
              }"
            >
              <span class="rank">{{ index + 1 }}</span>
              <img :src="music.cover" alt="" class="top-cover" />
              <div class="top-info">
                <p class="top-name">{{ music.name }}</p>
                <p class="top-singer">{{ music.singer }}</p>
              </div>
              <button @click="handlePlayMusic(music)" class="top-play-btn">
                ▶
              </button>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">
            <span class="title-icon">👤</span>
            推荐歌手
          </h3>
          <div class="singer-list">
            <div
              v-for="singer in singers"
              :key="singer.name"
              class="singer-item"
            >
              <div class="singer-avatar">{{ singer.avatar }}</div>
              <span class="singer-name">{{ singer.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <music-player></music-player>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";
import SearchBar from "@/components/SearchBar.vue";
import MusicCard from "@/components/MusicCard.vue";
import ModalDialog from "@/components/ModalDialog.vue";
import AddMusicForm from "@/components/AddMusicForm.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";

export default {
  name: "HomePage",
  components: {
    NavBar,
    SideBar,
    SearchBar,
    MusicCard,
    ModalDialog,
    AddMusicForm,
    MusicPlayer,
  },
  data() {
    return {
      currentType: "all",
      searchVal: "",
      showAddModal: false,
      singers: [
        { name: "周杰伦", avatar: "🎤" },
        { name: "陈粒", avatar: "🎵" },
        { name: "林俊杰", avatar: "🎹" },
        { name: "Taylor Swift", avatar: "🎸" },
        { name: "Khalid", avatar: "🎧" },
        { name: "Coldplay", avatar: "🎼" },
      ],
    };
  },
  computed: {
    ...mapState(["musicList", "collectList", "recentPlayList"]),
    filteredMusicList() {
      return this.musicList.filter((music) => {
        const typeMatch =
          this.currentType === "all" || music.type === this.currentType;
        const searchMatch =
          music.name.includes(this.searchVal) ||
          music.singer.includes(this.searchVal);
        return typeMatch && searchMatch;
      });
    },
    heroMusic() {
      return this.musicList[0] || { cover: "" };
    },
    topMusic() {
      return this.musicList.slice(0, 5);
    },
    collectCount() {
      return this.collectList.length;
    },
    recentCount() {
      return this.recentPlayList.length;
    },
  },
  methods: {
    handleChangeType(type) {
      this.currentType = type;
    },
    handleSearch(val) {
      this.searchVal = val;
    },
    handlePlayMusic(music) {
      this.$store.commit("playMusic", music);
    },
    async onAddMusic(newMusic) {
      if (newMusic) {
        this.$store.commit("addMusic", newMusic);
        try {
          await this.$store.dispatch("addMusicToDB", {
            title: newMusic.name,
            artist: newMusic.singer,
            album: newMusic.type,
            duration: 0,
            cover_url: newMusic.cover,
            music_url: newMusic.url,
          });
        } catch (error) {
          console.error("Failed to sync to database:", error);
        }
        this.showAddModal = false;
      }
    },
  },
};
</script>

<style scoped>
.home-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.main-content {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
}

.content-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 140px;
}

.content-sidebar {
  width: 320px;
  display: none;
}

@media (min-width: 1200px) {
  .content-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 140px;
  }
}

.hero-section {
  margin-bottom: 20px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.3) 0%,
    rgba(118, 75, 162, 0.3) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-content {
  display: flex;
  align-items: center;
  padding: 30px;
  gap: 40px;
}

.hero-text {
  flex: 1;
}

.hero-text h1 {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px;
}

.hero-text p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin: 0 0 20px;
}

.hero-play-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.hero-play-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
}

.hero-visual {
  position: relative;
}

.hero-cover {
  width: 180px;
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.4);
}

.hero-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.3) 0%,
    rgba(118, 75, 162, 0.3) 100%
  );
}

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 28px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 2px 0 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.add-music-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  white-space: nowrap;
}

.add-music-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  font-size: 20px;
  font-weight: bold;
}

.section-title {
  margin-bottom: 16px;
}

.section-title h2 {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.section-title p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.music-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.sidebar-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0 0 16px;
}

.title-icon {
  font-size: 18px;
}

.top-music-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.top-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
}

.top-item.top1 .rank {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #1a1a2e;
}

.top-item.top2 .rank {
  background: linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%);
  color: #1a1a2e;
}

.top-item.top3 .rank {
  background: linear-gradient(135deg, #cd7f32 0%, #b87333 100%);
  color: #1a1a2e;
}

.top-cover {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
}

.top-info {
  flex: 1;
  min-width: 0;
}

.top-name {
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-singer {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.top-play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.3);
  border: none;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.top-play-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scale(1.1);
}

.singer-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.singer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.singer-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-3px);
}

.singer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.3) 0%,
    rgba(118, 75, 162, 0.3) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.singer-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

@media (max-width: 1200px) {
  .content-sidebar {
    display: none;
  }
}

@media (max-width: 1024px) {
  .music-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .hero-content {
    padding: 24px;
    gap: 30px;
  }

  .hero-text h1 {
    font-size: 34px;
  }

  .hero-cover {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    padding: 12px;
    gap: 12px;
  }

  .content-right {
    padding-bottom: 140px;
  }

  .content-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .add-music-btn {
    width: 100%;
    justify-content: center;
  }

  .music-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .section-title h2 {
    font-size: 18px;
  }

  .section-title p {
    font-size: 12px;
  }

  .hero-section {
    margin-bottom: 16px;
  }

  .hero-content {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    text-align: center;
  }

  .hero-text h1 {
    font-size: 28px;
  }

  .hero-text p {
    font-size: 14px;
  }

  .hero-cover {
    width: 140px;
    height: 140px;
  }

  .stats-row {
    gap: 10px;
  }

  .stat-card {
    padding: 14px 12px;
    gap: 10px;
  }

  .stat-icon {
    font-size: 22px;
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-label {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .music-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .home-container {
    min-height: calc(100vh - 60px);
  }

  .hero-text h1 {
    font-size: 24px;
  }

  .hero-cover {
    width: 120px;
    height: 120px;
  }

  .stats-row {
    flex-direction: column;
  }

  .stat-card {
    flex-direction: row;
    justify-content: center;
  }
}

.music-item {
  opacity: 0;
  animation: fadeIn 0.4s ease-out forwards;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.empty-icon {
  font-size: 50px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
