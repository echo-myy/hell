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
    ...mapMutations([
      "playMusic",
      "collectMusic",
      "cancelCollect",
      "addRecentPlay",
    ]),
    showControl() {
      this.isShowControl = true;
    },
    hideControl() {
      this.isShowControl = false;
    },
    handlePlay() {
      this.playMusic(this.music);
      this.addRecentPlay(this.music);
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
  width: 100%;
  max-width: 220px;
  margin: 8px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    rgba(30, 30, 40, 0.9),
    rgba(20, 20, 30, 0.95)
  );
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.music-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px var(--theme-gradient);
  border-color: var(--theme-primary);
}
.card-cover {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
}
.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.music-card:hover .card-cover img {
  transform: scale(1.1);
}
.play-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--theme-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5);
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8);
}
.music-card:hover .play-btn {
  opacity: 1;
  transform: scale(1);
}
.play-btn:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.7);
}
.card-info {
  padding: 16px;
  text-align: left;
}
.card-info h5 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-info p {
  margin: 0 0 14px;
  color: #a0a0b0;
  font-size: 14px;
}
.card-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}
.music-card:hover .card-actions {
  opacity: 1;
  transform: translateY(0);
}
.action-btn {
  flex: 1;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(
    145deg,
    rgba(60, 60, 80, 0.9),
    rgba(45, 45, 60, 0.9)
  );
  color: #e0e0e0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.action-btn:hover {
  background: var(--theme-gradient);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .music-card {
    max-width: 100%;
    margin: 4px;
    border-radius: 12px;
  }

  .card-cover {
    width: 100%;
    height: 140px;
  }

  .card-info {
    padding: 12px;
  }

  .card-info h5 {
    font-size: 14px;
    margin-bottom: 6px;
  }

  .card-info p {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .play-btn {
    width: 44px;
    height: 44px;
    bottom: 10px;
    right: 10px;
    font-size: 16px;
  }

  .action-btn {
    padding: 8px 10px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .music-card {
    border-radius: 10px;
  }

  .card-cover {
    height: 120px;
  }

  .card-info {
    padding: 10px;
  }

  .card-info h5 {
    font-size: 13px;
  }

  .card-info p {
    font-size: 11px;
  }

  .play-btn {
    width: 38px;
    height: 38px;
    font-size: 14px;
  }
}
</style>
