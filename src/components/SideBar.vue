<template>
  <div class="side-bar">
    <div class="side-title">音乐分类</div>
    <div class="side-menu">
      <div
        class="menu-item"
        :class="{ active: currentType === 'all' }"
        @click="changeType('all')"
      >
        全部音乐
      </div>
      <div
        class="menu-item"
        :class="{ active: currentType === 'pop' }"
        @click="changeType('pop')"
      >
        流行音乐
      </div>
      <div
        class="menu-item"
        :class="{ active: currentType === 'rock' }"
        @click="changeType('rock')"
      >
        摇滚音乐
      </div>
      <div
        class="menu-item"
        :class="{ active: currentType === 'classic' }"
        @click="changeType('classic')"
      >
        古典音乐
      </div>
    </div>
    <div class="side-title" style="margin-top: 30px">播放统计</div>
    <div class="stat-info">
      <p>总音乐数：{{ musicCount }}</p>
      <p>收藏数：{{ collectCount }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SideBar",
  props: {
    currentType: {
      type: String,
      default: "all",
    },
  },
  computed: {
    ...mapState(["musicList", "collectList"]),
    musicCount() {
      return this.musicList.length;
    },
    collectCount() {
      return this.collectList.length;
    },
  },
  methods: {
    changeType(type) {
      this.$emit("change-type", type);
    },
  },
};
</script>

<style scoped>
.side-bar {
  width: 200px;
  padding: 20px;
  background: #f9f9f9;
  height: calc(100vh - 60px);
  position: sticky;
  top: 60px;
  overflow-y: auto;
}
.side-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}
.menu-item {
  padding: 10px 0;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}
.menu-item:hover,
.menu-item.active {
  color: #42b983;
}
.stat-info {
  margin-top: 10px;
}
.stat-info p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}
</style>
