<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view />
    <!-- 全局音乐播放器（始终显示） -->
    <music-player v-if="isLogin" />
  </div>
</template>

<script>
import MusicPlayer from "@/components/MusicPlayer.vue";
import { mapState } from "vuex";

export default {
  name: "App",
  components: { MusicPlayer },
  computed: {
    ...mapState(["user"]),
    isLogin() {
      return this.user.isLogin;
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>
