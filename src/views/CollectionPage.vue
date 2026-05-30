<template>
  <div class="collection-page">
    <nav-bar />
    <div class="collection-content">
      <h2>我的收藏</h2>
      <div class="collection-list">
        <music-card
          v-for="music in collectList"
          :key="music.id"
          :music="music"
          @play-music="handlePlayMusic"
        />
      </div>
      <div class="empty-tip" v-if="collectList.length === 0">
        暂无收藏音乐，快去首页收藏喜欢的歌曲吧~
      </div>
    </div>
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
  // 新增：页面创建时强制同步localStorage到Vuex（双重保障）
  created() {
    const localCollect = JSON.parse(localStorage.getItem("collectList")) || [];
    // 若本地有数据但Vuex中无，手动同步
    if (localCollect.length > 0 && this.collectList.length === 0) {
      // 清空原有空数组，替换为本地数据
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
.collection-content {
  padding: 30px 50px;
}
.collection-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px; /* 新增：增加歌曲卡片间距，优化布局 */
}
.empty-tip {
  text-align: center;
  color: #999;
  margin-top: 50px;
  font-size: 16px;
}
</style>
