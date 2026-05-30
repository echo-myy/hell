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
      <div class="modal-footer">
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-container {
  width: 400px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}
.modal-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-title {
  margin: 0;
  font-size: 18px;
}
.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}
.modal-body {
  padding: 20px;
}
.modal-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  text-align: right;
}
</style>
