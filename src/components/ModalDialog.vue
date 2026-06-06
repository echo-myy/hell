<template>
  <div class="modal-mask" v-if="visible" @click="handleMaskClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer" v-if="showFooter">
        <AppButton type="primary" @click="handleConfirm">确认</AppButton>
        <AppButton type="danger" @click="handleClose" style="margin-left: 10px">
          取消
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from "./AppButton.vue";

export default {
  name: "ModalDialog",
  components: { AppButton },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "提示",
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    handleConfirm() {
      this.$emit("confirm");
      this.$emit("update:visible", false);
    },
    handleMaskClick() {
      this.handleClose();
    },
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  width: 450px;
  background: linear-gradient(
    135deg,
    rgba(26, 26, 46, 0.98) 0%,
    rgba(22, 33, 62, 0.98) 100%
  );
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.close-btn {
  border: none;
  background: rgba(255, 255, 255, 0.05);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 22px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: right;
}
</style>
