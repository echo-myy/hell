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
    <div class="side-title" style="margin-top: 30px">最近播放</div>
    <recent-play />
    <div class="side-title" style="margin-top: 30px">播放统计</div>
    <div class="stat-info">
      <p>
        总音乐数：<span>{{ musicCount }}</span>
      </p>
      <p>
        收藏数：<span>{{ collectCount }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RecentPlay from "./RecentPlay.vue";

export default {
  name: "SideBar",
  components: { RecentPlay },
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
  width: 220px;
  padding: 24px 16px 140px;
  background: linear-gradient(
    180deg,
    rgba(102, 126, 234, 0.15) 0%,
    rgba(118, 75, 162, 0.15) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  height: calc(100vh - 70px);
  position: sticky;
  top: 70px;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.side-bar::-webkit-scrollbar {
  width: 4px;
}

.side-bar::-webkit-scrollbar-track {
  background: transparent;
}

.side-bar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.side-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.side-menu {
  margin-bottom: 24px;
}

.menu-item {
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 10px;
  margin-bottom: 6px;
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.menu-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.menu-item:hover::before {
  transform: scaleY(1);
}

.menu-item.active {
  color: white;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.3) 0%,
    rgba(118, 75, 162, 0.3) 100%
  );
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.menu-item.active::before {
  transform: scaleY(1);
}

.stat-info {
  margin-top: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-info p {
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info p span {
  font-weight: 600;
  color: #667eea;
}

@media (max-width: 768px) {
  .side-bar {
    display: none;
  }
}
</style>
