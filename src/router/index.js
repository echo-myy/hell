import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

// 导入项目实际组件（匹配你的文件命名）
import LoginPage from "@/views/LoginPage";
import HomePage from "@/views/HomePage";
import PlayList from "@/views/PlayList";
import MusicDetail from "@/views/MusicDetail";
import CollectionPage from "@/views/CollectionPage";
import Setting from "@/views/Setting";

Vue.use(Router);

const router = new Router({
  mode: "hash",
  routes: [
    // 修复：删除未使用的 to 参数
    {
      path: "/",
      redirect: () => {
        return store.state.user.isLogin ? "/home" : "/login";
      },
    },
    {
      path: "/login",
      component: LoginPage,
      meta: { requiresAuth: false },
    },
    {
      path: "/home",
      component: HomePage,
      meta: { requiresAuth: true },
    },
    {
      path: "/playlist",
      component: PlayList,
      meta: { requiresAuth: true },
    },
    {
      path: "/music-detail/:id",
      component: MusicDetail,
      meta: { requiresAuth: true },
    },
    {
      path: "/collection",
      component: CollectionPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/setting",
      component: Setting,
      meta: { requiresAuth: true },
    },
    // 修复：删除未使用的 to 参数
    {
      path: "*",
      redirect: () => {
        return store.state.user.isLogin ? "/home" : "/login";
      },
    },
  ],
});

// 路由守卫：优化参数命名（_to/_from 表示有意未使用）
router.beforeEach((_to, _from, next) => {
  // 1. 判断是否需要登录授权
  const requiresAuth = _to.meta.requiresAuth;

  // 2. 容错获取登录状态
  const isLogin = store?.state?.user?.isLogin || false;

  if (requiresAuth) {
    // 需要登录：已登录放行，未登录跳登录页
    if (isLogin) {
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: _to.fullPath },
        replace: true,
      });
    }
  } else {
    // 不需要登录（仅登录页）：已登录且非登录页跳转，跳首页
    if (_to.path === "/login" && isLogin && _from.path !== "/login") {
      next({ path: "/home", replace: true });
    } else {
      next();
    }
  }
});

export default router;
