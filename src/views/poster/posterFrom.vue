<template>
  <el-dialog v-model="props.open" title="新增海报" width="50%" @close="handleClose">
    <el-form :model="form" label-width="auto" :rules="form.rules" ref="formRef">
      <el-form-item label="海报" required prop="image">
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

      <el-form-item label="描述" required prop="image">
        <el-input v-model="form.description" :rows="2" type="textarea" placeholder="请输入" />
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
  description: '',
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

const handleUrlSuccess2 = (response) => {
  let url = "https://mlcfjihuaqn.yxiaozhu.com/" + response.key;
  axios.get("/assets/qiniu_httpurl?httpurl=" + url).then((data) => {
    form.value.image = data;
  });
};

const emit = defineEmits(['closeModal', 'getList']);
const handleSure = () => {
  const url = props.type == 'edit' ? '/autoselladmin/manage/banner_update' : '/autoselladmin/manage/poster_create'
  // const url = '/autoselladmin/manage/banner_create'
  formRef.value.validate((vaild) => {
    if (vaild) {
      let params = {
        poster_url: form.value.image,
        description: form.value.description,
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

onMounted(() => {
  if (props.type == 'edit') {
    let obj = props.bannerInput
    form.value.image = obj.image
    form.value.id = obj.id
    form.value.title = obj.title
    form.value.subtitle = obj.subtitle
    form.value.ban_label = obj.ban_label
  }
})

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