<template>
  <div class="music-card" @mouseenter="showControl" @mouseleave="hideControl">
    <div class="card-cover">
      <img :src="music.cover" alt="封面" />
      <div class="play-btn" v-if="isShowControl" @click.stop="handlePlay">
        <i class="icon-play">▶</i>
      </div>
    </div>
    <div class="card-info">
      <h5>{{ music.name }}</h5>
      <p>{{ music.singer }}</p>
      <div class="card-actions" v-if="isShowControl">
        <button @click.stop="handleCollect" class="action-btn">
          {{ isCollected(music.id) ? "取消收藏" : "收藏" }}
        </button>
        <router-link :to="`/music-detail/${music.id}`" class="action-btn">
          详情
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "MusicCard",
  props: {
    music: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isShowControl: false,
    };
  },
  computed: {
    ...mapGetters(["isCollected"]),
  },
  methods: {
    ...mapMutations(["playMusic", "collectMusic", "cancelCollect"]),
    showControl() {
      this.isShowControl = true;
    },
    hideControl() {
      this.isShowControl = false;
    },
    handlePlay() {
      this.playMusic(this.music);
      this.$emit("play-music", this.music);
      // 只触发事件，不直接调用play()，交给MusicPlayer处理加载
      this.$root.$emit("play-music-from-card", this.music);
    },
    handleCollect() {
      this.isCollected(this.music.id)
        ? this.cancelCollect(this.music.id)
        : this.collectMusic(this.music);
    },
  },
};
</script>

<style scoped>
.music-card {
  width: 200px;
  margin: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
}
.music-card:hover {
  transform: translateY(-5px);
}
.card-cover {
  position: relative;
  width: 200px;
  height: 200px;
}
.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.play-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(66, 185, 131, 0.8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-info {
  padding: 10px;
  text-align: left;
}
.card-info h5 {
  margin: 0 0 5px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-info p {
  margin: 0 0 10px;
  color: #666;
  font-size: 14px;
}
.card-actions {
  display: flex;
  gap: 10px;
}
.action-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background: #f5f5f5;
  color: #333;
  cursor: pointer;
  font-size: 12px;
}
.action-btn:hover {
  background: #eee;
}
</style>
