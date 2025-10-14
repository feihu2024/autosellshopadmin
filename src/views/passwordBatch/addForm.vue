<template>
  <div>
    <el-dialog v-model="showPop" title="新增" width="500" @close="handleClose">
      <el-form :model="formEdit" label-width="180px">
        <el-form-item label="批次id">
          <el-select style="width:100%;" v-model="formEdit.pc_id" clearable @change="changeId">
            <el-option v-for="(item, index) in dataList" :key="index" :value="item.id"
              :label="item.pc_name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次数量">
          <el-input type="number" v-model="formEdit.pc_num" disabled />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker style="width:100%;" value-format="YYYY-MM-DD HH:mm:ss" v-model="formEdit.endtime"
            type="datetime" placeholder="请选择" disabled />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showPop = false">取消</el-button>
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

const dataList = ref([]);
const showPop = ref(false)
const emit = defineEmits(['close-modal', 'getList']);
const formEdit = ref({
  pc_num: '',   //     '批次数量')
  pc_id: '',   //        '批次id(不可重复)')
  endtime: '',   //        '结束时间')
})

const open = () => {
  showPop.value = true
  getList()
}

const handleSure = () => {
  formEdit.value.pc_num = Number(formEdit.value.pc_num)
  axios.post("/autoselladmin/manage/bag_pas/create", formEdit.value).then((res) => {
    ElMessage.success('操作成功')
    showPop.value = false
    emit('getList');
  });
}

const getList = () => {
  axios.get("/autoselladmin/manage/bag_cagegory/filter", {
    params: {
      page: 1,
      page_size: 100
    }
  }).then(res => {
    dataList.value = res.data
  })
}

const changeId = (e) => {
  console.log(e);
  for (const i of dataList.value) {
    if (i.id == e) {
      formEdit.value.pc_num = i.pc_num
      formEdit.value.endtime = i.endtime
    }
  }
}

defineExpose({
  open
})

</script>