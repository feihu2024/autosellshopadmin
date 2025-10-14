import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router/index";
import { localGet } from "./index";
import config from "~/config";

// 这边由于后端没有区分测试和正式，姑且都写成一个接口。
axios.defaults.baseURL = config[import.meta.env.MODE].baseUrl;
// 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
axios.defaults.withCredentials = true;
// 请求头，headers 信息
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["jinnengyuansession"] = localGet("jinnengyuansession") || "";
// 默认 post 请求，使用 application/json 形式
axios.defaults.headers.post["Content-Type"] = "application/json";

// 请求拦截器，内部根据返回值，重新组装，统一管理。
axios.interceptors.response.use(
  (res) => {
    if (res.status != 200) {
      ElMessage.error("服务端异常！");
    }
    return res.data;
  },
  (error) => {
    if (error.response.data.detail == "login invalid" && error.response.status === 400) {
      // 处理未授权
      console.error("Unauthorized:", error);
      router.push("/login");
    } else {
      // 处理其他错误
      ElMessage.error(error.response.data.detail);
      return Promise.reject(error);
    }
  }
);

export default axios;
