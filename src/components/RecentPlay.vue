<template>
  <div class="recent-play">
    <h3 class="section-title">最近播放</h3>
    <div class="recent-list" v-if="recentPlayList.length > 0">
      <div
        v-for="(item, index) in recentPlayList"
        :key="`${item.id}-${item.playTime}`"
        class="recent-item"
        @click="handlePlay(item)"
      >
        <span class="play-index">{{ index + 1 }}</span>
        <img :src="item.cover" alt="封面" class="recent-cover" />
        <div class="recent-info">
          <p class="recent-name">{{ item.name }}</p>
          <p class="recent-singer">{{ item.singer }}</p>
        </div>
        <span class="play-time">{{ formatPlayTime(item.playTime) }}</span>
      </div>
    </div>
    <div class="empty-tip" v-else>
      <p>暂无最近播放记录</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "RecentPlay",
  computed: {
    ...mapState(["recentPlayList"]),
  },
  methods: {
    ...mapMutations(["playMusic", "addRecentPlay"]),
    handlePlay(music) {
      this.playMusic(music);
      this.addRecentPlay(music);
    },
    formatPlayTime(timestamp) {
      const now = Date.now();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) {
        return "刚刚";
      } else if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else {
        return `${days}天前`;
      }
    },
  },
};
</script>

<style scoped>
.recent-play {
  padding: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.recent-item:hover {
  background-color: #f5f5f5;
}

.play-index {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-right: 10px;
}

.recent-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
}

.recent-info {
  flex: 1;
  min-width: 0;
}

.recent-name {
  font-size: 14px;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-singer {
  font-size: 12px;
  color: #999;
  margin: 4px 0 0;
}

.play-time {
  font-size: 12px;
  color: #ccc;
  margin-left: 10px;
}

.empty-tip {
  text-align: center;
  padding: 30px;
  color: #999;
}
</style>
