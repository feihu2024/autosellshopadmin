<template>
  <div>
    <el-dialog v-model="dialogVisible" title="资金列表" width="90%">
      <el-table :data="dataList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="add_balance" label="增加金额"></el-table-column>
        <el-table-column prop="all_balance" label="资金余额"></el-table-column>
        <el-table-column prop="register_time" label="创建时间"></el-table-column>
        <el-table-column prop="source_cont" label="类型"></el-table-column>
        <el-table-column prop="source_id" label="来源商品id"></el-table-column>
      </el-table>
      <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="total"
        :page-size="queryForm.page_size" :current-page="queryForm.page" @current-change="changePage"
        @size-change="sizeChange" />
    </el-dialog>
  </div>

</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, reactive } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false)
const dataList = ref([])
const total = ref()
const queryForm = ref({
  page: 1,
  page_size: 20,
  l_id: null
})

/** 打开弹窗 */
const open = async (row) => {
  queryForm.value.l_id = row.id
  getList()
  dialogVisible.value = true;
};

function changePage(val) {
  queryForm.value.page = val
  getList();
}


function sizeChange(val) {
  queryForm.value.page_size = val
  getList();
}


const getList = () => {
  axios.get("/autoselladmin/manage/fund_pond_log/filter", { params: queryForm.value }).then(res => {
    dataList.value = res.data
    total.value = res.total
  })
}

defineExpose({ open }); // 提供 open 方法，用于打开弹窗

</script>