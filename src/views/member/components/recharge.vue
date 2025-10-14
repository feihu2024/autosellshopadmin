<template>
  <div>
    <el-dialog v-model="dialogVisible" title="充值" width="40%">
      <el-form :model="form" label-width="auto" ref="formRef">
        <el-form-item label="用户id(多个用,分隔)" required>
          <el-input v-model="form.user_ids" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" required>
          <!-- <el-input v-model="form.title" autocomplete="off" /> -->
          <el-radio-group v-model="form.type" class="ml-4">
            <el-radio label="1" size="large">余额</el-radio>
            <el-radio label="2" size="large">购物券</el-radio>
            <el-radio label="3" size="large">指定推荐人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量(元)" required v-if="form.type !== '3'">
          <el-input v-model="form.add_count" autocomplete="off" />
        </el-form-item>
        <el-form-item label="管理员id" required>
          <el-input v-model="form.manager_id" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="推荐人id" required>
          <el-input v-model="form.add_count" autocomplete="off" />
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
import { defineProps, defineEmits, ref, onMounted } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import { localGet } from "@/utils";

const dialogVisible = ref(false)
const form = ref({
  user_ids: '',
  type: '',
  add_count: '',
  manager_id: '',
})
const rules = ref({})

function handleSure() {
  if (!form.value.user_ids) {
    ElMessage.error('请输入用户id');
    return
  }
  if (!form.value.type) {
    ElMessage.error('请选择类型');
    return
  }
  if (!form.value.add_count) {
    ElMessage.error('请输入数量或推荐人id');
    return
  }
  if (form.value.type !== '3') {
    form.value.add_count = form.value.add_count * 100
  }

  axios
    .post("/autoselladmin/balance/update_user_balance", form.value)
    .then((res) => {
      console.log(res);
      ElMessage.success('操作成功');
      dialogVisible.value = false;
    });
}

/** 打开弹窗 */
const open = async () => {
  form.value = {
    user_ids: '',
    type: '',
    add_count: '',
    manager_id: '',
  }

  let userInfo = localGet("userInfo")
  form.value.manager_id = userInfo.id
  dialogVisible.value = true;
};

defineExpose({ open }); // 提供 open 方法，用于打开弹窗

</script>