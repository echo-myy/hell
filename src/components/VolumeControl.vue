<template>
  <div class="volume-control">
    <i class="icon" :class="volume > 0 ? 'icon-volume' : 'icon-mute'"></i>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      :value="volume"
      @input="handleVolumeChange"
    />
  </div>
</template>
<script>
export default {
  name: "VolumeControl",
  props: {
    volume: {
      type: Number,
      default: 0.7,
    },
  },
  methods: {
    handleVolumeChange(e) {
      this.$emit("update-volume", Number(e.target.value));
    },
  },
};
</script>
<style scoped>
.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 150px;
}
.icon {
  color: #666;
  font-size: 16px;
}
input[type="range"] {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #eee;
  border-radius: 2px;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #42b983;
  cursor: pointer;
}
</style>
