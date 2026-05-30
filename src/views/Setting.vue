<template>
  <div class="setting-page">
    <nav-bar />
    <div class="recent-plays-content">
      <h2>最近播放</h2>

      <!-- 最近播放列表 -->
      <div class="recent-list">
        <!-- 播放记录项 -->
        <div class="recent-item">
          <img
            src="@/assets/covers/小半.jpg"
            alt="歌曲封面"
            class="recent-cover"
          />
          <div class="recent-info">
            <h4>小半</h4>
            <p>陈粒</p>
          </div>
          <div class="recent-time">今天 14:30</div>
          <button class="play-now">立即播放</button>
        </div>

        <div class="recent-item">
          <img
            src="@/assets/covers/江南.jpg"
            alt="歌曲封面"
            class="recent-cover"
          />
          <div class="recent-info">
            <h4>江南</h4>
            <p>林俊杰</p>
          </div>
          <div class="recent-time">昨天 20:15</div>
          <button class="play-now">立即播放</button>
        </div>

        <div class="recent-item">
          <img
            src="@/assets/covers/富士山下.jpg"
            alt="歌曲封面"
            class="recent-cover"
          />
          <div class="recent-info">
            <h4>富士山下</h4>
            <p>陈奕迅</p>
          </div>
          <div class="recent-time">昨天 16:40</div>
          <button class="play-now">立即播放</button>
        </div>

        <div class="recent-item">
          <img
            src="@/assets/covers/青花瓷.jpg"
            alt="歌曲封面"
            class="recent-cover"
          />
          <div class="recent-info">
            <h4>青花瓷</h4>
            <p>周杰伦</p>
          </div>
          <div class="recent-time">3天前</div>
          <button class="play-now">立即播放</button>
        </div>

        <div class="recent-item">
          <img
            src="@/assets/covers/喜欢你.jpg"
            alt="歌曲封面"
            class="recent-cover"
          />
          <div class="recent-info">
            <h4>喜欢你</h4>
            <p>邓紫棋</p>
          </div>
          <div class="recent-time">上周</div>
          <button class="play-now">立即播放</button>
        </div>
      </div>

      <!-- 空状态提示 (当没有播放记录时显示) -->
      <div class="empty-tip" v-if="false">暂无播放记录</div>
    </div>
    <music-player />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";

export default {
  name: "RecentPlays",
  components: {
    NavBar,
    MusicPlayer,
  },
};
</script>

<style scoped>
.setting-page {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.recent-plays-content {
  flex: 1;
  width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
}

.recent-plays-content h2 {
  text-align: left;
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
}

.recent-list {
  border-top: 1px solid #eee;
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  gap: 20px;
}

.recent-cover {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.recent-info {
  flex: 1;
  text-align: left;
}

.recent-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.recent-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.recent-time {
  width: 120px;
  color: #999;
  font-size: 14px;
}

.play-now {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.play-now:hover {
  background: #359469;
}

.empty-tip {
  text-align: center;
  color: #999;
  margin-top: 50px;
  font-size: 16px;
}
</style>
