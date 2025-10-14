<template>
  <el-dialog title="供应商修改" v-model="state.visible" width="50%">
    <el-form :model="state.ruleForm" :rules="state.rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="商家名称" prop="name">
        <el-input type="text" v-model="state.ruleForm.SSupplier.name" placeholder="商家名称"></el-input>
      </el-form-item>
      <el-form-item label="商家电话" prop="phone">
        <el-input type="number" v-model="state.ruleForm.SSupplier.phone" placeholder="商家电话"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="license4">
        <el-input type="textarea" v-model="state.ruleForm.SSupplier.license4" placeholder="商家名称"></el-input>
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

const props = defineProps({
  type: String, // 用于判断是添加还是编辑
  reload: Function // 添加或修改完后，刷新列表页
})

const formRef = ref(null)
const state = reactive({
  visible: false,
  ruleForm: {
    name: '',
    phone: '',
    license4: '',
    id: ''
  },
  rules: {
    name: [
      { required: 'true', message: '商家名称不能为空', trigger: ['change', 'blue'] }
    ],
    phone: [
      { required: 'true', message: '商家电话不能为空', trigger: ['change', 'blue'] }
    ],
  },
  id: ''
})


// 开启弹窗
const open = (row) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));
  state.visible = true
}

const emit = defineEmits(['getList']);
const submitForm = () => {
  let params = {
    SSupplier: state.ruleForm.SSupplier,
    SSupplierOwner: state.ruleForm.SSupplierOwner,
  }
  axios
    .post("/autoselladmin/manage/supplier/register_sure",
      params
    )
    .then((res) => {
      ElMessage({
        type: "success",
        message: "操作成功!",
      });
      close();
      emit('getList')
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