export function localGet(key) {
  const value = window.localStorage.getItem(key);
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (error) {
    return value;
  }
}

export function localSet(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function localRemove(key) {
  window.localStorage.removeItem(key);
}

// 判断内容是否含有表情字符，现有数据库不支持。
export function hasEmoji(str = "") {
  const reg =
    /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
  return str.match(reg) && str.match(reg).length;
}

// 单张图片上传
export const uploadImgServer = "https://up-z1.qiniup.com";
// 多张图片上传
export const uploadImgsServer = "http://kemaiyuncang4wbhfrapi.yxiaozhu.com/assets/upload_file";

export const pathMap = {
  login: "登录",
  introduce: "系统介绍",
  dashboard: "大盘数据",
  addGood: "添加商品",
  swiper: "轮播图配置",
  hot: "热销商品配置",
  new: "新品上线配置",
  recommend: "为你推荐配置",
  category: "分类管理",
  level2: "分类二级管理",
  level3: "分类三级管理",
  member: "会员管理",
  role: "会员管理",
  memberDetail: "会员管理-编辑",
  memberVisual: "可视化",
  good: "商品管理",
  banner: "banner管理",
  poster: "海报管理",
  guest: "会员管理",
  orders: "订单管理",
  repurchase: "复购管理",
  withdrawal: "提现管理",
  fund: "资金列表",
  carmine: "卡密列表",
  classify: "分类管理",
  order: "订单管理",
  order_detail: "订单详情",
  account: "修改账户",
  privacy: "注册协议",
  service: "隐私政策",
  orderParameters: "下单参数",
  returnInvestment: "初始礼包列表",
  passwordBatch: "卡密列表",
  supplier: "供应商管理",
  fundPool: "资金池列表",
};