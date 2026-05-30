import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 关键修改：从localStorage读取登录状态
    user: JSON.parse(localStorage.getItem("user")) || {
      isLogin: false,
      username: "",
      password: "123456",
    },
    playState: { currentMusic: null, isPlaying: false },
    currentTime: 0,
    volume: 0.7,
    musicList: [
      // 原有歌曲列表（保持不变）
      {
        id: 1,
        name: "小半",
        singer: "陈粒",
        cover: require("@/assets/covers/小半.jpg"),
        url: require("@/assets/musics/小半.mp3"),
        duration: "4:57",
        type: "pop",
      },
      {
        id: 2,
        name: "江南",
        singer: "林俊杰",
        cover: require("@/assets/covers/江南.jpg"),
        url: require("@/assets/musics/江南.mp3"),
        duration: "4:27",
        type: "pop",
      },
      {
        id: 3,
        name: "富士山下",
        singer: "陈奕迅",
        cover: require("@/assets/covers/富士山下.jpg"),
        url: require("@/assets/musics/富士山下.mp3"),
        duration: "4:18",
        type: "pop",
      },
      {
        id: 4,
        name: "关键词",
        singer: "林俊杰",
        cover: require("@/assets/covers/关键词.jpg"),
        url: require("@/assets/musics/关键词.mp3"),
        duration: "3:30",
        type: "pop",
      },
      {
        id: 5,
        name: "葡萄成熟时",
        singer: "陈奕迅",
        cover: require("@/assets/covers/葡萄成熟时.jpg"),
        url: require("@/assets/musics/葡萄成熟时.mp3"),
        duration: "4:39",
        type: "pop",
      },
      {
        id: 6,
        name: "青花瓷",
        singer: "周杰伦",
        cover: require("@/assets/covers/青花瓷.jpg"),
        url: require("@/assets/musics/青花瓷.mp3"),
        duration: "3:59",
        type: "pop",
      },
      {
        id: 7,
        name: "喜欢你",
        singer: "邓紫棋",
        cover: require("@/assets/covers/喜欢你.jpg"),
        url: require("@/assets/musics/喜欢你.mp3"),
        duration: "3:59",
        type: "pop",
      },
      {
        id: 8,
        name: "反方向的钟",
        singer: "周杰伦",
        cover: require("@/assets/covers/反方向的钟.jpg"),
        url: require("@/assets/musics/反方向的钟.mp3"),
        duration: "4:18",
        type: "pop",
      },
      {
        id: 9,
        name: "句号",
        singer: "邓紫棋",
        cover: require("@/assets/covers/句号.jpg"),
        url: require("@/assets/musics/句号.mp3"),
        duration: "3:55",
        type: "pop",
      },
      {
        id: 10,
        name: "晴天",
        singer: "周杰伦",
        cover: require("@/assets/covers/晴天.jpg"),
        url: require("@/assets/musics/晴天.mp3"),
        duration: "4:29",
        type: "pop",
      },
      {
        id: 11,
        name: "唯一",
        singer: "邓紫棋",
        cover: require("@/assets/covers/唯一.jpg"),
        url: require("@/assets/musics/唯一.mp3"),
        duration: "4:13",
        type: "pop",
      },
      {
        id: 12,
        name: "再见",
        singer: "邓紫棋",
        cover: require("@/assets/covers/再见.jpg"),
        url: require("@/assets/musics/再见.mp3"),
        duration: "3:26",
        type: "pop",
      },
      {
        id: 13,
        name: "十面埋伏",
        singer: "群星",
        cover: require("@/assets/covers/十面埋伏.jpg"),
        url: require("@/assets/musics/十面埋伏.mp3"),
        duration: "4:20",
        type: "classic",
      },
      {
        id: 14,
        name: "卡农",
        singer: "卡农",
        cover: require("@/assets/covers/卡农.jpg"),
        url: require("@/assets/musics/卡农.mp3"),
        duration: "3:59",
        type: "classic",
      },
      {
        id: 15,
        name: "命运交响曲",
        singer: "贝多芬",
        cover: require("@/assets/covers/命运交响曲.jpg"),
        url: require("@/assets/musics/命运交响曲.mp3"),
        duration: "5:57",
        type: "classic",
      },
      {
        id: 16,
        name: "baby",
        singer: "贾斯汀比伯",
        cover: require("@/assets/covers/baby.jpg"),
        url: require("@/assets/musics/baby.mp3"),
        duration: "3:59",
        type: "rock",
      },
      {
        id: 17,
        name: "wake",
        singer: "Hillong Young",
        cover: require("@/assets/covers/wake.jpg"),
        url: require("@/assets/musics/wake.mp3"),
        duration: "3:59",
        type: "rock",
      },
      {
        id: 18,
        name: "Die For You",
        singer: "VALORANT",
        cover: require("@/assets/covers/Die For You.jpg"),
        url: require("@/assets/musics/Die For You.mp3"),
        duration: "4:20",
        type: "rock",
      },
    ],
    // 已修改：从localStorage读取收藏列表
    collectList: JSON.parse(localStorage.getItem("collectList")) || [],
  },
  mutations: {
    // 关键修改：登录时同步到localStorage
    login(state, username) {
      state.user = {
        isLogin: true,
        username: username,
        password: state.user.password,
      };
      // 新增：持久化登录状态
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    // 关键修改：登出时同步到localStorage
    logout(state) {
      state.user = {
        isLogin: false,
        username: "",
        password: state.user.password,
      };
      // 新增：清空登录状态
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    // 新增：更新密码时同步到localStorage
    updatePassword(state, newPwd) {
      state.user.password = newPwd;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    playMusic(state, music) {
      state.playState.currentMusic = music;
      state.playState.isPlaying = true;
    },
    pauseMusic(state) {
      state.playState.isPlaying = false;
    },
    updateCurrentTime(state, time) {
      state.currentTime = time;
    },
    setVolume(state, volume) {
      state.volume = volume;
    },
    addMusic(state, music) {
      state.musicList.push({ ...music, id: Date.now() });
    },
    // 已修改：收藏时同步到localStorage
    collectMusic(state, music) {
      if (!state.collectList.some((item) => item.id === music.id)) {
        state.collectList.push(music);
        localStorage.setItem("collectList", JSON.stringify(state.collectList));
      }
    },
    // 已修改：取消收藏时同步到localStorage
    cancelCollect(state, id) {
      state.collectList = state.collectList.filter((item) => item.id !== id);
      localStorage.setItem("collectList", JSON.stringify(state.collectList));
    },
    deleteMusic(state, id) {
      state.musicList = state.musicList.filter((item) => item.id !== id);
    },
  },
  getters: {
    isCollected: (state) => (id) => {
      return state.collectList.some((item) => item.id === id);
    },
  },
  modules: {},
});
