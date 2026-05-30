<template>
  <div class="music-list-page">
    <nav-bar />
    <div class="page-content">
      <h2>全部歌曲</h2>
      <div class="music-grid">
        <music-card v-for="music in musicList" :key="music.id" :music="music" />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import MusicCard from "@/components/MusicCard.vue";
import { mapState } from "vuex";

export default {
  name: "MusicList",
  components: {
    NavBar,
    MusicCard,
  },
  computed: {
    // 从 Vuex 获取全部歌曲列表
    ...mapState(["musicList"]),
  },
};
</script>

<style scoped>
.page-content {
  padding: 20px;
  margin-top: 60px; /* 避开导航栏 */
}
.music-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
</style>
