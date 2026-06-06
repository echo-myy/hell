<template>
  <div class="search-wrapper">
    <div class="search-input-wrapper">
      <input
        v-model="searchKeyword"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        @focus="showHistory = true"
        @input="handleInput"
        @keydown.enter="handleSearch"
      />
      <button @click="handleSearch" class="search-btn">
        <span>🔍</span>
      </button>
    </div>

    <div
      class="search-dropdown"
      v-if="showHistory && searchKeyword === '' && searchHistory.length > 0"
    >
      <div class="dropdown-header">
        <span>搜索历史</span>
        <button @click="clearHistory" class="clear-btn">清空</button>
      </div>
      <div class="history-list">
        <div
          v-for="(item, index) in searchHistory"
          :key="index"
          class="history-item"
          @click="
            searchKeyword = item.keyword;
            handleSearch();
          "
        >
          <span class="history-icon">📝</span>
          <span class="history-keyword">{{ item.keyword }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

export default {
  name: "SearchBar",
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲或歌手...",
    },
  },
  data() {
    return {
      searchKeyword: "",
      showHistory: false,
      searchHistory: [],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  mounted() {
    this.fetchSearchHistory();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    async fetchSearchHistory() {
      if (!this.user.id) {
        const localHistory = localStorage.getItem("searchHistory");
        if (localHistory) {
          this.searchHistory = JSON.parse(localHistory).slice(0, 10);
        }
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE}/search/history/${this.user.id}`
        );
        this.searchHistory = response.data;
      } catch (error) {
        console.error("Failed to fetch search history:", error);
      }
    },
    async saveSearchHistory(keyword) {
      if (!keyword.trim()) return;

      if (!this.user.id) {
        let localHistory = JSON.parse(
          localStorage.getItem("searchHistory") || "[]"
        );
        const index = localHistory.findIndex(
          (item) => item.keyword === keyword
        );
        if (index > -1) {
          localHistory.splice(index, 1);
        }
        localHistory.unshift({ keyword, created_at: new Date().toISOString() });
        localHistory = localHistory.slice(0, 10);
        localStorage.setItem("searchHistory", JSON.stringify(localHistory));
        this.searchHistory = localHistory;
        return;
      }

      try {
        await axios.post(`${API_BASE}/search/history`, {
          user_id: this.user.id,
          keyword: keyword.trim(),
        });
        await this.fetchSearchHistory();
      } catch (error) {
        console.error("Failed to save search history:", error);
      }
    },
    async clearHistory() {
      if (!this.user.id) {
        localStorage.removeItem("searchHistory");
        this.searchHistory = [];
        return;
      }

      try {
        await axios.delete(`${API_BASE}/search/history/${this.user.id}`);
        this.searchHistory = [];
      } catch (error) {
        console.error("Failed to clear search history:", error);
      }
    },
    handleInput() {
      if (this.searchKeyword === "") {
        this.fetchSearchHistory();
      }
    },
    handleSearch() {
      const keyword = this.searchKeyword.trim();
      if (!keyword) return;

      this.saveSearchHistory(keyword);
      this.showHistory = false;
      this.$emit("search", keyword);
    },
    handleClickOutside(event) {
      if (!event.target.closest(".search-wrapper")) {
        this.showHistory = false;
      }
    },
  },
};
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 450px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 30px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-input-wrapper:focus-within {
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  border-color: var(--theme-primary);
  background: rgba(255, 255, 255, 0.15);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 15px;
  background: transparent;
  color: white;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-btn {
  background: var(--theme-gradient);
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 8px 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.search-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 100;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-header span {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.clear-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.history-list {
  max-height: 240px;
  overflow-y: auto;
}

.history-list::-webkit-scrollbar {
  width: 4px;
}

.history-list::-webkit-scrollbar-track {
  background: transparent;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.history-icon {
  margin-right: 12px;
  font-size: 16px;
  opacity: 0.6;
}

.history-keyword {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}
</style>
