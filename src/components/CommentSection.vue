<template>
  <div class="comment-section">
    <h3 class="section-title">评论区</h3>

    <div class="comment-input">
      <textarea
        v-model="newComment"
        placeholder="写下你的评论..."
        class="comment-textarea"
        @keydown.enter.ctrl="submitComment"
      ></textarea>
      <button @click="submitComment" class="submit-btn">发表</button>
    </div>

    <div class="comment-list" v-if="comments.length > 0">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="comment-avatar">{{ comment.username.charAt(0) }}</span>
          <div class="comment-info">
            <span class="comment-username">{{ comment.username }}</span>
            <span class="comment-time">{{
              formatTime(comment.created_at)
            }}</span>
          </div>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
      </div>
    </div>

    <div class="empty-tip" v-else>
      <p>暂无评论，快来发表第一条评论吧！</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

export default {
  name: "CommentSection",
  props: {
    musicId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      newComment: "",
      comments: [],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  mounted() {
    this.fetchComments();
  },
  methods: {
    async fetchComments() {
      try {
        const response = await axios.get(
          `${API_BASE}/comments/${this.musicId}`
        );
        this.comments = response.data;
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) {
        return;
      }

      if (!this.user.id) {
        alert("请先登录");
        return;
      }

      try {
        const response = await axios.post(`${API_BASE}/comments`, {
          music_id: this.musicId,
          user_id: this.user.id,
          content: this.newComment.trim(),
        });

        this.comments.unshift(response.data);
        this.newComment = "";
      } catch (error) {
        console.error("Failed to add comment:", error);
        alert("发表评论失败");
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);

      if (minutes < 1) {
        return "刚刚";
      } else if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hoursStr = date.getHours().toString().padStart(2, "0");
        const minutesStr = date.getMinutes().toString().padStart(2, "0");
        return `${month}月${day}日 ${hoursStr}:${minutesStr}`;
      }
    },
  },
};
</script>

<style scoped>
.comment-section {
  padding: 24px;
  background: linear-gradient(
    135deg,
    rgba(20, 20, 30, 0.95) 0%,
    rgba(30, 30, 45, 0.95) 100%
  );
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
}

.comment-input {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.comment-textarea {
  flex: 1;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  resize: none;
  font-size: 15px;
  min-height: 80px;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
  backdrop-filter: blur(10px);
}

.comment-textarea:focus {
  border-color: rgba(102, 126, 234, 0.6);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.comment-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.submit-btn {
  padding: 16px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.submit-btn:active {
  transform: translateY(0);
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.04) 100%
  );
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.comment-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(102, 126, 234, 0.3);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.comment-avatar {
  width: 44px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 700;
  margin-right: 14px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.comment-info {
  display: flex;
  flex-direction: column;
}

.comment-username {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
}

.comment-time {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
}

.comment-content {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  margin: 0;
  word-break: break-word;
}

.empty-tip {
  text-align: center;
  padding: 60px 40px;
  color: rgba(255, 255, 255, 0.5);
}

.empty-tip p {
  margin: 0;
  font-size: 15px;
}

@media (max-width: 768px) {
  .comment-input {
    flex-direction: column;
  }

  .submit-btn {
    align-self: flex-end;
  }
}
</style>
