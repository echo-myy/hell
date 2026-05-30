<template>
  <form class="add-music-form" @submit.prevent="handleSubmit">
    <div class="form-item">
      <label>歌曲名称：</label>
      <input
        type="text"
        v-model="musicName"
        required
        placeholder="请输入歌曲名称"
      />
    </div>
    <div class="form-item">
      <label>歌手：</label>
      <input
        type="text"
        v-model="singer"
        required
        placeholder="请输入歌手名称"
      />
    </div>
    <div class="form-item">
      <label>音乐分类：</label>
      <select v-model="type" required>
        <option value="pop">流行</option>
        <option value="rock">摇滚</option>
        <option value="classic">古典</option>
      </select>
    </div>
    <div class="form-item">
      <label>封面图片：</label>
      <input type="file" accept="image/*" @change="handleCoverUpload" />
      <img :src="coverUrl" alt="预览" class="cover-preview" v-if="coverUrl" />
    </div>
    <div class="form-item">
      <label>音乐文件：</label>
      <input
        type="file"
        accept="audio/*"
        @change="handleMusicUpload"
        required
      />
    </div>
    <div class="form-btn">
      <AppButton type="success" @click="handleSubmit">提交</AppButton>
      <AppButton type="danger" @click="handleReset">重置</AppButton>
    </div>
  </form>
</template>

<script>
import AppButton from "./AppButton.vue";

export default {
  // 1. 修正组件名：移除多余空格 + 改为多单词规范名
  name: "AddMusicForm",
  // 2. 修正组件注册：只注册AppButton（删除不存在的Button）
  components: { AppButton },
  data() {
    return {
      musicName: "",
      singer: "",
      type: "pop",
      coverUrl: "",
      musicFile: null,
    };
  },
  methods: {
    // 封面上传预览
    handleCoverUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.coverUrl = URL.createObjectURL(file);
      }
    },
    // 音乐文件上传
    handleMusicUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.musicFile = file;
      }
    },
    // 提交表单
    handleSubmit() {
      if (!this.musicFile) {
        alert("请选择音乐文件！");
        return;
      }
      // 构建音乐数据（实际项目可上传服务器）
      const newMusic = {
        id: Date.now(), // 唯一ID
        name: this.musicName,
        singer: this.singer,
        type: this.type,
        cover: require("@/assets/covers/小半.jpg"),
        url: URL.createObjectURL(this.musicFile),
        duration: "0:00", // 实际可通过音频API获取
      };
      // 触发父组件添加音乐
      this.$emit("add-music", newMusic);
      this.handleReset();
    },
    // 重置表单
    handleReset() {
      this.musicName = "";
      this.singer = "";
      this.type = "pop";
      this.coverUrl = "";
      this.musicFile = null;
      // 重置文件输入框
      this.$el.querySelectorAll('input[type="file"]').forEach((input) => {
        input.value = "";
      });
    },
  },
};
</script>

<style scoped>
.add-music-form {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.form-item {
  margin: 15px 0;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}
input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.cover-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-top: 10px;
}
.form-btn {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
