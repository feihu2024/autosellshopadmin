<template>
  <div>
    <el-dialog v-model="dialogVisible" title="卡密激活" width="400px">
      <el-form :model="form" label-width="auto" ref="formRef">
        <el-form-item label="卡密" required>
          <el-input v-model="form.pc_code" autocomplete="off" />
        </el-form-item>
        <el-form-item label="激活会员id" required>
          <el-input v-model="form.user_id" disabled autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSure">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, reactive } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false)
const form = ref({
  pc_code: '',
  user_id: ''
})
/** 打开弹窗 */
const open = async (id) => {
  form.value.user_id = id;
  dialogVisible.value = true;

};

function handleSure() {
  if (!form.value.pc_code) {
    ElMessage.error('请输入卡密')
    return
  }
  axios
    .post("/autoselladmin/manage/bag_pas/active", form.value)
    .then((res) => {
      ElMessage.success('操作成功');
      dialogVisible.value = false;
    }).catch(e => {
      ElMessage.error('请联系管理员');
    })
}

defineExpose({ open }); // 提供 open 方法，用于打开弹窗

</script>