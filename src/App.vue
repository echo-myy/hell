<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view />

    <!-- 电脑端/平板端：显示完整播放器 -->
    <div class="desktop-player">
      <music-player v-if="isLogin && !isMobile" />
    </div>

    <!-- 手机端：显示迷你播放器 -->
    <mini-player v-if="isLogin && isMobile" />

    <!-- 全屏播放器 -->
    <full-screen-player />
  </div>
</template>

<script>
import MusicPlayer from "@/components/MusicPlayer.vue";
import MiniPlayer from "@/components/MiniPlayer.vue";
import FullScreenPlayer from "@/components/FullScreenPlayer.vue";
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    MusicPlayer,
    MiniPlayer,
    FullScreenPlayer,
  },
  data() {
    return {
      isMobile: false,
    };
  },
  computed: {
    ...mapState(["user", "themeColor"]),
    isLogin() {
      return this.user.isLogin;
    },
  },
  watch: {
    themeColor: {
      immediate: true,
      handler(theme) {
        this.updateThemeVariables(theme);
      },
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
    this.updateThemeVariables(this.themeColor);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 1024;
      this.$store.commit("setShowMiniPlayer", this.isMobile);
    },
    updateThemeVariables(theme) {
      if (theme) {
        document.documentElement.style.setProperty(
          "--theme-primary",
          theme.primary
        );
        document.documentElement.style.setProperty(
          "--theme-secondary",
          theme.secondary
        );
        document.documentElement.style.setProperty(
          "--theme-gradient",
          theme.gradient
        );
      }
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
  min-height: 100vh;
}

.desktop-player {
  display: block;
}

/* 当手机端显示迷你播放器时，给页面底部留出空间 */
@media (max-width: 1023px) {
  #app {
    padding-bottom: 64px;
  }
}

@media (max-width: 767px) {
  #app {
    padding-bottom: 60px;
  }
}
</style>
