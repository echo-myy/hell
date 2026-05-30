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
        <!-- 引入全局播放器组件，统一播放实例 -->
        <music-player />
      </div>
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
import MusicPlayer from "@/components/MusicPlayer.vue"; // 引入播放器组件

export default {
  name: "MusicDetail",
  components: {
    NavBar,
    MusicCard,
    MusicPlayer, // 注册播放器组件
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
    ...mapMutations(["playMusic", "collectMusic", "cancelCollect"]),
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
  // 页面加载时自动选中当前歌曲
  mounted() {
    this.handlePlayMusic();
  },
};
</script>

<style scoped>
.detail-content {
  padding: 30px 50px;
}
.detail-header {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  align-items: center;
}
.detail-cover {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.detail-info h1 {
  margin: 0 0 15px;
  font-size: 28px;
}
.detail-info p {
  margin: 5px 0;
  color: #666;
  font-size: 16px;
}
.detail-actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}
.play-btn {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.collect-btn {
  padding: 10px 20px;
  border: 1px solid #42b983;
  color: #42b983;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
}
.detail-player {
  margin-bottom: 40px;
}
.audio-player {
  width: 100%;
  margin-top: 10px;
}
.related-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>
