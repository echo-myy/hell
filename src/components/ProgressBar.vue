<template>
  <div class="progress-bar">
    <span class="time">{{ formatTime(currentTime) }}</span>
    <div class="progress-container" ref="container" @click="handleClick">
      <div class="progress-bg"></div>
      <div
        class="progress-fill"
        :style="{ width: `${(currentTime / duration) * 100}%` }"
      ></div>
      <div
        class="progress-dot"
        :style="{ left: `${(currentTime / duration) * 100}%` }"
        @mousedown.prevent="handleDragStart"
      ></div>
    </div>
    <span class="time">{{ formatTime(duration) }}</span>
  </div>
</template>

<script>
export default {
  props: {
    currentTime: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isDragging: false,
    };
  },
  created() {
    // 监听鼠标事件处理拖动
    document.addEventListener("mousemove", this.handleDragMove);
    document.addEventListener("mouseup", this.handleDragEnd);
  },
  beforeDestroy() {
    document.removeEventListener("mousemove", this.handleDragMove);
    document.removeEventListener("mouseup", this.handleDragEnd);
  },
  methods: {
    // 格式化时间为 分:秒 格式
    formatTime(seconds) {
      if (isNaN(seconds)) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? "0" + secs : secs}`;
    },
    // 点击进度条
    handleClick(e) {
      const containerWidth = this.$refs.container.offsetWidth;
      const clickPosition = e.offsetX;
      const percent = clickPosition / containerWidth;
      const newTime = percent * this.duration;
      this.$emit("update-time", newTime);
    },
    // 开始拖动
    handleDragStart() {
      this.isDragging = true;
      this.$emit("drag-start"); // 通知父组件开始拖动
    },
    // 拖动中
    handleDragMove(e) {
      if (!this.isDragging) return;
      const container = this.$refs.container;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const clientX = e.clientX - containerRect.left;

      let percent = clientX / containerWidth;
      percent = Math.max(0, Math.min(1, percent)); // 限制在0-1之间

      const newTime = percent * this.duration;
      this.$emit("update-time", newTime);
    },
    // 结束拖动
    handleDragEnd() {
      this.isDragging = false;
      this.$emit("drag-end"); // 通知父组件结束拖动
    },
  },
};
</script>

<style scoped>
.progress-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.time {
  font-size: 12px;
  color: #666;
  width: 50px;
  text-align: center;
}
.progress-container {
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
}
.progress-bg {
  width: 100%;
  height: 100%;
  background: #eee;
  border-radius: 3px;
}
.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #42b983;
  border-radius: 3px;
}
.progress-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: #42b983;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
