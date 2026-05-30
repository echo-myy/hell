<template>
  <div class="home-container">
    <nav-bar></nav-bar>
    <div class="main-content">
      <side-bar @change-type="handleChangeType"></side-bar>
      <div class="content-right">
        <!-- 修复 v-model:search 错误，改为 Vue2 兼容写法 -->
        <search-input
          :value="searchVal"
          @input="searchVal = $event"
          @search="handleSearch"
        />
        <div class="music-list">
          <div
            class="music-item"
            v-for="music in filteredMusicList"
            :key="music.id"
          >
            <music-card :music="music" @play="handlePlayMusic"></music-card>
          </div>
        </div>
        <button @click="showAddModal = true">添加音乐</button>
        <modal-dialog
          v-model="showAddModal"
          title="添加新音乐"
          @confirm="handleAddMusic"
        >
          <add-music-form ref="addMusicForm"></add-music-form>
        </modal-dialog>
      </div>
    </div>
    <music-player></music-player>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";
import SearchInput from "@/components/SearchInput.vue";
import MusicCard from "@/components/MusicCard.vue";
import ModalDialog from "@/components/ModalDialog.vue";
import AddMusicForm from "@/components/AddMusicForm.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";

export default {
  name: "HomePage", // 修复组件名单单词错误（改为 HomePage）
  components: {
    NavBar,
    SideBar,
    SearchInput,
    MusicCard,
    ModalDialog,
    AddMusicForm,
    MusicPlayer,
  },
  data() {
    return {
      currentType: "all", // 默认为全部类型
      searchVal: "", // 搜索关键词
      showAddModal: false, // 控制添加音乐弹窗显示
    };
  },
  computed: {
    ...mapState(["musicList"]),
    // 过滤音乐列表（类型 + 搜索）
    filteredMusicList() {
      return this.musicList.filter((music) => {
        // 类型过滤
        const typeMatch =
          this.currentType === "all" || music.type === this.currentType;
        // 搜索过滤
        const searchMatch =
          music.name.includes(this.searchVal) ||
          music.singer.includes(this.searchVal);
        return typeMatch && searchMatch;
      });
    },
  },
  methods: {
    // 切换音乐类型
    handleChangeType(type) {
      this.currentType = type;
    },
    // 搜索触发
    handleSearch(val) {
      this.searchVal = val;
    },
    // 播放音乐
    handlePlayMusic(music) {
      this.$store.commit("playMusic", music);
    },
    // 添加音乐确认
    handleAddMusic() {
      const newMusic = this.$refs.addMusicForm.getFormData();
      if (newMusic) {
        this.$store.commit("addMusic", newMusic);
        this.showAddModal = false;
        // 重置表单
        this.$refs.addMusicForm.resetForm();
      }
    },
  },
};
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  display: flex;
  flex: 1;
  padding: 20px;
}
.content-right {
  flex: 1;
  margin-left: 20px;
}
.music-list {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
</style>
