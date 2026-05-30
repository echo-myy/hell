<template>
  <div class="playlist-page">
    <nav-bar />
    <div class="playlist-content">
      <h2>我的歌单</h2>
      <div class="playlist-list">
        <div
          class="playlist-item"
          v-for="(group, key) in musicGroup"
          :key="key"
        >
          <h3>{{ groupTitle[key] }}</h3>
          <div class="music-items">
            <music-card
              v-for="music in group"
              :key="music.id"
              :music="music"
              @play-music="handlePlayMusic"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NavBar from "@/components/NavBar.vue";
import MusicCard from "@/components/MusicCard.vue";

export default {
  name: "PlayList",
  components: { NavBar, MusicCard },
  computed: {
    ...mapState(["musicList"]),
    // 按分类分组
    musicGroup() {
      return this.musicList.reduce((group, music) => {
        if (!group[music.type]) {
          group[music.type] = [];
        }
        group[music.type].push(music);
        return group;
      }, {});
    },
    // 分类标题映射
    groupTitle() {
      return {
        pop: "流行音乐",
        rock: "摇滚音乐",
        classic: "古典音乐",
      };
    },
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
.playlist-content {
  padding: 30px 50px;
}
.playlist-item {
  margin-bottom: 40px;
}
.playlist-item h3 {
  text-align: left;
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  border-left: 4px solid #42b983;
  padding-left: 10px;
}
.music-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>
