<template>
  <div class="setting-page">
    <nav-bar />
    <div class="setting-container">
      <div class="setting-header fade-in">
        <h1>设置</h1>
        <p>个性化你的音乐体验</p>
      </div>

      <div class="setting-content">
        <div class="setting-section scale-in" style="animation-delay: 0.1s">
          <div class="section-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="5" />
              <path
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
          </div>
          <div class="section-title">外观设置</div>
          <div class="setting-card">
            <div class="setting-item">
              <div class="item-left">
                <div class="item-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </div>
                <div class="item-info">
                  <div class="item-label">深色模式</div>
                  <div class="item-desc">使用深色主题保护眼睛</div>
                </div>
              </div>
              <div class="item-right">
                <div
                  class="toggle-switch"
                  :class="{ active: darkMode }"
                  @click="toggleDarkMode"
                >
                  <div class="toggle-slider"></div>
                </div>
              </div>
            </div>

            <div class="setting-item">
              <div class="item-left">
                <div class="item-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                </div>
                <div class="item-info">
                  <div class="item-label">主题颜色</div>
                  <div class="item-desc">选择你喜欢的主题色</div>
                </div>
              </div>
              <div class="item-right">
                <div class="color-options">
                  <div
                    v-for="color in themeColors"
                    :key="color.id"
                    class="color-option"
                    :class="{ active: selectedTheme === color.id }"
                    :style="{ background: color.gradient }"
                    @click="selectTheme(color.id)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="setting-section scale-in" style="animation-delay: 0.2s">
          <div class="section-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
          </div>
          <div class="section-title">播放设置</div>
          <div class="setting-card">
            <div class="setting-item">
              <div class="item-left">
                <div class="item-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                </div>
                <div class="item-info">
                  <div class="item-label">自动播放</div>
                  <div class="item-desc">列表播放完自动切换下一首</div>
                </div>
              </div>
              <div class="item-right">
                <div
                  class="toggle-switch"
                  :class="{ active: autoPlay }"
                  @click="toggleAutoPlay"
                >
                  <div class="toggle-slider"></div>
                </div>
              </div>
            </div>

            <div class="setting-item">
              <div class="item-left">
                <div class="item-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div class="item-info">
                  <div class="item-label">随机播放</div>
                  <div class="item-desc">随机顺序播放歌曲</div>
                </div>
              </div>
              <div class="item-right">
                <div
                  class="toggle-switch"
                  :class="{ active: shufflePlay }"
                  @click="toggleShufflePlay"
                >
                  <div class="toggle-slider"></div>
                </div>
              </div>
            </div>

            <div class="setting-item">
              <div class="item-left">
                <div class="item-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path
                      d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                    />
                  </svg>
                </div>
                <div class="item-info">
                  <div class="item-label">循环播放</div>
                  <div class="item-desc">单曲循环或列表循环</div>
                </div>
              </div>
              <div class="item-right">
                <select class="custom-select" v-model="loopMode">
                  <option value="none">关闭</option>
                  <option value="single">单曲循环</option>
                  <option value="list">列表循环</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="setting-section scale-in" style="animation-delay: 0.3s">
          <div class="section-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div class="section-title">账户设置</div>
          <div class="setting-card">
            <div class="setting-item">
              <div class="item-left">
                <div class="item-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                </div>
                <div class="item-info">
                  <div class="item-label">修改用户名</div>
                  <div class="item-desc">更改你的显示名称</div>
                </div>
              </div>
              <div class="item-right">
                <button class="btn-secondary">修改</button>
              </div>
            </div>

            <div class="setting-item">
              <div class="item-left">
                <div class="item-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div class="item-info">
                  <div class="item-label">修改密码</div>
                  <div class="item-desc">更新账户密码</div>
                </div>
              </div>
              <div class="item-right">
                <button class="btn-secondary">修改</button>
              </div>
            </div>

            <div class="setting-item danger">
              <div class="item-left">
                <div class="item-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    />
                  </svg>
                </div>
                <div class="item-info">
                  <div class="item-label">删除账户</div>
                  <div class="item-desc">永久删除你的账户和数据</div>
                </div>
              </div>
              <div class="item-right">
                <button class="btn-danger">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <music-player />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NavBar from "@/components/NavBar.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";

export default {
  name: "SettingPage",
  components: {
    NavBar,
    MusicPlayer,
  },
  data() {
    return {
      darkMode: true,
      autoPlay: true,
      shufflePlay: false,
      loopMode: "list",
    };
  },
  computed: {
    ...mapState(["user", "themeColor", "themeColors"]),
    selectedTheme() {
      return this.themeColor.id;
    },
  },
  methods: {
    ...mapMutations(["setThemeColor"]),
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    toggleAutoPlay() {
      this.autoPlay = !this.autoPlay;
    },
    toggleShufflePlay() {
      this.shufflePlay = !this.shufflePlay;
    },
    selectTheme(id) {
      const theme = this.themeColors.find((t) => t.id === id);
      if (theme) {
        this.setThemeColor(theme);
      }
    },
  },
};
</script>

<style scoped>
.setting-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}

.setting-container {
  flex: 1;
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.setting-header {
  text-align: center;
  margin-bottom: 50px;
}

.setting-header h1 {
  font-size: 42px;
  font-weight: 700;
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.setting-header p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.setting-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.setting-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.section-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.2) 0%,
    rgba(118, 75, 162, 0.2) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-primary);
}

.section-icon svg {
  width: 24px;
  height: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.setting-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.setting-item.danger:hover {
  background: rgba(238, 82, 83, 0.1);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.item-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.15) 0%,
    rgba(118, 75, 162, 0.15) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-primary);
}

.item-icon svg {
  width: 20px;
  height: 20px;
}

.setting-item.danger .item-icon {
  background: rgba(238, 82, 83, 0.15);
  color: #ee5253;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 16px;
  font-weight: 500;
  color: white;
}

.item-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.toggle-switch {
  width: 52px;
  height: 28px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.toggle-switch.active {
  background: var(--theme-gradient);
}

.toggle-slider {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-slider {
  left: 27px;
}

.color-options {
  display: flex;
  gap: 10px;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: white;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.custom-select {
  padding: 10px 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.custom-select:hover {
  background: rgba(255, 255, 255, 0.15);
}

.custom-select:focus {
  border-color: var(--theme-primary);
}

.custom-select option {
  background: #24243e;
  color: white;
}

.btn-secondary {
  padding: 10px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.btn-danger {
  padding: 10px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5253 100%);
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(238, 82, 83, 0.3);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(238, 82, 83, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.scale-in {
  animation: scaleIn 0.5s ease-out;
}

@media (max-width: 768px) {
  .setting-container {
    padding: 30px 15px;
  }

  .setting-header h1 {
    font-size: 32px;
  }

  .setting-header p {
    font-size: 14px;
  }

  .setting-item {
    padding: 16px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .item-right {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .setting-header h1 {
    font-size: 28px;
  }

  .section-title {
    font-size: 18px;
  }

  .item-label {
    font-size: 15px;
  }

  .item-desc {
    font-size: 12px;
  }
}
</style>
