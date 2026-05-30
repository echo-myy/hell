<template>
  <div class="login-form">
    <h2>音乐平台登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-item">
        <label>用户名：</label>
        <input
          type="text"
          v-model="username"
          required
          placeholder="请输入用户名"
        />
      </div>
      <div class="form-item">
        <label>密码：</label>
        <input
          type="password"
          v-model="password"
          required
          placeholder="默认密码：123456"
        />
      </div>
      <div class="error-tip" v-if="errorTip">{{ errorTip }}</div>
      <button type="submit" class="login-btn">登录</button>
    </form>
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
      const fixedPassword = "123456"; // 唯一登录密码
      if (!this.username) {
        this.errorTip = "用户名不能为空！";
      } else if (this.password !== fixedPassword) {
        this.errorTip = "密码错误（默认：123456）";
      } else {
        this.login(this.username);
        this.$router.push("/home");
      }
      setTimeout(() => {
        this.errorTip = "";
      }, 2000);
    },
  },
};
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.form-item {
  margin: 15px 0;
  text-align: left;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.login-btn {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
.login-btn:hover {
  background: #359469;
}
.error-tip {
  color: red;
  font-size: 14px;
  margin: 10px 0;
}
</style>
