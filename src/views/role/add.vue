<template>
  <el-dialog :title="props.type == 'add' ? '新增角色' : '修改角色'" v-model="state.visible" width="50%">
    <el-form :model="state.ruleForm" :rules="state.rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="用户头像" prop="name" required>
        <div v-if="state.cover_url" class="main-box">
          <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9" :src="state.cover_url" class="avatar" />
          <el-icon class="del" @click="delImg()">
            <CircleCloseFilled />
          </el-icon>
        </div>
        <el-upload ref="upload1" class="avatar-uploader" :action="uploadURL" :data="dataToken" :auto-upload="false"
          accept="jpg,jpeg,png" :limit="1" :show-file-list="false"
          :on-change="(file) => handleBeforeUpload(file, 'cover')" :on-success="handleUrlSuccess">
          <el-icon v-if="!state.cover_url" class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="登录账户" prop="username">
        <el-input type="text" v-model="state.ruleForm.username" placeholder="登录账户"></el-input>
      </el-form-item>
      <el-form-item label="用户手机" prop="phone">
        <el-input type="number" v-model="state.ruleForm.phone" placeholder="用户手机"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="state.ruleForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="text" v-model="state.ruleForm.user_info" placeholder="备注信息"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  type: String, // 用于判断是添加还是编辑
  reload: Function // 添加或修改完后，刷新列表页
})
const uploadURL = ref("https://up-z1.qiniup.com");
const dataToken = ref({
  token: "",
  key: "",
});
const formRef = ref(null)
const state = reactive({
  visible: false,
  categoryLevel: 1,
  parentId: 0,
  cover_url: '',
  ruleForm: {
    username: '',
    phone: '',
    password: '',
    user_info: ''
  },
  rules: {
    username: [
      { required: 'true', message: '账号不能为空', trigger: ['change', 'blue'] }
    ],
    phone: [
      { required: 'true', message: '手机号不能为空', trigger: ['change', 'blue'] }
    ],
    password: [
      { required: 'true', message: '密码不能为空', trigger: ['change', 'blue'] }
    ],
    rank: [
      { required: 'true', message: '编号不能为空', trigger: ['change', 'blue'] }
    ]
  },
  id: ''
})
const upload1 = ref(null);
const emit = defineEmits(['getList']);

const handleBeforeUpload = async (file, type) => {
  let params = {
    filename: file.name,
    type: type,
  };
  const res = await axios.get("/assets/qiniu_token", { params: params });
  dataToken.value.token = res.token;
  dataToken.value.key = res.fname;
  upload1.value.submit();
};

const handleUrlSuccess = (response) => {
  let url = "https://mlcfjihuaqn.yxiaozhu.com/" + response.key;
  axios.get("/assets/qiniu_httpurl?httpurl=" + url).then((data) => {
    state.cover_url = data;
    upload1.value.clearFiles();
  });
};

function delImg() {
  state.cover_url = '';
}

function submitForm() {
  state.ruleForm.user_pic = state.cover_url;
  let url = props.type == 'add' ? '/autoselladmin/manage/admin_create' : '/autoselladmin/manage/admin_update'
  axios.post(url, state.ruleForm).then((data) => {
    close();
    emit('getList')
  });
}

// 开启弹窗
const open = (row) => {
  state.visible = true
  if (row) {
    state.ruleForm = JSON.parse(JSON.stringify(row))
    state.cover_url = state.ruleForm.user_pic
  } else {
    state.ruleForm = {
      username: '',
      phone: '',
      password: '',
      user_info: '',
      user_pic: ''
    }
    state.cover_url = ''
  }
}
// 关闭弹窗
const close = () => {
  state.visible = false
}
defineExpose({ open })

</script>

<style scoped lang="scss">
:deep(.el-upload) {
  width: 100%;
  height: 100%;
}

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

.main-box {
  display: flex;
  border: 1px solid #e9e9e9;
  margin-right: 8px;
  flex-shrink: 0;
  position: relative;
}

.del {
  position: absolute;
  right: 0;
  top: 0;
  color: red;
  font-size: 30px;
  cursor: pointer;
}
</style>