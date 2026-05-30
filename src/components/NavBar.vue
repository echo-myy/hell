<template>
  <div class="nav-bar">
    <div class="logo">MelodyVue</div>
    <div class="nav-menu">
      <router-link to="/home" class="menu-item" active-class="active"
        >首页</router-link
      >
      <router-link to="/playlist" class="menu-item" active-class="active"
        >歌单</router-link
      >
      <router-link to="/collection" class="menu-item" active-class="active"
        >我的收藏</router-link
      >
      <router-link to="/setting" class="menu-item" active-class="active"
        >最近播放</router-link
      >
    </div>
    <div class="user-info">
      <span class="username">{{ username }}</span>
      <button @click="handleLogout" class="logout-btn">退出登录</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "NavBar",
  computed: {
    ...mapState(["user"]),
    username() {
      return this.user.username || "用户";
    },
  },
  methods: {
    ...mapMutations(["logout"]),
    handleLogout() {
      this.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.nav-bar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  color: #42b983;
}
.nav-menu {
  display: flex;
  gap: 30px;
}
.menu-item {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  padding: 5px 0;
  position: relative;
}
.menu-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #42b983;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}
.username {
  color: #666;
}
.logout-btn {
  padding: 5px 15px;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  background: transparent;
  color: #ff4d4f;
  cursor: pointer;
}
.logout-btn:hover {
  background: #fff2f2;
}
</style>
