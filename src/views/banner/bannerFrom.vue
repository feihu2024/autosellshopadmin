<template>
  <el-dialog v-model="props.open" title="banner修改" width="50%" @close="handleClose">
    <el-form :model="form" label-width="auto" :rules="form.rules" ref="formRef">
      <el-form-item label="标题" required prop="title">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="封面" required prop="image">
        <div v-if="form.image != ''" class="main-box">
          <img :key="index" :src="form.image" style="width: 100%; height: 100%" />
          <el-icon class="del" @click="delImg()">
            <CircleCloseFilled />
          </el-icon>
        </div>
        <el-upload ref="upload2" v-else :action="uploadURL" :data="dataToken" accept=".jpg,.jpeg,.png"
          :show-file-list="false" :limit="5" :auto-upload="false" :on-change="(file) => handleBeforeUpload(file)"
          :on-success="handleUrlSuccess2">
          <el-icon class="avatar-uploader-icon2">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="正文">
        <div ref="editor"></div>
      </el-form-item>
      <el-form-item label="开关">
        <el-switch v-model="ba_stat" :active-value="0" :inactive-value="1" active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="视频">
        <div v-if="form.subtitle != ''" class="main-box" style="width: 200px;height: 200px;">
          <video controls :src="form.subtitle" style="width: 100%; height: 100%" />
          <el-icon class="del" @click="delImg()">
            <CircleCloseFilled />
          </el-icon>
        </div>
        <el-upload ref="upload3" v-else :action="uploadURL" :data="dataToken" accept=".mp4" :show-file-list="false"
          :limit="5" :auto-upload="false" :on-change="(file) => handleBeforeUpload3(file)"
          :on-success="handleUrlSuccess3">
          <el-icon class="avatar-uploader-icon2">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSure">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import WangEditor from "wangeditor";
import { useRoute, useRouter } from "vue-router";
import { localGet, uploadImgServer, uploadImgsServer } from "@/utils";


const formRef = ref(null);
const upload2 = ref(null);
const upload3 = ref(null);
const uploadURL = ref("https://up-z1.qiniup.com");
const dataToken = ref({
  token: "",
  key: "",
});
const form = ref({
  image: '',
  title: '',
  subtitle: '',
  ban_label: '',
  rules: {
    title: [
      { required: "true", message: "请填写标题", trigger: ["change"] },
    ],
    subtitle: [
      { required: "true", message: "请填写副标题", trigger: ["change"] },
    ],
    ban_label: [
      { required: "true", message: "请填写标签", trigger: ["change"] },
    ],
    image: [
      { required: "true", message: "请上传图片", trigger: ["change"] },
    ],
  },
})
const editor = ref(null);
const ba_stat = ref(0)
const props = defineProps({     //接收父组件传过来的参数
  open: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
  },
  bannerInput: {
    type: Object,
  }
})
function delImg() {
  form.value.image = '';
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
const handleBeforeUpload3 = async (file) => {
  let params = {
    filename: file.name,
  };
  const res = await axios.get("/assets/qiniu_token", { params: params });
  dataToken.value.token = res.token;
  dataToken.value.key = res.fname;
  upload3.value.submit();
};
const handleUrlSuccess2 = (response) => {
  let url = "https://mlcfjihuaqn.yxiaozhu.com/" + response.key;
  axios.get("/assets/qiniu_httpurl?httpurl=" + url).then((data) => {
    form.value.image = data;
  });
};
const handleUrlSuccess3 = (response) => {
  let url = "https://mlcfjihuaqn.yxiaozhu.com/" + response.key;
  axios.get("/assets/qiniu_httpurl?httpurl=" + url).then((data) => {
    form.value.subtitle = data;
  });
};
const emit = defineEmits(['closeModal', 'getList']);
const handleSure = () => {
  const url = props.type == 'edit' ? '/autoselladmin/manage/banner_update' : '/autoselladmin/manage/banner_create'
  // const url = '/autoselladmin/manage/banner_create'
  formRef.value.validate((vaild) => {
    if (vaild) {
      let params = {
        image: form.value.image,
        title: form.value.title,
        subtitle: form.value.subtitle,
        type_id: 0,
        description: instance.txt.html(),
        ba_stat: ba_stat.value,
        "create_time": new Date().getTime(),
      }
      if (props.type == 'edit') {
        params.id = form.value.id
      }
      axios.post(url, params).then((res) => {
        console.log(res);
        ElMessage.success(props.type == 'edit' ? "修改成功" : "添加成功");
        emit('closeModal');
        emit('getList');
      })
    }
  });
}
const handleCancel = () => {
  emit('closeModal')
}
const handleClose = () => {
  emit('closeModal');
}


let instance;
onMounted(() => {
  if (props.type == 'edit') {
    let obj = props.bannerInput
    console.log(props);

    form.value.image = obj.image
    form.value.id = obj.id
    form.value.title = obj.title
    form.value.subtitle = obj.subtitle
    form.value.ban_label = obj.ban_label
  }


  setTimeout(() => {
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
  }, 100)



})

onBeforeUnmount(() => {
  instance.destroy();
  instance = null;
});

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