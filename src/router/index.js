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
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta?.requiresAuth ?? false;
  const isLogin = store?.state?.user?.isLogin ?? false;

  if (requiresAuth) {
    if (isLogin) {
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
        replace: true,
      });
    }
  } else {
    if (to.path === "/login" && isLogin && from.path !== "/login") {
      next({ path: "/home", replace: true });
    } else {
      next();
    }
  }
});

router.afterEach((to) => {
  console.log(`Route changed to: ${to.path}`);
});

export default router;
