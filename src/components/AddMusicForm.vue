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
      <div class="upload-area">
        <input
          type="file"
          accept="image/*"
          @change="handleCoverUpload"
          id="cover-upload"
          class="file-input"
        />
        <label for="cover-upload" class="upload-label">
          <span class="upload-icon">📷</span>
          <span class="upload-text">选择封面图片</span>
        </label>
        <div class="cover-preview" v-if="coverUrl">
          <img :src="coverUrl" alt="封面预览" />
          <button @click="clearCover" class="clear-btn">×</button>
        </div>
      </div>
    </div>
    <div class="form-item">
      <label>音乐文件：</label>
      <div class="upload-area">
        <input
          type="file"
          accept="audio/*"
          @change="handleMusicUpload"
          id="music-upload"
          class="file-input"
          required
        />
        <label for="music-upload" class="upload-label">
          <span class="upload-icon">🎵</span>
          <span class="upload-text">{{ musicFileName || "选择音乐文件" }}</span>
        </label>
      </div>
    </div>
    <div class="form-item">
      <label>歌词文件（可选）：</label>
      <div class="upload-area">
        <input
          type="file"
          accept=".txt,.lrc"
          @change="handleLyricsUpload"
          id="lyrics-upload"
          class="file-input"
        />
        <label for="lyrics-upload" class="upload-label">
          <span class="upload-icon">📝</span>
          <span class="upload-text">{{
            lyricsFileName || "选择歌词文件"
          }}</span>
        </label>
        <div class="lyrics-preview" v-if="lyricsPreview">
          <p class="lyrics-count">{{ lyrics.length }} 行歌词</p>
          <div class="lyrics-text">{{ lyricsPreview }}</div>
        </div>
      </div>
    </div>
    <div class="form-btn">
      <button type="submit" class="submit-btn">提交</button>
      <button type="button" @click="handleReset" class="reset-btn">重置</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "AddMusicForm",
  data() {
    return {
      musicName: "",
      singer: "",
      type: "pop",
      coverUrl: "",
      musicFile: null,
      musicFileName: "",
      lyrics: [],
      lyricsFileName: "",
      lyricsPreview: "",
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
    // 清除封面
    clearCover() {
      this.coverUrl = "";
      const input = document.getElementById("cover-upload");
      if (input) input.value = "";
    },
    // 音乐文件上传
    handleMusicUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.musicFile = file;
        this.musicFileName = file.name;
      }
    },
    // 歌词文件上传
    handleLyricsUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.lyricsFileName = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          this.parseLyrics(content);
        };
        reader.readAsText(file);
      }
    },
    // 解析歌词（支持LRC格式和纯文本）
    parseLyrics(content) {
      const lines = content.split("\n").filter((line) => line.trim());
      this.lyrics = [];

      // 检查是否是LRC格式（包含时间标签）
      const isLRC = lines.some((line) => /\[\d{2}:\d{2}/.test(line));

      if (isLRC) {
        // LRC格式解析
        lines.forEach((line) => {
          const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
          if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const time = minutes * 60 + seconds;
            const text = match[4].trim();
            if (text) {
              this.lyrics.push({ time, text });
            }
          }
        });
      } else {
        // 纯文本格式，每5秒一行
        lines.forEach((line, index) => {
          const text = line.trim();
          if (text) {
            this.lyrics.push({ time: index * 5, text });
          }
        });
      }

      // 生成预览（显示前5行）
      this.lyricsPreview = this.lyrics
        .slice(0, 5)
        .map((l) => l.text)
        .join("\n");
    },
    // 获取表单数据
    getFormData() {
      if (!this.musicFile) {
        return null;
      }
      if (!this.musicName || !this.singer) {
        alert("请填写歌曲名称和歌手！");
        return null;
      }
      return {
        id: Date.now(),
        name: this.musicName,
        singer: this.singer,
        type: this.type,
        cover: this.coverUrl || require("@/assets/covers/小半.jpg"),
        url: URL.createObjectURL(this.musicFile),
        duration: "0:00",
        lyrics: this.lyrics,
      };
    },
    // 提交表单
    handleSubmit() {
      const newMusic = this.getFormData();
      if (!newMusic) {
        alert("请选择音乐文件！");
        return;
      }
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
      this.musicFileName = "";
      this.lyrics = [];
      this.lyricsFileName = "";
      this.lyricsPreview = "";
      // 重置文件输入框
      const fileInputs = this.$el.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        input.value = "";
      });
    },
  },
};
</script>

<style scoped>
.add-music-form {
  width: 100%;
  margin: 0 auto;
  padding: 0;
}

.form-item {
  margin: 20px 0;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 14px;
}

input,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

input:focus,
select:focus {
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

select option {
  background: #1a1a2e;
  color: white;
}

.upload-area {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 20px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-label:hover {
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(102, 126, 234, 0.1);
}

.upload-icon {
  font-size: 24px;
}

.upload-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
}

.cover-preview {
  position: relative;
  margin-top: 16px;
  display: inline-block;
}

.cover-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.clear-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(238, 82, 83, 0.9);
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(238, 82, 83, 1);
  transform: scale(1.1);
}

.lyrics-preview {
  margin-top: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lyrics-count {
  color: rgba(102, 126, 234, 0.9);
  font-size: 12px;
  margin: 0 0 12px;
  font-weight: 600;
}

.lyrics-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.form-btn {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.submit-btn,
.reset-btn {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 480px) {
  .form-btn {
    flex-direction: column;
  }

  .submit-btn,
  .reset-btn {
    width: 100%;
  }
}
</style>
