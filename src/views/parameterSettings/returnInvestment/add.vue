<template>
  <el-dialog :title="dialogTitle" width="50%" v-model="dialogVisible" :close-on-click-modal="false" v-loadind="loading">
    <el-form :model="form" label-width="180px">
      <el-form-item label="礼包图片" required prop="image">
        <div v-show="form.bag_pic != ''" class="main-box">
          <img :key="index" :src="form.bag_pic" style="width: 100%; height: 100%" />
          <el-icon class="del" @click="delImg()">
            <CircleCloseFilled />
          </el-icon>
        </div>
        <el-upload ref="upload2" v-show="form.bag_pic == ''" :action="uploadURL" :data="dataToken"
          accept=".jpg,.jpeg,.png" :show-file-list="false" :limit="5" :auto-upload="false"
          :on-change="(file) => handleBeforeUpload(file)" :on-success="handleUrlSuccess2">
          <el-icon class="avatar-uploader-icon2">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="礼包名称">
        <el-input type="text" v-model="form.bag_name" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input type="number" v-model="form.price_total" />
      </el-form-item>
      <el-form-item label="直推金额(元)">
        <el-input type="number" v-model="form.invited_money" />
      </el-form-item>
      <el-form-item label="每层复购金额(元)">
        <el-input type="number" v-model="form.layer_every" />
      </el-form-item>
      <el-form-item label="复购层数（含直推）">
        <el-input type="number" v-model="form.layer_num" />
      </el-form-item>
      <el-form-item label="给兑换券数">
        <el-input type="number" v-model="form.grant_num" />
      </el-form-item>
      <el-form-item label="归集初级资金池额度">
        <el-input type="number" v-model="form.fund_one" />
      </el-form-item>
      <el-form-item label="归集高级资金池额度">
        <el-input type="number" v-model="form.fund_two" />
      </el-form-item>
      <el-form-item label="归集顶级资金池额度">
        <el-input type="number" v-model="form.fund_three" />
      </el-form-item>
      <el-form-item label="礼包介绍">
        <!-- <el-input :rows="2" type="textarea" v-model="form.bag_cont" /> -->
        <div ref="editor"></div>
      </el-form-item>
    </el-form>

    <div style="display: flex;justify-content: center;margin: 40px 0;">
      <el-button type="primary" @click="save(item)">保存</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
import axios from '@/utils/axios'
import { ElMessage } from "element-plus";
import WangEditor from "wangeditor";
import { localGet, uploadImgServer, uploadImgsServer } from "@/utils";
let instance;
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({
  "bag_name": "",
  "price_total": '',
  "invited_money": '',
  "layer_every": '',
  "layer_num": '',
  "grant_num": '',
  "bag_cont": "",
  bag_pic: '',
  fund_one: '',
  fund_two: '',
  fund_three: ''
})
const upload2 = ref(null)
const loading = ref(false)
const uploadURL = ref("https://up-z1.qiniup.com");
const dataToken = ref({
  token: "",
  key: "",
});
const editor = ref(null);
const open = (row) => {
  if (row) {
    dialogTitle.value = '编辑'
    form.value = JSON.parse(JSON.stringify(row))
    form.value.price_total = Number(form.value.price_total) / 100
    form.value.invited_money = Number(form.value.invited_money) / 100
    form.value.layer_every = Number(form.value.layer_every) / 100
    form.value.grant_num = Number(form.value.grant_num) / 100
    form.value.fund_one = Number(form.value.fund_one) / 100
    form.value.fund_two = Number(form.value.fund_two) / 100
    form.value.fund_three = Number(form.value.fund_three) / 100
  } else {
    dialogTitle.value = '新增'
    form.value = {
      "bag_name": "",
      "price_total": '',
      "invited_money": '',
      "layer_every": '',
      "layer_num": '',
      "grant_num": '',
      "bag_cont": "",
      bag_pic: ''
    }
  }
  dialogVisible.value = true;


  setTimeout(() => {
    if (!instance) {
      instance = new WangEditor(editor.value);
      instance.config.showLinkImg = false;
      instance.config.showLinkImgAlt = false;
      instance.config.showLinkImgHref = false;
      instance.config.uploadImgMaxSize = 2 * 1024 * 1024; // 2M
      instance.config.uploadFileName = "file";
      instance.config.uploadImgHeaders = {
        jinnengyuansession: localGet("jinnengyuansession"),
      };
      // 图片返回格式不同，需要自定义返回格式
      instance.config.uploadImgHooks = {
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert: function (insertImgFn, result) {
          let res = JSON.parse(result);
          // result 即服务端返回的接口
          // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
          // if (result.data && result.data.length) {
          //   result.data.forEach((item) => insertImgFn(item));
          // }

          axios.get("/assets/qiniu_httpurl?httpurl=" + 'https://mlcfjihuaqn.yxiaozhu.com/' + res.key).then((data) => {
            // specificationArea[img_index.value].image = data;
            insertImgFn(data)
          });
        },
      };
      instance.config.uploadImgServer = uploadImgsServer;
      Object.assign(instance.config, {
        onchange() {
          console.log("change");
        },
      });
      instance.create();

    }
  }, 100)

  setTimeout(() => {
    if (dialogTitle.value == '编辑') {
      instance.txt.html(form.value.bag_cont);
    } else {
      instance.txt.html('');
    }
  }, 500)
}

function delImg() {
  form.value.bag_pic = '';
}

const handleBeforeUpload = async (file) => {
  let params = {
    filename: file.name,
  };
  const res = await axios.get("/assets/qiniu_token", { params: params });
  dataToken.value.token = res.token;
  dataToken.value.key = res.fname;
  upload2.value.submit();
};

const handleUrlSuccess2 = (response) => {
  let url = "https://mlcfjihuaqn.yxiaozhu.com/" + response.key;
  axios.get("/assets/qiniu_httpurl?httpurl=" + url).then((data) => {
    form.value.bag_pic = data;
  });
};

const emits = defineEmits(['success']);
const save = () => {
  loading.value = true
  let url = '';
  if (dialogTitle.value == '编辑') {
    url = 'autoselladmin/manage/bigorder_initbag/update'
  } else {
    url = 'autoselladmin/manage/bigorder_initbag/create'
  }
  form.value.price_total = Number(form.value.price_total) * 100
  form.value.invited_money = Number(form.value.invited_money) * 100
  form.value.layer_every = Number(form.value.layer_every) * 100
  form.value.grant_num = Number(form.value.grant_num) * 100
  form.value.fund_one = Number(form.value.fund_one) * 100
  form.value.fund_two = Number(form.value.fund_two) * 100
  form.value.fund_three = Number(form.value.fund_three) * 100

  form.value.bag_cont = instance.txt.html()
  axios.post(url, form.value).then(() => {
    loading.value = false
    ElMessage.success('操作成功')
    dialogVisible.value = false;
    emits('success');
  }).catch(e => {
    form.value.price_total = Number(form.value.price_total) / 100
    form.value.invited_money = Number(form.value.invited_money) / 100
    form.value.layer_every = Number(form.value.layer_every) / 100
    form.value.grant_num = Number(form.value.grant_num) / 100
    form.value.fund_one = Number(form.value.fund_one) / 100
    form.value.fund_two = Number(form.value.fund_two) / 100
    form.value.fund_three = Number(form.value.fund_three) / 100
    loading.value = false
    ElMessage.error('网络错误')
  })
}

defineExpose({ open }); // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
  color: #ddd;
  font-size: 30px;
}

.avatar-uploader-icon {
  display: block;
  width: 100%;
  border: 1px solid #e9e9e9;
  padding: 32px 17px;
  text-align: center;
}

.avatar-uploader-icon2 {
  width: 100px;
  height: 100px;
  border: 1px solid #e9e9e9;
  font-size: 30px;
  color: #ddd;
}

.del {
  position: absolute;
  right: 0;
  top: 0;
  color: red;
  font-size: 30px;
  cursor: pointer;
}

:deep(.el-upload) {
  width: 100%;
  height: 100%;
}
</style>