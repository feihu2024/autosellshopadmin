<template>
  <div>
    <el-dialog v-model="showPop" title="修改订单备注" width="500" @close="handleClose">
      <div>
        <el-form :model="formEdit" label-width="auto" ref="editRef">
          <el-form-item label="备注" prop="detail">
            <el-input type="textarea" :rows="6" v-model="formEdit.detail" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSure">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, defineExpose } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";

const editRef = ref(null);
const showPop = ref(false)
const emit = defineEmits(['close-modal', 'getList']);
const formEdit = ref({
  detail: '',
  order_id: ''
})

const open = (row) => {
  console.log(row);
  
  showPop.value = true
  formEdit.value.detail = row.s_Order.detail_tut
  formEdit.value.order_id = row.s_Order.id
}

const handleSure = () => {
  axios.post("/autoselladmin/manage/order/update_detail_tut", formEdit.value).then((res) => {
    ElMessage.success('操作成功')
    showPop.value = false
    emit('getList');
  });

}

const handleCancel = () => {
  showPop.value = false
}



defineExpose({
  open
})

</script>