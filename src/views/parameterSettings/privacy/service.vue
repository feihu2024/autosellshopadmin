<template>
  <div>
    <div ref="editor"></div>
    <div style="display: flex;justify-content: center;margin-top: 30px;">
      <el-button type="primary" @click="submitAdd()">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
} from "vue";
import WangEditor from "wangeditor";
import axios from "@/utils/axios";
import { localGet } from "@/utils";
import { ElMessage } from 'element-plus'
const editor = ref(null);
let instance;
onMounted(() => {
  instance = new WangEditor(editor.value);
  instance.config.showLinkImg = false;
  instance.config.showLinkImgAlt = false;
  instance.config.showLinkImgHref = false;
  instance.config.uploadImgMaxSize = 2 * 1024 * 1024; // 2M
  instance.config.uploadFileName = "file";
  // 图片返回格式不同，需要自定义返回格式
  instance.config.uploadImgHooks = {
    before: async function (xhr, editor, files) {
      let params = {
        filename: files[0].name,
        type: 'product',
      };
      const res = await axios.get("/assets/qiniu_token", { params: params });
      dataToken.value.token = res.token;
      dataToken.value.key = res.fname;
      return true;
    },
    // 图片上传并返回了结果，想要自己把图片插入到编辑器中
    // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
    customInsert: function (insertImgFn, result) {
      console.log("result", result);
      // result 即服务端返回的接口
      // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
      if (result.data && result.data.length) {
        result.data.forEach((item) => insertImgFn(item));
      }
    },
  };
  Object.assign(instance.config, {
    onchange() {
      console.log("change");
    },
  });
  instance.create();

  getDetail();
});
onBeforeUnmount(() => {
  instance.destroy();
  instance = null;
});

function getDetail() {
  axios
    .get("/autoselladmin/manage/getself", {})
    .then((res) => {
      if (res.law) {
        instance.txt.html(res.law);
      }
    });
}
function submitAdd() {
  let userInfo = localGet("userInfo")
  let data = {
    "create_time": new Date().getTime(),
    "admin_id": userInfo.admin_id,
    "law": instance.txt.html(),
    "privacy": "null",
    "purchase": "null",
    "flash_law": "null",
    "withdraw_law": "null",
    "id": userInfo.id
  }
  axios
    .post("/autoselladmin/manage/modify_platform_self", data)
    .then((res) => {
      console.log(res);
      ElMessage.success('操作成功')
    });
}
</script>

<style scoped></style>