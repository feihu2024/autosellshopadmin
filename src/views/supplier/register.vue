<template>
  <el-dialog title="供应商注册" v-model="state.visible" width="50%">
    <el-form :model="state.ruleForm" :rules="state.rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="用户手机" prop="phone">
        <el-input type="number" v-model="state.ruleForm.phone" placeholder="用户手机"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="state.ruleForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="推荐人id">
        <el-input type="recommender_id" v-model="state.ruleForm.recommender_id" placeholder="推荐人id"></el-input>
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

const formRef = ref(null)
const state = reactive({
  visible: false,
  ruleForm: {
    username: '',
    phone: '',
    recommender_id: ''
  },
  rules: {
    phone: [
      { required: 'true', message: '手机号不能为空', trigger: ['change', 'blue'] }
    ],
    password: [
      { required: 'true', message: '密码不能为空', trigger: ['change', 'blue'] }
    ],
  },
  id: ''
})

// 开启弹窗
const open = () => {
  state.visible = true
  if (formRef.value) {
    formRef.value.resetFields();
  }
}

const emit = defineEmits(['getList']);
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      axios
        .post("/autoselladmin/manage/supplier/register_next",
          state.ruleForm
        )
        .then((res) => {
          ElMessage({
            type: "success",
            message: "操作成功!",
          });
          close();
          emit('getList')
        });
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}

// 关闭弹窗
const close = () => {
  state.visible = false
}
defineExpose({ open, close })

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