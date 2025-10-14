import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [{
    path: "/",
    redirect: "/introduce",
  },
  {
    path: "/introduce",
    name: "introduce",
    component: () =>
      import( /* webpackChunkName: "introduce" */ "../views/Introduce.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import( /* webpackChunkName: "dashboard" */ "../views/Index.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import( /* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/swiper",
    name: "swiper",
    component: () =>
      import( /* webpackChunkName: "swiper" */ "../views/Swiper.vue"),
  },
  {
    path: "/hot",
    name: "hot",
    component: () =>
      import( /* webpackChunkName: "hot" */ "../views/IndexConfig.vue"),
  },
  {
    path: "/new",
    name: "new",
    component: () =>
      import( /* webpackChunkName: "new" */ "../views/IndexConfig.vue"),
  },
  {
    path: "/recommend",
    name: "recommend",
    component: () =>
      import( /* webpackChunkName: "recommend" */ "../views/IndexConfig.vue"),
  },
  {
    path: "/category",
    name: "category",
    component: () =>
      import( /* webpackChunkName: "category" */ "../views/Category.vue"),
    children: [{
      path: "/category/level2",
      name: "level2",
      component: () =>
        import( /* webpackChunkName: "level2" */ "../views/Category.vue"),
    },
    {
      path: "/category/level3",
      name: "level3",
      component: () =>
        import( /* webpackChunkName: "level3" */ "../views/Category.vue"),
    },
    ],
  },
  {
    path: "/member",
    name: "member",
    component: () =>
      import( /* webpackChunkName: "new" */ "../views/member/index.vue"),
  },
  {
    path: "/member/visual",
    name: "memberVisual",
    component: () =>
      import( /* webpackChunkName: "new" */ "../views/member/visual.vue"),
  },
  {
    path: "/member/detail",
    name: "memberDetail",
    component: () =>
      import( /* webpackChunkName: "new" */ "../views/member/detail.vue"),
  },
  {
    path: "/good",
    name: "good",
    component: () =>
      import( /* webpackChunkName: "new" */ "../views/good/list.vue"),
  },
  {
    path: "/good/add",
    name: "addGood",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/good/addGood.vue"),
  },
  {
    path: "/banner",
    name: "banner",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/banner/index.vue"),
  },
  {
    path: "/orders",
    name: "orders",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/orders/index.vue"),
  },
  {
    path: "/withdrawal",
    name: "withdrawal",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/withdrawal/index.vue"),
  },
  {
    path: "/fund",
    name: "fund",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/fund/index.vue"),
  },
  {
    path: "/classify",
    name: "classify",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/parameterSettings/classify/index.vue"),
  },
  {
    path: "/privacy",
    name: "privacy",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/parameterSettings/privacy/index.vue"),
  },
  {
    path: "/service",
    name: "service",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/parameterSettings/privacy/service.vue"),
  },
  {
    path: "/returnInvestment",
    name: "returnInvestment",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/parameterSettings/returnInvestment/index.vue"),
  },
  {
    path: "/orderParameters",
    name: "orderParameters",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/parameterSettings/orderParameters/index.vue"),
  },
  {
    path: "/guest",
    name: "guest",
    component: () =>
      import( /* webpackChunkName: "guest" */ "../views/Guest.vue"),
  },
  {
    path: "/order",
    name: "order",
    component: () =>
      import( /* webpackChunkName: "order" */ "../views/Order.vue"),
  },
  {
    path: "/order_detail",
    name: "order_detail",
    component: () =>
      import( /* webpackChunkName: "order_detail" */ "../views/OrderDetail.vue"),
  },
  {
    path: "/account",
    name: "account",
    component: () =>
      import( /* webpackChunkName: "account" */ "../views/Account.vue"),
  },
  {
    path: "/role",
    name: "role",
    component: () =>
      import( /* webpackChunkName: "account" */ "../views/role/index.vue"),
  },
  {
    path: "/supplier",
    name: "supplier",
    component: () =>
      import( /* webpackChunkName: "account" */ "../views/supplier/index.vue"),
  },
  {
    path: "/poster",
    name: "poster",
    component: () =>
      import( /* webpackChunkName: "account" */ "../views/poster/index.vue"),
  },
  {
    path: "/repurchase",
    name: "repurchase",
    component: () =>
      import( /* webpackChunkName: "account" */ "../views/repurchase/index.vue"),
  },
  // {
  //   path: "/carmine",
  //   name: "carmine",
  //   component: () =>
  //     import( /* webpackChunkName: "account" */ "../views/carmine/index.vue"),
  // },
  {
    path: "/passwordBatch",
    name: "passwordBatch",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/passwordBatch/index.vue"),
  },
  {
    path: "/fundPool",
    name: "fundPool",
    component: () =>
      import( /* webpackChunkName: "add" */ "../views/fundPool/index.vue"),
  },
  ],
});

export default router;