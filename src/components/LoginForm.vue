<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>音乐平台登录</h2>
          <p>欢迎来到 MelodyVue</p>
        </div>
        <form @submit.prevent="handleLogin">
          <div class="form-item">
            <label>用户名：</label>
            <input
              type="text"
              v-model="username"
              required
              placeholder="请输入用户名"
              class="input-field"
            />
          </div>
          <div class="form-item">
            <label>密码：</label>
            <input
              type="password"
              v-model="password"
              required
              placeholder="请输入密码"
              class="input-field"
            />
          </div>
          <div class="error-tip" v-if="errorTip">{{ errorTip }}</div>
          <button type="submit" class="login-btn">登录</button>
        </form>
        <div class="login-tip">
          <p>默认账号：任意用户名</p>
          <p>默认密码：123456</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      errorTip: "",
    };
  },
  methods: {
    ...mapMutations(["login"]),
    handleLogin() {
      const fixedPassword = "123456";
      if (!this.username.trim()) {
        this.errorTip = "用户名不能为空！";
      } else if (!this.password) {
        this.errorTip = "密码不能为空！";
      } else if (this.password !== fixedPassword) {
        this.errorTip = "密码错误（默认：123456）";
      } else {
        this.login({
          username: this.username.trim(),
          password: this.password,
        });
        const redirectPath = this.$route.query.redirect || "/home";
        this.$router.push(redirectPath);
      }
      setTimeout(() => {
        this.errorTip = "";
      }, 2000);
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: #999;
}

.form-item {
  margin-bottom: 20px;
  text-align: left;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.input-field:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.input-field::placeholder {
  color: #bbb;
}

.error-tip {
  color: #ff4757;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #42b983 0%, #359469 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(66, 185, 131, 0.4);
}

.login-tip {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.login-tip p {
  font-size: 13px;
  color: #999;
  margin: 4px 0;
}

@media (max-width: 768px) {
  .login-card {
    padding: 30px 25px;
  }

  .login-header h2 {
    font-size: 24px;
  }

  .input-field {
    padding: 11px 14px;
    font-size: 15px;
  }

  .login-btn {
    padding: 13px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 15px;
  }

  .login-card {
    padding: 25px 20px;
  }

  .login-header h2 {
    font-size: 22px;
  }

  .login-header p {
    font-size: 13px;
  }

  .form-item {
    margin-bottom: 16px;
  }

  .input-field {
    padding: 10px 12px;
    font-size: 14px;
  }

  .login-btn {
    padding: 12px;
    font-size: 14px;
  }

  .login-tip p {
    font-size: 12px;
  }
}
</style>
