<template>
  <el-dialog v-model="dialogVisible" title="提现" width="40%">
    <el-form :model="form" label-width="auto" ref="formRef">
      <el-form-item label="用户id">
        <el-input v-model="form.user_id" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type_id" class="ml-4">
          <el-radio label="1" size="large">银行卡</el-radio>
          <el-radio label="2" size="large">微信零钱</el-radio>
          <el-radio label="3" size="large">支付宝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.type_id == 1" label="银行卡号">
        <el-input v-model="form.user_bank_id" autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="form.type_id == 3" label="支付宝">
        <el-input v-model="form.user_bank_id" autocomplete="off" />
      </el-form-item>
      <el-form-item label="金额(元)">
        <el-input v-model="form.amount" type="number" autocomplete="off" />
      </el-form-item>
      <el-form-item label="扣费类型">
        <el-radio-group v-model="form.fee_type" class="ml-4">
          <el-radio label="1" size="large">扣费推荐余额</el-radio>
          <el-radio label="2" size="large">扣费余额</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.user_bank_other" type="textarea" autocomplete="off" />
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
</template>

<script setup>
import axios from "@/utils/axios";
import { defineExpose, ref } from "vue";
import { ElMessage } from "element-plus";
const dialogVisible = ref(false)
const form = ref({
  type_id: '2'
})
const flag = ref(false)
const open = () => {
  dialogVisible.value = true
}

function handleSure() {
  if (form.value.amount < 100 || form.value.amount > 500) {
    ElMessage.error('提现金额在100~500之间');
    return
  }
  if (!flag.value) {
    flag.value = true
    form.value.amount = form.value.amount * 100
    axios
      .post("/autoselladmin/balance/commit_withdraw", form.value)
      .then((res) => {
        console.log(res);
        ElMessage.success('操作成功');
        dialogVisible.value = false;
      }).catch(e => {
        flag.value = false
        ElMessage.error('请联系管理员');
        form.value.amount = form.value.amount / 100
      })
  }
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped></style>