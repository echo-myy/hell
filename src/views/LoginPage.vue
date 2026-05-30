<template>
  <div class="login-page">
    <login-form />
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";

export default {
  name: "LoginPage",
  components: { LoginForm },
};
</script>

<style scoped>
.login-page {
  background: #f5f5f5;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
