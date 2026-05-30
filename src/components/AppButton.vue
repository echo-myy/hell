<template>
  <button
    class="custom-btn"
    :class="{
      'btn-primary': type === 'primary',
      'btn-success': type === 'success',
      'btn-danger': type === 'danger',
      'btn-disabled': disabled,
    }"
    @click="handleClick"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "AppButton",
  props: {
    type: {
      type: String,
      default: "primary",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
.custom-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  border: none;
  transition: background 0.3s;
}
.btn-primary {
  background: #4299e1;
  color: white;
}
.btn-primary:hover {
  background: #3182ce;
}
.btn-success {
  background: #42b983;
  color: white;
}
.btn-success:hover {
  background: #359469;
}
.btn-danger {
  background: #ff4d4f;
  color: white;
}
.btn-danger:hover {
  background: #e53e3e;
}
.btn-disabled {
  background: #ccc !important;
  cursor: not-allowed !important;
}
</style>
