import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const API_BASE = "http://localhost:3000/api";

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem("user")) || {
      id: null,
      isLogin: false,
      username: "",
      email: "",
      password: "123456",
    },
    // 主题颜色配置
    themeColor: JSON.parse(localStorage.getItem("themeColor")) || {
      id: "purple",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      primary: "#667eea",
      secondary: "#764ba2",
    },
    themeColors: [
      {
        id: "purple",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        primary: "#667eea",
        secondary: "#764ba2",
      },
      {
        id: "blue",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        primary: "#4facfe",
        secondary: "#00f2fe",
      },
      {
        id: "green",
        gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        primary: "#43e97b",
        secondary: "#38f9d7",
      },
      {
        id: "orange",
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        primary: "#fa709a",
        secondary: "#fee140",
      },
      {
        id: "pink",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        primary: "#f093fb",
        secondary: "#f5576c",
      },
    ],
    // 播放相关状态
    currentMusic: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    playMode: 0, // 0: 列表循环, 1: 单曲循环, 2: 随机播放
    playState: { currentMusic: null, isPlaying: false },

    // 播放器UI状态
    showMiniPlayer: true, // 手机端显示迷你播放器
    showFullScreenPlayer: false, // 是否显示全屏播放器

    // 收藏列表
    favorites: JSON.parse(localStorage.getItem("favorites")) || [],
    recentPlayList: JSON.parse(localStorage.getItem("recentPlayList")) || [],
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
        lyrics: [
          { time: 0, text: "不敢回看" },
          { time: 3, text: "左顾右盼不自然的暗自喜欢" },
          { time: 8, text: "偷偷搭讪总没完地坐立难安" },
          { time: 13, text: "试探说晚安 多空泛又心酸" },
          { time: 18, text: "低头呢喃" },
          { time: 21, text: "对你的偏爱太过于明目张胆" },
          { time: 26, text: "在原地打转的小丑伤心不断" },
          { time: 31, text: "空空留遗憾 多难堪又为难" },
          { time: 36, text: "释然 慵懒 尽欢" },
          { time: 41, text: "时间风干后你与我再无关" },
          { time: 46, text: "没答案 怎么办 看不惯自我欺瞒" },
          { time: 51, text: "纵容着 喜欢的 讨厌的 宠溺的 厌倦的" },
          { time: 56, text: "一个个慢慢黯淡" },
          { time: 61, text: "纵容着 任性的 随意的 放肆的 轻易的" },
          { time: 66, text: "将所有欢脱倾翻" },
          { time: 71, text: "不应该 太心软 不大胆 太死板 不果断" },
          { time: 76, text: "玩弄着肆无忌惮" },
          { time: 81, text: "不应该 舍弃了 死心了 放手了 断念了" },
          { time: 86, text: "无可奈何不耐烦" },
          { time: 91, text: "任由着 你躲闪 我追赶 你走散 我呼喊" },
          { time: 96, text: "是谁在泛泛而谈" },
          { time: 101, text: "任由着 你来了 你笑了 你走了 不看我" },
          { time: 106, text: "与理所当然分摊" },
          { time: 111, text: "不安穿成破烂 借来没用的晚安" },
          { time: 116, text: "纵容着 喜欢的 讨厌的 宠溺的 厌倦的" },
          { time: 121, text: "一个个慢慢黯淡" },
          { time: 126, text: "纵容着 任性的 随意的 放肆的 轻易的" },
          { time: 131, text: "将所有欢脱倾翻" },
          { time: 136, text: "不应该 太心软 不大胆 太死板 不果断" },
          { time: 141, text: "玩弄着肆无忌惮" },
          { time: 146, text: "不应该 舍弃了 死心了 放手了 断念了" },
          { time: 151, text: "无可奈何不耐烦" },
          { time: 156, text: "任由着 你躲闪 我追赶 你走散 我呼喊" },
          { time: 161, text: "是谁在泛泛而谈" },
          { time: 166, text: "任由着 你来了 你笑了 你走了 不看我" },
          { time: 171, text: "与理所当然分摊" },
          { time: 176, text: "不安穿成破烂 借来没用的晚安" },
        ],
      },
      {
        id: 2,
        name: "江南",
        singer: "林俊杰",
        cover: require("@/assets/covers/江南.jpg"),
        url: require("@/assets/musics/江南.mp3"),
        duration: "4:27",
        type: "pop",
        lyrics: [
          { time: 0, text: "风到这里就是粘" },
          { time: 5, text: "粘住过客的思念" },
          { time: 10, text: "雨到这里缠成线" },
          { time: 15, text: "缠着我们留恋人世间" },
          { time: 20, text: "你在身边就是缘" },
          { time: 25, text: "缘分写在三生石上面" },
          { time: 30, text: "爱有万分之一甜" },
          { time: 35, text: "宁愿我就葬在这一点" },
          { time: 40, text: "圈圈圆圆圈圈" },
          { time: 45, text: "天天年年天天的我" },
          { time: 50, text: "深深看你的脸" },
          { time: 55, text: "生气的温柔 埋怨的温柔的脸" },
          { time: 60, text: "不懂爱恨情愁煎熬的我们" },
          { time: 65, text: "都以为相爱就像风云的善变" },
          { time: 70, text: "相信爱一天 抵过永远" },
          { time: 75, text: "在这一刹那冻结了时间" },
          { time: 80, text: "不懂怎么表现温柔的我们" },
          { time: 85, text: "还以为殉情只是古老的传言" },
          { time: 90, text: "离愁能有多痛 痛有多浓" },
          { time: 95, text: "当梦被埋在江南烟雨中 心碎了才懂" },
          { time: 100, text: "圈圈圆圆圈圈" },
          { time: 105, text: "天天年年天天的我" },
          { time: 110, text: "深深看你的脸" },
          { time: 115, text: "生气的温柔 埋怨的温柔的脸" },
          { time: 120, text: "不懂爱恨情愁煎熬的我们" },
          { time: 125, text: "都以为相爱就像风云的善变" },
          { time: 130, text: "相信爱一天 抵过永远" },
          { time: 135, text: "在这一刹那冻结了时间" },
          { time: 140, text: "不懂怎么表现温柔的我们" },
          { time: 145, text: "还以为殉情只是古老的传言" },
          { time: 150, text: "离愁能有多痛 痛有多浓" },
          { time: 155, text: "当梦被埋在江南烟雨中 心碎了才懂" },
        ],
      },
      {
        id: 3,
        name: "富士山下",
        singer: "陈奕迅",
        cover: require("@/assets/covers/富士山下.jpg"),
        url: require("@/assets/musics/富士山下.mp3"),
        duration: "4:18",
        type: "pop",
        lyrics: [
          { time: 0, text: "拦路雨偏似雪花" },
          { time: 5, text: "饮泣的你冻吗" },
          { time: 10, text: "这风褛我给你磨到有襟花" },
          { time: 15, text: "连掉了渍也不怕" },
          { time: 20, text: "怎么始终牵挂" },
          { time: 25, text: "苦心选中今天想车你回家" },
          { time: 30, text: "原谅我不再送花" },
          { time: 35, text: "伤口应要结疤" },
          { time: 40, text: "花瓣铺满心里坟场才害怕" },
          { time: 45, text: "如若你非我不嫁" },
          { time: 50, text: "彼此终必火化" },
          { time: 55, text: "一生一世等一天需要代价" },
          { time: 60, text: "谁都只得那双手" },
          { time: 65, text: "靠拥抱亦难任你拥有" },
          { time: 70, text: "要拥有必先懂失去怎接受" },
          { time: 75, text: "曾沿着雪路浪游" },
          { time: 80, text: "为何为好事泪流" },
          { time: 85, text: "谁能凭爱意要富士山私有" },
          { time: 90, text: "何不把悲哀感觉 假设是来自你虚构" },
          { time: 95, text: "试管里找不到它染污眼眸" },
          { time: 100, text: "前尘硬化像石头" },
          { time: 105, text: "随缘地抛下便逃走" },
          { time: 110, text: "我绝不罕有 往街里绕过一周 我便化乌有" },
          { time: 115, text: "情人节不要说穿 只敢抚你发端" },
          { time: 120, text: "这种姿态可会令你更心酸" },
          { time: 125, text: "留在汽车里取暖 应该怎么规劝" },
          { time: 130, text: "怎么可以将手腕忍痛划损" },
          { time: 135, text: "人活到几岁算短 失恋只有更短" },
          { time: 140, text: "归家需要几里路谁能预算" },
          { time: 145, text: "忘掉我跟你恩怨 樱花开了几转" },
          { time: 150, text: "东京之旅一早比一世遥远" },
          { time: 155, text: "谁都只得那双手" },
          { time: 160, text: "靠拥抱亦难任你拥有" },
          { time: 165, text: "要拥有必先懂失去怎接受" },
          { time: 170, text: "曾沿着雪路浪游" },
          { time: 175, text: "为何为好事泪流" },
          { time: 180, text: "谁能凭爱意要富士山私有" },
          { time: 185, text: "何不把悲哀感觉 假设是来自你虚构" },
          { time: 190, text: "试管里找不到它染污眼眸" },
          { time: 195, text: "前尘硬化像石头" },
          { time: 200, text: "随缘地抛下便逃走" },
          { time: 205, text: "我绝不罕有 往街里绕过一周 我便化乌有" },
          { time: 210, text: "谁都只得那双手" },
          { time: 215, text: "靠拥抱亦难任你拥有" },
          { time: 220, text: "要拥有必先懂失去怎接受" },
          { time: 225, text: "曾沿着雪路浪游" },
          { time: 230, text: "为何为好事泪流" },
          { time: 235, text: "谁能凭爱意要富士山私有" },
        ],
      },
      {
        id: 4,
        name: "关键词",
        singer: "林俊杰",
        cover: require("@/assets/covers/关键词.jpg"),
        url: require("@/assets/musics/关键词.mp3"),
        duration: "3:30",
        type: "pop",
        lyrics: [
          { time: 0, text: "好好爱自己 就有人会爱你" },
          { time: 5, text: "这乐观的说词" },
          { time: 10, text: "幸福的样子 我感觉好真实" },
          { time: 15, text: "找不到形容词" },
          { time: 20, text: "沉默在掩饰 快泛滥的激情" },
          { time: 25, text: "只剩下语助词" },
          { time: 30, text: "有一种踏实 当你口中喊我名字" },
          { time: 35, text: "落叶的位置 谱出一首诗" },
          { time: 40, text: "时间在消逝 我们的故事开始" },
          { time: 45, text: "这是第一次" },
          { time: 50, text: "让我见识爱情 可以慷慨又自私" },
          { time: 55, text: "你是我的关键词" },
          { time: 60, text: "我不太确定 爱最好的方式 是动词或名词" },
          { time: 65, text: "很想告诉你 最赤裸的感情 却又忘词" },
          { time: 70, text: "聚散总有时 而哭笑也有时 我不怕潜台词" },
          { time: 75, text: "有一种踏实 是你心中有我名字" },
          { time: 80, text: "落叶的位置 谱出一首诗" },
          { time: 85, text: "时间在消逝 我们的故事开始" },
          { time: 90, text: "这是第一次" },
          { time: 95, text: "让我见识爱情 可以慷慨又自私" },
          { time: 100, text: "你是我的关键词" },
          { time: 105, text: "落叶的位置 谱出一首诗" },
          { time: 110, text: "时间在消逝 我们的故事开始" },
          { time: 115, text: "这是第一次" },
          { time: 120, text: "让我见识爱情 可以慷慨又自私" },
          { time: 125, text: "你是我的关键词" },
        ],
      },
      {
        id: 5,
        name: "葡萄成熟时",
        singer: "陈奕迅",
        cover: require("@/assets/covers/葡萄成熟时.jpg"),
        url: require("@/assets/musics/葡萄成熟时.mp3"),
        duration: "4:39",
        type: "pop",
        lyrics: [
          { time: 0, text: "差不多冬至一早一晚还是有雨" },
          { time: 6, text: "当初的坚持 现已令你很怀疑" },
          { time: 12, text: "很怀疑 你最尾等到 只有这枯枝" },
          { time: 18, text: "苦恋几多次 悉心栽种全力灌注" },
          { time: 24, text: "所得竟不如 别个后辈收成时" },
          { time: 30, text: "这一次你真的很介意" },
          { time: 36, text: "但见旁人谈情何引诱" },
          { time: 42, text: "问到何时葡萄先熟透" },
          { time: 48, text: "你要静候 再静候" },
          { time: 54, text: "就算失收 始终要守" },
          { time: 60, text: "日后 尽量别教今天的泪白流" },
          { time: 66, text: "留低击伤你的石头 从错误里吸收" },
          { time: 72, text: "也许 丰收月份尚未到你也得接受" },
          { time: 78, text: "或者要到你将爱酿成醇酒" },
          { time: 84, text: "时机先至熟透" },
          { time: 90, text: "想想天的一边 亦有某某" },
          { time: 96, text: "在等候 因世上的挚爱" },
          { time: 102, text: "是不计较条件 谁又可清楚看见" },
          { time: 108, text: "差不多冬至一早一晚还是有雨" },
          { time: 114, text: "当初的坚持 现已令你很怀疑" },
          { time: 120, text: "很怀疑 你最尾等到 只有这枯枝" },
          { time: 126, text: "苦恋几多次 悉心栽种全力灌注" },
          { time: 132, text: "所得竟不如 别个后辈收成时" },
          { time: 138, text: "这一次你真的很介意" },
          { time: 144, text: "但见旁人谈情何引诱" },
          { time: 150, text: "问到何时葡萄先熟透" },
          { time: 156, text: "你要静候 再静候" },
          { time: 162, text: "就算失收 始终要守" },
          { time: 168, text: "日后 尽量别教今天的泪白流" },
          { time: 174, text: "留低击伤你的石头 从错误里吸收" },
          { time: 180, text: "也许 丰收月份尚未到你也得接受" },
          { time: 186, text: "或者要到你将爱酿成醇酒" },
          { time: 192, text: "时机先至熟透" },
          { time: 198, text: "但见旁人谈情何引诱" },
          { time: 204, text: "问到何时葡萄先熟透" },
          { time: 210, text: "你要静候 再静候" },
          { time: 216, text: "就算失收 始终要守" },
          { time: 222, text: "日后 尽量别教今天的泪白流" },
          { time: 228, text: "留低击伤你的石头 从错误里吸收" },
          { time: 234, text: "也许 丰收月份尚未到你也得接受" },
          { time: 240, text: "或者要到你将爱酿成醇酒" },
          { time: 246, text: "时机先至熟透" },
        ],
      },
      {
        id: 6,
        name: "青花瓷",
        singer: "周杰伦",
        cover: require("@/assets/covers/青花瓷.jpg"),
        url: require("@/assets/musics/青花瓷.mp3"),
        duration: "3:59",
        type: "pop",
        lyrics: [
          { time: 0, text: "素胚勾勒出青花笔锋浓转淡" },
          { time: 5, text: "瓶身描绘的牡丹一如你初妆" },
          { time: 10, text: "冉冉檀香透过窗心事我了然" },
          { time: 15, text: "宣纸上走笔至此搁一半" },
          { time: 20, text: "釉色渲染仕女图韵味被私藏" },
          { time: 25, text: "而你嫣然的一笑如含苞待放" },
          { time: 30, text: "你的美一缕飘散 去到我去不了的地方" },
          { time: 35, text: "天青色等烟雨 而我在等你" },
          { time: 40, text: "炊烟袅袅升起 隔江千万里" },
          { time: 45, text: "在瓶底书汉隶仿前朝的飘逸" },
          { time: 50, text: "就当我为遇见你伏笔" },
          { time: 55, text: "天青色等烟雨 而我在等你" },
          { time: 60, text: "月色被打捞起 晕开了结局" },
          { time: 65, text: "如传世的青花瓷自顾自美丽 你眼带笑意" },
          { time: 70, text: "色白花青的锦鲤跃然于碗底" },
          { time: 75, text: "临摹宋体落款时却惦记着你" },
          { time: 80, text: "你隐藏在窑烧里千年的秘密" },
          { time: 85, text: "极细腻犹如绣花针落地" },
          { time: 90, text: "帘外芭蕉惹骤雨门环惹铜绿" },
          { time: 95, text: "而我路过那江南小镇惹了你" },
          { time: 100, text: "在泼墨山水画里 你从墨色深处被隐去" },
          { time: 105, text: "天青色等烟雨 而我在等你" },
          { time: 110, text: "炊烟袅袅升起 隔江千万里" },
          { time: 115, text: "在瓶底书汉隶仿前朝的飘逸" },
          { time: 120, text: "就当我为遇见你伏笔" },
          { time: 125, text: "天青色等烟雨 而我在等你" },
          { time: 130, text: "月色被打捞起 晕开了结局" },
          { time: 135, text: "如传世的青花瓷自顾自美丽 你眼带笑意" },
          { time: 140, text: "天青色等烟雨 而我在等你" },
          { time: 145, text: "炊烟袅袅升起 隔江千万里" },
          { time: 150, text: "在瓶底书汉隶仿前朝的飘逸" },
          { time: 155, text: "就当我为遇见你伏笔" },
          { time: 160, text: "天青色等烟雨 而我在等你" },
          { time: 165, text: "月色被打捞起 晕开了结局" },
          { time: 170, text: "如传世的青花瓷自顾自美丽 你眼带笑意" },
        ],
      },
      {
        id: 7,
        name: "喜欢你",
        singer: "邓紫棋",
        cover: require("@/assets/covers/喜欢你.jpg"),
        url: require("@/assets/musics/喜欢你.mp3"),
        duration: "3:59",
        type: "pop",
        lyrics: [
          { time: 0, text: "细雨带风湿透黄昏的街道" },
          { time: 5, text: "抹去雨水双眼无故地仰望" },
          { time: 10, text: "望向孤单的晚灯 是那伤感的记忆" },
          { time: 15, text: "再次泛起心里无数的思念" },
          { time: 20, text: "以往片刻欢笑仍挂在脸上" },
          { time: 25, text: "愿你此刻可会知 是我衷心的说声" },
          { time: 30, text: "喜欢你 那双眼动人 笑声更迷人" },
          { time: 35, text: "愿再可 轻抚你 那可爱面容" },
          { time: 40, text: "挽手说梦话 像昨天 你共我" },
          { time: 45, text: "满带理想的我曾经多冲动" },
          { time: 50, text: "屡怨与她相爱难有自由" },
          { time: 55, text: "愿你此刻可会知 是我衷心的说声" },
          { time: 60, text: "喜欢你 那双眼动人 笑声更迷人" },
          { time: 65, text: "愿再可 轻抚你 那可爱面容" },
          { time: 70, text: "挽手说梦话 像昨天 你共我" },
          { time: 75, text: "每晚夜里自我独行 随处荡 多冰冷" },
          { time: 80, text: "以往为了自我挣扎 从不知她的痛苦" },
          { time: 85, text: "喜欢你 那双眼动人 笑声更迷人" },
          { time: 90, text: "愿再可 轻抚你 那可爱面容" },
          { time: 95, text: "挽手说梦话 像昨天 你共我" },
        ],
      },
      {
        id: 8,
        name: "反方向的钟",
        singer: "周杰伦",
        cover: require("@/assets/covers/反方向的钟.jpg"),
        url: require("@/assets/musics/反方向的钟.mp3"),
        duration: "4:18",
        type: "pop",
        lyrics: [
          { time: 0, text: "ㄅㄆㄇㄈㄉㄊㄋㄌ" },
          { time: 3, text: "迷迷蒙蒙 你给的梦" },
          { time: 8, text: "出现裂缝 隐隐作痛" },
          { time: 13, text: "怎么沟通 你都没空" },
          { time: 18, text: "说我不懂 说了没用" },
          { time: 23, text: "他的笑容 有何不同" },
          { time: 28, text: "在你心中 我不再受宠" },
          { time: 33, text: "我的天空 是雨是风 还是彩虹" },
          { time: 38, text: "你在操纵" },
          { time: 43, text: "恨自己真的没用 情绪激动" },
          { time: 48, text: "一颗心到现在还在抽痛" },
          { time: 53, text: "还为分手前那句抱歉在感动" },
          { time: 58, text: "穿梭时间的画面的钟 从反方向开始移动" },
          { time: 63, text: "回到当初爱你的时空 停格内容不忠" },
          { time: 68, text: "所有回忆对着我进攻" },
          { time: 73, text: "我的伤口 被你拆封" },
          { time: 78, text: "誓言太沉重泪被纵容 脸上汹涌失控" },
          { time: 83, text: "城市霓虹 不安跳动 染红夜空" },
          { time: 88, text: "过去种种 像一场梦 不敢去碰 一想就痛" },
          { time: 93, text: "往事重提 一阵风 吹过之后 只剩空洞" },
          { time: 98, text: "恨自己真的没用 情绪激动" },
          { time: 103, text: "一颗心到现在还在抽痛" },
          { time: 108, text: "还为分手前那句抱歉在感动" },
          { time: 113, text: "穿梭时间的画面的钟 从反方向开始移动" },
          { time: 118, text: "回到当初爱你的时空 停格内容不忠" },
          { time: 123, text: "所有回忆对着我进攻" },
          { time: 128, text: "我的伤口 被你拆封" },
          { time: 133, text: "誓言太沉重泪被纵容 脸上汹涌失控" },
          { time: 138, text: "穿梭时间的画面的钟 从反方向开始移动" },
          { time: 143, text: "回到当初爱你的时空 停格内容不忠" },
          { time: 148, text: "所有回忆对着我进攻" },
          { time: 153, text: "我的伤口 被你拆封" },
          { time: 158, text: "誓言太沉重泪被纵容 脸上汹涌失控" },
        ],
      },
      {
        id: 9,
        name: "句号",
        singer: "邓紫棋",
        cover: require("@/assets/covers/句号.jpg"),
        url: require("@/assets/musics/句号.mp3"),
        duration: "3:55",
        type: "pop",
        lyrics: [
          { time: 0, text: "可惜我们终于来到 一个句号" },
          { time: 5, text: "窗外不愿飞的蜂鸟 也在哀悼" },
          { time: 10, text: "城市再也不会听到 我们争吵" },
          { time: 15, text: "你会不会少了一点烦恼" },
          { time: 20, text: "回到十二年前 回忆就在眼前" },
          { time: 25, text: "你戴着帽子 而我样子 带着腼腆" },
          { time: 30, text: "不过第一次的见面 你说 你有先见" },
          { time: 35, text: "我的先天 被训练过 我能有片天" },
          { time: 40, text: "我当时天真 寡见鲜闻" },
          { time: 45, text: "不像成年人 有能力辨认" },
          { time: 50, text: "不是为了赚了有钱分 我为我的前程" },
          { time: 55, text: "希望我写的歌里面有更好的和弦声" },
          { time: 60, text: "时针滴滴答 你还记得吗 说句心里话 你还怀念吗" },
          { time: 65, text: "你说我是个商品 没有你我就不可以" },
          { time: 70, text: "这些扭曲的真理 差点毁掉我的自信" },
          { time: 75, text: "如今的我已觉醒 如今我不再哭泣" },
          { time: 80, text: "再不怕坚持自己 做你没做对的决定" },
          { time: 85, text: "你知道吗 这一辈子除了我的爸爸" },
          { time: 90, text: "你曾是我最信任的男人吧" },
          { time: 95, text: "但空白的娃娃 总会慢慢长大" },
          { time: 100, text: "抱歉我没法永远当你听话的傻瓜" },
          { time: 105, text: "可惜我们终于来到 一个句号" },
          { time: 110, text: "窗外不愿飞的蜂鸟 也在哀悼" },
          { time: 115, text: "城市再也不会听到 我们争吵" },
          { time: 120, text: "你会不会少了一点烦恼" },
          { time: 125, text: "时针滴滴答 你还记得吗 说句心里话 你还怀念吗" },
          { time: 130, text: "可惜我们终于来到 一个句号" },
          { time: 135, text: "窗外不愿飞的蜂鸟 也在哀悼" },
          { time: 140, text: "城市再也不会听到 我们争吵" },
          { time: 145, text: "你会不会少了一点烦恼" },
        ],
      },
      {
        id: 10,
        name: "晴天",
        singer: "周杰伦",
        cover: require("@/assets/covers/晴天.jpg"),
        url: require("@/assets/musics/晴天.mp3"),
        duration: "4:29",
        type: "pop",
        lyrics: [
          { time: 0, text: "故事的小黄花 从出生那年就飘着" },
          { time: 5, text: "童年的荡秋千 随记忆一直晃到现在" },
          {
            time: 10,
            text: "Re So So Si Do Si La So La Si Si Si Si La Si La So",
          },
          { time: 15, text: "吹着前奏望着天空 我想起花瓣试着掉落" },
          { time: 20, text: "为你翘课的那一天 花落的那一天" },
          { time: 25, text: "教室的那一间 我怎么看不见" },
          { time: 30, text: "消失的下雨天 我好想再淋一遍" },
          { time: 35, text: "没想到失去的勇气我还留着 好想再问一遍" },
          { time: 40, text: "你会等待还是离开" },
          { time: 45, text: "刮风这天我试过握着你手" },
          { time: 50, text: "但偏偏雨渐渐大到我看你不见" },
          { time: 55, text: "还要多久我才能在你身边" },
          { time: 60, text: "等到放晴的那天也许我会比较好一点" },
          { time: 65, text: "从前从前有个人爱你很久" },
          { time: 70, text: "但偏偏风渐渐把距离吹得好远" },
          { time: 75, text: "好不容易又能再多爱一天" },
          { time: 80, text: "但故事的最后你好像还是说了拜拜" },
          { time: 85, text: "为你翘课的那一天 花落的那一天" },
          { time: 90, text: "教室的那一间 我怎么看不见" },
          { time: 95, text: "消失的下雨天 我好想再淋一遍" },
          { time: 100, text: "没想到失去的勇气我还留着 好想再问一遍" },
          { time: 105, text: "你会等待还是离开" },
          { time: 110, text: "刮风这天我试过握着你手" },
          { time: 115, text: "但偏偏雨渐渐大到我看你不见" },
          { time: 120, text: "还要多久我才能在你身边" },
          { time: 125, text: "等到放晴的那天也许我会比较好一点" },
          { time: 130, text: "从前从前有个人爱你很久" },
          { time: 135, text: "但偏偏风渐渐把距离吹得好远" },
          { time: 140, text: "好不容易又能再多爱一天" },
          { time: 145, text: "但故事的最后你好像还是说了拜拜" },
          { time: 150, text: "刮风这天我试过握着你手" },
          { time: 155, text: "但偏偏雨渐渐大到我看你不见" },
          { time: 160, text: "还要多久我才能在你身边" },
          { time: 165, text: "等到放晴的那天也许我会比较好一点" },
          { time: 170, text: "从前从前有个人爱你很久" },
          { time: 175, text: "但偏偏风渐渐把距离吹得好远" },
          { time: 180, text: "好不容易又能再多爱一天" },
          { time: 185, text: "但故事的最后你好像还是说了拜拜" },
        ],
      },
      {
        id: 11,
        name: "唯一",
        singer: "邓紫棋",
        cover: require("@/assets/covers/唯一.jpg"),
        url: require("@/assets/musics/唯一.mp3"),
        duration: "4:13",
        type: "pop",
        lyrics: [
          { time: 0, text: "你真的懂唯一的定义 并不简单如呼吸" },
          { time: 5, text: "你真的希望你能厘清 若没交心怎么说明" },
          { time: 10, text: "我真的爱你 句句不轻易 眼神中飘移" },
          { time: 15, text: "总是在关键时刻清楚洞悉 你的不坚定" },
          { time: 20, text: "配合我颠沛流离 死去中清醒 明白你背着我聪明" },
          {
            time: 25,
            text: "那些我 想说的 没说的 话 有时我 怀疑呢 只是我 傻瓜",
          },
          { time: 30, text: "但如果真的爱 不会算计" },
          { time: 35, text: "爱是不嫉妒 不张狂 不求自己" },
          { time: 40, text: "无关你的回应 永不止息 你知道" },
          { time: 45, text: "我真的爱你 没人能比拟 眼神没肯定" },
          { time: 50, text: "总是在关键时刻清楚洞悉 你的不坚定" },
          { time: 55, text: "配合我颠沛流离 死去中清醒 明白你背着我聪明" },
          { time: 60, text: "我真的爱你 句句不轻易 眼神中飘移" },
          { time: 65, text: "总是在关键时刻清楚洞悉 你的不坚定" },
          { time: 70, text: "配合我颠沛流离 死去中清醒 明白你背着我聪明" },
          { time: 75, text: "我真的爱你 没人能比拟 眼神没肯定" },
          { time: 80, text: "总是在关键时刻清楚洞悉 你的不坚定" },
          { time: 85, text: "配合我颠沛流离 死去中清醒 明白你背着我聪明" },
        ],
      },
      {
        id: 12,
        name: "再见",
        singer: "邓紫棋",
        cover: require("@/assets/covers/再见.jpg"),
        url: require("@/assets/musics/再见.mp3"),
        duration: "3:26",
        type: "pop",
        lyrics: [
          { time: 0, text: "爱情的起点 都是最美的瞬间" },
          { time: 5, text: "什么铁达尼的经典 罗密欧跟茱丽叶" },
          { time: 10, text: "那些最煽情的电影情节 都说爱能超越生死离别" },
          { time: 15, text: "曾经 我们都很坚决 爱了就不改变" },
          { time: 20, text: "不要对我说再见 一句再见 就结束这一切" },
          { time: 25, text: "能否不要说再见 你的再见说得那么明确" },
          { time: 30, text: "怎么我和你之间两个世界 再也没有交接" },
          { time: 35, text: "如果告别 能不能再见" },
          { time: 40, text: "我们的照片 纪录幸福到永远" },
          { time: 45, text: "只是再幸福的画面 只定格在一瞬间" },
          { time: 50, text: "那些慢吞吞悲情的音乐 早说过爱过之后就是离别" },
          { time: 55, text: "早该相信那些预言 我们也没有多特别" },
          { time: 60, text: "不要对我说再见 一句再见 让爱变得表面" },
          { time: 65, text: "真的不用说再见 就算再见 结局不能改变" },
          { time: 70, text: "就算我和你之间 两个世界 再也没有交接" },
          { time: 75, text: "不用抱歉 就真的再见" },
          { time: 80, text: "不要对我说再见 一句再见 就结束这一切" },
          { time: 85, text: "能否不要说再见 你的再见说得那么明确" },
          { time: 90, text: "怎么我和你之间两个世界 再也没有交接" },
          { time: 95, text: "不要对我说再见 一句再见 让爱变得表面" },
          { time: 100, text: "真的不用说再见 就算再见 结局不能改变" },
          { time: 105, text: "就算我和你之间 两个世界 再也没有交接" },
          { time: 110, text: "不用抱歉 就真的再见" },
        ],
      },
      {
        id: 13,
        name: "十面埋伏",
        singer: "陈奕迅",
        cover: require("@/assets/covers/十面埋伏.jpg"),
        url: require("@/assets/musics/十面埋伏.mp3"),
        duration: "4:20",
        type: "classic",
        lyrics: [
          { time: 0, text: "闻说你时常在下午 来这里寄信件" },
          { time: 5, text: "逢礼拜流连艺术展 还是未间断" },
          { time: 10, text: "何以我来回巡逻遍 仍然和你擦肩" },
          { time: 15, text: "还仍然在各自宇宙 错过了春天" },
          { time: 20, text: "只差一点点即可以再会面" },
          { time: 25, text: "可惜偏偏刚刚擦过" },
          { time: 30, text: "十面埋伏过 孤单感更赤裸" },
          { time: 35, text: "总差一点点先可以再会面" },
          { time: 40, text: "仿佛应该一早见过" },
          { time: 45, text: "但直行直过 只差一个眼波将彼此错过" },
          { time: 50, text: "迟两秒搭上地下铁能与你碰上么" },
          { time: 55, text: "如提前十步入电梯谁又被错过" },
          { time: 60, text: "和某某从来未预约便碰面" },
          { time: 65, text: "但见面 与他碰 便惹许多旧憾" },
          { time: 70, text: "寻觅你 躲进了 咖啡店" },
          { time: 75, text: "沿途经过的路人 一个一个 都像你" },
          { time: 80, text: "只差一点点即可以再会面" },
          { time: 85, text: "可惜偏偏刚刚擦过" },
          { time: 90, text: "十面埋伏过 孤单感更赤裸" },
          { time: 95, text: "总差一点点先可以再会面" },
          { time: 100, text: "仿佛应该一早见过" },
          { time: 105, text: "但直行直过 只差一个眼波将彼此错过" },
          { time: 110, text: "迟两秒搭上地下铁能与你碰上么" },
          { time: 115, text: "如提前十步入电梯谁又被错过" },
          { time: 120, text: "和某某从来未预约便碰面" },
          { time: 125, text: "但见面 与他碰 便惹许多旧憾" },
          { time: 130, text: "寻觅你 躲进了 咖啡店" },
          { time: 135, text: "沿途经过的路人 一个一个 都像你" },
        ],
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
        lyrics: [
          { time: 0, text: "Oh woooah, Oh woooah, Oh woooah" },
          { time: 5, text: "You know you love me,I know you care" },
          { time: 10, text: "You shout whenever, And I'll be there" },
          { time: 15, text: "You want my love, You want my heart" },
          { time: 20, text: "And we will never ever ever be apart" },
          { time: 25, text: "Are we an item? Girl quit playing" },
          { time: 30, text: "Were just friends, What are you saying" },
          { time: 35, text: "Said theres another, Look right in my eyes" },
          { time: 40, text: "My first love broke my heart for the first time" },
          { time: 45, text: "And I was like Baby, baby, baby nooo" },
          { time: 50, text: "My baby, baby, baby ooh" },
          { time: 55, text: "Like baby, baby, baby nooo" },
          { time: 60, text: "I thought you'd always be mine mine" },
          { time: 65, text: "For you, I would have done whatever" },
          { time: 70, text: "And I just can't believe we aren't together" },
          { time: 75, text: "And I wanna play it cool,but I'm losin'you" },
          { time: 80, text: "I'll buy you anything,I'll buy you any ring" },
          { time: 85, text: "And I'm in pieces, baby fix me" },
          {
            time: 90,
            text: "And just shake me till you wake me from this bad dream",
          },
          { time: 95, text: "I'm going down,down,down,down" },
          {
            time: 100,
            text: "And I just can't believe my first love won't be around",
          },
          { time: 105, text: "And I'm like Baby, baby, baby nooo" },
          { time: 110, text: "My baby, baby, baby ooh" },
          { time: 115, text: "Like baby, baby, baby nooo" },
          { time: 120, text: "I thought you'd always be mine mine" },
          { time: 125, text: "Baby, baby, baby nooo" },
          { time: 130, text: "My baby, baby, baby ooh" },
          { time: 135, text: "Like baby, baby, baby nooo" },
          { time: 140, text: "I thought you'd always be mine mine" },
        ],
      },
      {
        id: 17,
        name: "wake",
        singer: "Hillsong Young & Free",
        cover: require("@/assets/covers/wake.jpg"),
        url: require("@/assets/musics/wake.mp3"),
        duration: "3:59",
        type: "rock",
        lyrics: [
          { time: 0, text: "At break of day, in hope we rise" },
          { time: 5, text: "We speak Your Name, we lift our eyes" },
          { time: 10, text: "Tune our hearts into Your beat" },
          { time: 15, text: "Where we walk, there You'll be" },
          { time: 20, text: "With fire in our eyes, our lives alight" },
          { time: 25, text: "Your love untamed, it's blazing out" },
          { time: 30, text: "The streets will glow forever bright" },
          { time: 35, text: "Your glory's breaking through the night" },
          { time: 40, text: "You will never fade away" },
          { time: 45, text: "Your love is here to stay" },
          { time: 50, text: "By my side, in my life" },
          { time: 55, text: "Shining through me everyday" },
          { time: 60, text: "You wake within me, wake within me" },
          { time: 65, text: "You're in my heart forever" },
          { time: 70, text: "At break of day, in hope we rise" },
          { time: 75, text: "We speak Your Name, we lift our eyes" },
          { time: 80, text: "Tune our hearts into Your beat" },
          { time: 85, text: "Where we walk, there You'll be" },
          { time: 90, text: "With fire in our eyes, our lives alight" },
          { time: 95, text: "Your love untamed, it's blazing out" },
          { time: 100, text: "The streets will glow forever bright" },
          { time: 105, text: "Your glory's breaking through the night" },
          { time: 110, text: "You will never fade away" },
          { time: 115, text: "Your love is here to stay" },
          { time: 120, text: "By my side, in my life" },
          { time: 125, text: "Shining through me everyday" },
          { time: 130, text: "You wake within me, wake within me" },
          { time: 135, text: "You're in my heart forever" },
          { time: 140, text: "Forever, forever, forever in Your love" },
          { time: 145, text: "You will never fade away" },
          { time: 150, text: "Your love is here to stay" },
          { time: 155, text: "By my side, in my life" },
          { time: 160, text: "Shining through me everyday" },
          { time: 165, text: "You wake within me, wake within me" },
          { time: 170, text: "You're in my heart forever" },
        ],
      },
      {
        id: 18,
        name: "Die For You",
        singer: "VALORANT",
        cover: require("@/assets/covers/Die For You.jpg"),
        url: require("@/assets/musics/Die For You.mp3"),
        duration: "4:20",
        type: "rock",
        lyrics: [
          { time: 0, text: "The stars don't shine, they burn" },
          { time: 5, text: "The cycles spin in turn" },
          { time: 10, text: "I'm ready now to learn" },
          { time: 15, text: "What I was destined for" },
          { time: 20, text: "If I should die for you" },
          { time: 25, text: "I'd give my all for you" },
          { time: 30, text: "Through every fight and fall" },
          { time: 35, text: "I stand beside your call" },
          { time: 40, text: "The stars don't shine, they burn" },
          { time: 45, text: "The cycles spin in turn" },
          { time: 50, text: "I'm ready now to learn" },
          { time: 55, text: "What I was destined for" },
          { time: 60, text: "If I should die for you" },
          { time: 65, text: "I'd give my all for you" },
          { time: 70, text: "Through every fight and fall" },
          { time: 75, text: "I stand beside your call" },
        ],
      },
    ],
    // 已修改：从localStorage读取收藏列表
    collectList: JSON.parse(localStorage.getItem("collectList")) || [],
  },
  mutations: {
    // 播放音乐
    playMusic(state, music) {
      state.currentMusic = music;
      state.isPlaying = true;
      state.playState.currentMusic = music;
      state.playState.isPlaying = true;
    },

    // 设置当前歌曲（不播放）
    setCurrentMusic(state, music) {
      state.currentMusic = music;
      state.playState.currentMusic = music;
    },

    // 暂停音乐
    pauseMusic(state) {
      state.isPlaying = false;
      state.playState.isPlaying = false;
    },

    // 切换播放状态
    togglePlay(state) {
      state.isPlaying = !state.isPlaying;
      state.playState.isPlaying = state.isPlaying;
    },

    // 上一首
    prevMusic(state) {
      if (state.playMode === 2) {
        // 随机播放
        const randomIndex = Math.floor(Math.random() * state.musicList.length);
        state.currentMusic = state.musicList[randomIndex];
      } else {
        const currentIndex = state.musicList.findIndex(
          (m) => m.id === state.currentMusic?.id
        );
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : state.musicList.length - 1;
        state.currentMusic = state.musicList[prevIndex];
      }
      state.currentTime = 0;
    },

    // 下一首
    nextMusic(state) {
      if (state.playMode === 2) {
        // 随机播放
        const randomIndex = Math.floor(Math.random() * state.musicList.length);
        state.currentMusic = state.musicList[randomIndex];
      } else {
        const currentIndex = state.musicList.findIndex(
          (m) => m.id === state.currentMusic?.id
        );
        const nextIndex = (currentIndex + 1) % state.musicList.length;
        state.currentMusic = state.musicList[nextIndex];
      }
      state.currentTime = 0;
    },

    // 切换播放模式
    togglePlayMode(state) {
      state.playMode = (state.playMode + 1) % 3;
    },

    // 更新当前时间
    setCurrentTime(state, time) {
      state.currentTime = time;
    },

    // 更新时长
    setDuration(state, duration) {
      state.duration = duration;
    },

    // 设置当前时间
    updateCurrentTime(state, time) {
      state.currentTime = time;
    },

    // 设置音量
    setVolume(state, volume) {
      state.volume = volume;
    },

    // 控制UI状态
    setShowMiniPlayer(state, show) {
      state.showMiniPlayer = show;
    },

    setShowFullScreenPlayer(state, show) {
      state.showFullScreenPlayer = show;
    },

    // 收藏功能
    addFavorite(state, music) {
      if (!state.favorites.some((item) => item.id === music.id)) {
        state.favorites.push(music);
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
      }
    },

    removeFavorite(state, id) {
      state.favorites = state.favorites.filter((item) => item.id !== id);
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },

    // 关键修改：登录时同步到localStorage
    login(state, userInfo) {
      if (typeof userInfo === "object" && userInfo.username) {
        state.user = {
          id: userInfo.id || null,
          isLogin: true,
          username: userInfo.username,
          email: userInfo.email || "",
          password: state.user.password,
        };
      } else {
        state.user = {
          id: null,
          isLogin: true,
          username: userInfo,
          email: "",
          password: state.user.password,
        };
      }
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
    addRecentPlay(state, music) {
      const index = state.recentPlayList.findIndex(
        (item) => item.id === music.id
      );
      if (index > -1) {
        state.recentPlayList.splice(index, 1);
      }
      state.recentPlayList.unshift({ ...music, playTime: Date.now() });
      if (state.recentPlayList.length > 10) {
        state.recentPlayList.pop();
      }
      localStorage.setItem(
        "recentPlayList",
        JSON.stringify(state.recentPlayList)
      );
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
    setThemeColor(state, theme) {
      state.themeColor = theme;
      localStorage.setItem("themeColor", JSON.stringify(theme));
    },
  },
  getters: {
    isCollected: (state) => (id) => {
      return state.collectList.some((item) => item.id === id);
    },
  },
  actions: {
    async fetchMusicFromDB() {
      try {
        const response = await axios.get(`${API_BASE}/music`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch music from database:", error);
        return [];
      }
    },
    async addMusicToDB(_, music) {
      try {
        const response = await axios.post(`${API_BASE}/music`, music);
        return response.data;
      } catch (error) {
        console.error("Failed to add music to database:", error);
        throw error;
      }
    },
    async deleteMusicFromDB(_, id) {
      try {
        await axios.delete(`${API_BASE}/music/${id}`);
      } catch (error) {
        console.error("Failed to delete music from database:", error);
        throw error;
      }
    },
  },
  modules: {},
});
