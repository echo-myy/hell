<template>
  <div class="search-input">
    <input
      type="text"
      v-model="searchVal"
      placeholder="搜索歌曲/歌手..."
      @input="handleSearch"
    />
    <button @click="handleClear" class="clear-btn" v-if="searchVal">×</button>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  data() {
    return {
      searchVal: "",
      timer: null, // 防抖定时器
    };
  },
  methods: {
    // 防抖搜索（增加input事件传递值）
    handleSearch() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        const trimVal = this.searchVal.trim();
        this.$emit("input", trimVal); // 触发input事件，给父组件传值
        this.$emit("search", trimVal);
      }, 300);
    },
    // 清空搜索（同样触发input事件）
    handleClear() {
      this.searchVal = "";
      this.$emit("input", ""); // 清空时同步传递空值
      this.$emit("search", "");
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>

<style scoped>
.search-input {
  position: relative;
  width: 300px;
}
input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}
input:focus {
  border-color: #42b983;
}
.clear-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  font-size: 16px;
}
</style>
