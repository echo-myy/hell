<template>
  <div class="login-page">
    <auth-form />
  </div>
</template>

<script>
import AuthForm from "@/components/AuthForm.vue";

export default {
  name: "LoginPage",
  components: { AuthForm },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
}
</style>
