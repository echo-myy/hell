<template>
  <div class="auth-page">
    <!-- 动态背景 -->
    <div class="bg-animation">
      <div class="bg-orb bg-orb-1"></div>
      <div class="bg-orb bg-orb-2"></div>
      <div class="bg-orb bg-orb-3"></div>
    </div>

    <div class="auth-container">
      <div class="auth-card">
        <div class="music-icon">🎵</div>
        <div class="auth-header">
          <h1 class="auth-title">MelodyVue</h1>
          <p class="auth-subtitle">
            {{
              isRegisterMode
                ? "创建账号，开始你的音乐之旅"
                : "欢迎回来，沉浸在音乐世界"
            }}
          </p>
        </div>

        <form @submit.prevent="isRegisterMode ? handleRegister : handleLogin">
          <div class="form-item">
            <label>用户名</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                type="text"
                v-model="formData.username"
                required
                placeholder="输入用户名"
                class="input-field"
              />
            </div>
          </div>

          <div class="form-item" v-if="isRegisterMode">
            <label>邮箱</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input
                type="email"
                v-model="formData.email"
                required
                placeholder="输入邮箱"
                class="input-field"
              />
            </div>
          </div>

          <div class="form-item">
            <label>密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                type="password"
                v-model="formData.password"
                required
                placeholder="输入密码"
                class="input-field"
              />
            </div>
          </div>

          <div class="form-item" v-if="isRegisterMode">
            <label>确认密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔐</span>
              <input
                type="password"
                v-model="formData.confirmPassword"
                required
                placeholder="再次输入密码"
                class="input-field"
              />
            </div>
          </div>

          <div class="error-tip" v-if="errorTip">{{ errorTip }}</div>

          <button type="submit" class="auth-btn">
            <span class="btn-text">{{
              isRegisterMode ? "立即注册" : "登录"
            }}</span>
            <span class="btn-icon">{{ isRegisterMode ? "✨" : "🎶" }}</span>
          </button>

          <div class="test-button-container">
            <button type="button" @click="testLogin" class="test-btn">
              🧪 快速体验
            </button>
          </div>
        </form>

        <div class="auth-switch">
          <p>
            {{ isRegisterMode ? "已有账号？" : "还没有账号？" }}
            <button @click="toggleMode" class="switch-btn">
              {{ isRegisterMode ? "立即登录" : "立即注册" }}
            </button>
          </p>
        </div>

        <div class="demo-tip" v-if="!isRegisterMode">
          <p class="demo-title">🎁 演示账号</p>
          <p class="demo-info">用户名: demo</p>
          <p class="demo-info">密码: 123456</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

function getErrorMessage(error) {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message.includes("Network Error")) {
    return "网络连接失败，请检查后端服务器是否运行";
  }
  return "操作失败";
}

export default {
  name: "AuthForm",
  data() {
    return {
      isRegisterMode: false,
      errorTip: "",
      formData: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    toggleMode() {
      this.isRegisterMode = !this.isRegisterMode;
      this.errorTip = "";
      this.formData = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
    },
    testLogin() {
      console.log("🧪 Test login clicked!");
      alert("测试按钮被点击了！");

      // 直接使用演示账号
      const userData = {
        id: 2,
        username: "demo",
        email: "demo@example.com",
        isLogin: true,
      };

      console.log("User data:", userData);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("Saved to localStorage");

      this.$store.commit("login", userData);
      console.log("Store committed");
      console.log("Store state:", this.$store.state.user);

      alert("登录成功！正在跳转...");

      this.$router.push("/home");
    },
    async handleRegister() {
      if (!this.formData.username.trim()) {
        this.errorTip = "用户名不能为空！";
        return;
      }
      if (!this.formData.email) {
        this.errorTip = "邮箱不能为空！";
        return;
      }
      if (!this.formData.password) {
        this.errorTip = "密码不能为空！";
        return;
      }
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorTip = "两次输入的密码不一致！";
        return;
      }

      try {
        const response = await axios.post(`${API_BASE}/users/register`, {
          username: this.formData.username.trim(),
          password: this.formData.password,
          email: this.formData.email,
        });

        alert(`注册成功！用户名：${response.data.username}\n\n请登录您的账号`);
        this.toggleMode();
      } catch (error) {
        console.error("Register error:", error);
        this.errorTip = getErrorMessage(error);
      }
    },
    async handleLogin() {
      if (!this.formData.username.trim()) {
        this.errorTip = "用户名不能为空！";
        return;
      }
      if (!this.formData.password) {
        this.errorTip = "密码不能为空！";
        return;
      }

      try {
        console.log("Attempting login with:", {
          username: this.formData.username.trim(),
        });
        const response = await axios.post(`${API_BASE}/users/login`, {
          username: this.formData.username.trim(),
          password: this.formData.password,
        });

        console.log("Login response:", response.data);

        const userData = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          isLogin: true,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        console.log("Saved to localStorage:", userData);

        this.$store.commit("login", userData);
        console.log("Store state after login:", this.$store.state.user);

        const redirectPath = this.$route.query.redirect || "/home";
        console.log("Redirecting to:", redirectPath);
        this.$router.push(redirectPath);
      } catch (error) {
        console.error("Login error:", error);
        this.errorTip = getErrorMessage(error);
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

/* 动态背景效果 */
.bg-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

.bg-orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.bg-orb-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -150px;
  right: -100px;
  animation-delay: -5s;
}

.bg-orb-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(50px, -50px) scale(1.1);
  }
  50% {
    transform: translate(0, -100px) scale(0.9);
  }
  75% {
    transform: translate(-50px, -50px) scale(1.05);
  }
}

.auth-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 480px;
  padding: 20px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 50px 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.music-icon {
  text-align: center;
  font-size: 60px;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 35px;
}

.auth-title {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  letter-spacing: -1px;
}

.auth-subtitle {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 18px;
  pointer-events: none;
  z-index: 1;
}

.input-field {
  width: 100%;
  padding: 14px 16px 14px 50px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  outline: none;
  background: #fff;
}

.input-field:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.input-field::placeholder {
  color: #bbb;
}

.error-tip {
  color: #ff4757;
  font-size: 13px;
  margin-bottom: 20px;
  text-align: center;
  padding: 12px;
  background: rgba(255, 71, 87, 0.1);
  border-radius: 8px;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.auth-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 17px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.auth-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.auth-btn:active {
  transform: translateY(-1px);
}

.btn-text {
  letter-spacing: 2px;
}

.btn-icon {
  font-size: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.test-button-container {
  margin-top: 15px;
}

.test-btn {
  width: 100%;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.test-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.auth-switch {
  text-align: center;
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.auth-switch p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.switch-btn {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 700;
  cursor: pointer;
  font-size: 15px;
  margin-left: 5px;
  transition: color 0.3s;
}

.switch-btn:hover {
  color: #764ba2;
  text-decoration: underline;
}

.demo-tip {
  margin-top: 25px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.demo-title {
  font-size: 15px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 10px !important;
  margin: 0 0 10px 0;
}

.demo-info {
  font-size: 13px;
  color: #666;
  margin: 6px 0 !important;
  font-family: "Courier New", monospace;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auth-card {
    padding: 40px 30px;
  }

  .auth-title {
    font-size: 36px;
  }

  .music-icon {
    font-size: 50px;
  }

  .input-field {
    padding: 13px 14px 13px 48px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 15px;
  }

  .auth-container {
    padding: 10px;
  }

  .auth-card {
    padding: 35px 25px;
  }

  .auth-title {
    font-size: 30px;
  }

  .auth-subtitle {
    font-size: 13px;
  }

  .form-item {
    margin-bottom: 18px;
  }

  .input-field {
    padding: 12px 12px 12px 44px;
    font-size: 14px;
  }

  .input-icon {
    left: 14px;
    font-size: 16px;
  }

  .auth-btn {
    padding: 14px;
    font-size: 15px;
  }

  .music-icon {
    font-size: 45px;
  }
}
</style>
