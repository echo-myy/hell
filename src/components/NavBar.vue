<template>
  <div class="nav-bar">
    <div class="nav-left">
      <div class="logo">MelodyVue</div>
    </div>
    <div class="nav-center">
      <nav class="nav-menu">
        <router-link to="/home" class="menu-item" active-class="active">
          <span class="menu-icon">🏠</span>
          <span class="menu-text">首页</span>
        </router-link>
        <router-link to="/playlist" class="menu-item" active-class="active">
          <span class="menu-icon">📋</span>
          <span class="menu-text">歌单</span>
        </router-link>
        <router-link to="/collection" class="menu-item" active-class="active">
          <span class="menu-icon">❤️</span>
          <span class="menu-text">收藏</span>
        </router-link>
        <router-link to="/setting" class="menu-item" active-class="active">
          <span class="menu-icon">⚙️</span>
          <span class="menu-text">设置</span>
        </router-link>
      </nav>
    </div>
    <div class="nav-right">
      <div class="user-avatar">
        <span class="avatar-icon">👤</span>
      </div>
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
  height: 70px;
  background: linear-gradient(
    180deg,
    rgba(30, 30, 50, 0.98) 0%,
    rgba(20, 20, 35, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
  transition: transform 0.3s ease;
}
.logo:hover {
  transform: scale(1.05);
}
.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.nav-menu {
  display: flex;
  gap: 8px;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 20px;
  position: relative;
  transition: all 0.3s ease;
}
.menu-icon {
  font-size: 16px;
}
.menu-item:hover {
  color: white;
  background: rgba(102, 126, 234, 0.2);
}
.menu-item.active {
  color: white;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.3) 0%,
    rgba(118, 75, 162, 0.3) 100%
  );
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}
.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}
.avatar-icon {
  font-size: 18px;
}
.username {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 14px;
}
.logout-btn {
  padding: 10px 22px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 107, 0.8) 0%,
    rgba(238, 82, 83, 0.8) 100%
  );
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(238, 82, 83, 0.3);
}
.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(238, 82, 83, 0.4);
}
.logout-btn:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .nav-bar {
    padding: 0 20px;
  }

  .menu-item {
    padding: 8px 16px;
    font-size: 14px;
  }

  .user-avatar {
    width: 38px;
    height: 38px;
  }
}

@media (max-width: 768px) {
  .nav-bar {
    height: 60px;
    padding: 0 16px;
  }

  .logo {
    font-size: 18px;
  }

  .nav-menu {
    gap: 4px;
  }

  .menu-item {
    font-size: 12px;
    padding: 6px 12px;
  }

  .menu-text {
    display: none;
  }

  .menu-icon {
    font-size: 14px;
  }

  .nav-right {
    gap: 12px;
  }

  .username {
    display: none;
  }

  .user-avatar {
    width: 34px;
    height: 34px;
  }

  .logout-btn {
    padding: 6px 16px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .nav-bar {
    padding: 0 12px;
  }

  .nav-menu {
    gap: 2px;
  }

  .menu-item {
    padding: 5px 10px;
  }

  .logout-btn {
    padding: 5px 12px;
    font-size: 11px;
  }
}
</style>
