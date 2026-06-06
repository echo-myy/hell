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
  padding: 10px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}
.btn-success {
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}
.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.5);
}
.btn-danger {
  background: linear-gradient(
    135deg,
    rgba(255, 107, 107, 1) 0%,
    rgba(238, 82, 83, 1) 100%
  );
  color: white;
  box-shadow: 0 4px 12px rgba(238, 82, 83, 0.3);
}
.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(238, 82, 83, 0.5);
}
.btn-disabled {
  background: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.3) !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  transform: none !important;
}
</style>
