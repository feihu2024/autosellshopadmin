<template>
  <div class="layout">
    <el-container v-if="state.showMenu" class="container">
      <el-aside class="aside">
        <div class="head">
          <div>
            <span>商城管理系统</span>
          </div>
        </div>
        <div class="line" />
        <el-menu background-color="#222832" text-color="#fff" :router="true" :default-openeds="state.defaultOpen"
          :default-active="state.currentPath">
          <el-menu-item index="/">
            <template #title>
              <span>首页</span>
            </template>
          </el-menu-item>

          <!-- <el-sub-menu index="2">
            <template #title>
              <span>首页配置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/swiper"
                ><el-icon><Picture /></el-icon>轮播图配置</el-menu-item
              >
              <el-menu-item index="/hot"
                ><el-icon><StarFilled /></el-icon>热销商品配置</el-menu-item
              >
              <el-menu-item index="/new"
                ><el-icon><Sell /></el-icon>新品上线配置</el-menu-item
              >
              <el-menu-item index="/recommend"
                ><el-icon><ShoppingCart /></el-icon>为你推荐配置</el-menu-item
              >
            </el-menu-item-group>
          </el-sub-menu> -->
          <el-menu-item index="/banner"><el-icon>
              <Goods />
            </el-icon>Banner管理</el-menu-item>
          <el-menu-item index="/poster"><el-icon>
              <Goods />
            </el-icon>海报管理</el-menu-item>
          <el-menu-item index="/member"><el-icon>
              <Goods />
            </el-icon>会员管理</el-menu-item>
          <el-menu-item index="/role"><el-icon>
              <Goods />
            </el-icon>角色管理</el-menu-item>
          <el-menu-item index="/supplier"><el-icon>
              <Goods />
            </el-icon>供应商管理</el-menu-item>
          <el-menu-item index="/good"><el-icon>
              <Goods />
            </el-icon>商品管理</el-menu-item>
          <el-menu-item index="/orders"><el-icon>
              <Goods />
            </el-icon>订单管理</el-menu-item>
          <el-menu-item index="/repurchase"><el-icon>
              <Goods />
            </el-icon>复购管理</el-menu-item>
          <el-menu-item index="/withdrawal"><el-icon>
              <Goods />
            </el-icon>提现管理</el-menu-item>
          <el-menu-item index="/fund"><el-icon>
              <Goods />
            </el-icon>资金列表</el-menu-item>
          <el-menu-item index="/fundPool">
            <el-icon>
              <Goods />
            </el-icon>资金池列表
          </el-menu-item>
          <el-menu-item index="/passwordBatch"><el-icon>
              <Goods />
            </el-icon>卡密列表</el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <span>参数设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/classify"><el-icon>
                  <Menu />
                </el-icon>分类管理</el-menu-item>
              <el-menu-item index="/privacy"><el-icon>
                  <Menu />
                </el-icon>注册协议</el-menu-item>
              <el-menu-item index="/service"><el-icon>
                  <Menu />
                </el-icon>隐私政策
              </el-menu-item>
              <el-menu-item index="/orderParameters"><el-icon>
                  <Menu />
                </el-icon>下单参数
              </el-menu-item>
              <el-menu-item index="/returnInvestment"><el-icon>
                  <Menu />
                </el-icon>初始礼包列表
              </el-menu-item>

            </el-menu-item-group>
          </el-sub-menu>
          <!-- <el-sub-menu index="3">
            <template #title>
              <span>模块管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/category"
                ><el-icon><Menu /></el-icon>分类管理</el-menu-item
              >
              <el-menu-item index="/good"
                ><el-icon><Goods /></el-icon>商品管理</el-menu-item
              >
              <el-menu-item index="/guest"
                ><el-icon><User /></el-icon>会员管理</el-menu-item
              >
              <el-menu-item index="/order"
                ><el-icon><List /></el-icon>订单管理</el-menu-item
              >
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <span>系统管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/account"
                ><el-icon><Lock /></el-icon>修改密码</el-menu-item
              >
            </el-menu-item-group>
          </el-sub-menu> -->
        </el-menu>
      </el-aside>
      <el-container class="content">
        <Header />
        <div class="main">
          <router-view />
        </div>
        <Footer />
      </el-container>
    </el-container>
    <el-container v-else class="container">
      <router-view />
    </el-container>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { localGet, pathMap } from "@/utils";

const noMenu = ["/login"];
const router = useRouter();
const state = reactive({
  showMenu: true,
  defaultOpen: ["1", "2", "3", "4"],
  currentPath: "/",
});

router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    // 如果路径是 /login 则正常执行
    next();
  } else {
    // 如果不是 /login，判断是否有 token
    if (!localGet("jinnengyuansession")) {
      // 如果没有，则跳至登录页面
      next({ path: "/login" });
    } else {
      // 否则继续执行
      next();
    }
  }
  state.showMenu = !noMenu.includes(to.path);
  state.currentPath = to.path;
  document.title = pathMap[to.name];
});
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #ffffff;
}

.container {
  height: 100vh;
}

.aside {
  width: 200px !important;
  background-color: #222832;
}

.head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.head>div {
  display: flex;
  align-items: center;
}

.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.head span {
  font-size: 20px;
  color: #ffffff;
}

.line {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.content {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}

.main {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px;
}
</style>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.el-menu {
  border-right: none !important;
}

.el-submenu {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.el-submenu:first-child {
  border-top: none;
}

.el-submenu [class^="el-icon-"] {
  vertical-align: -1px !important;
}

a {
  color: #409eff;
  text-decoration: none;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}

.el-popper__arrow {
  display: none;
}
</style>