<template>
  <div>
    <el-dialog v-model="dialogVisible" title="资金列表" width="90%">
      <el-descriptions class="margin-top" title="" :column="3" :size="size" border>
        <template #extra>
          <el-button type="primary" @click="config">手动执行</el-button>
        </template>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              期id
            </div>
          </template>
          {{ detailObj.id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              区域当前人数
            </div>
          </template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              当前达标人数
            </div>
          </template>

        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              当前资金池额度
            </div>
          </template>
          {{ detailObj.balance / 100 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              执行金额额度
            </div>
          </template>

        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              执行金额额度
            </div>
          </template>

        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              执行日期
            </div>
          </template>
          {{ detailObj.users_time }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              执行状态
            </div>
          </template>
          <span v-if="detailObj.stat == 0">待结算</span>
          <span v-if="detailObj.stat == 1">已结算</span>
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="dataList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="user_id" label="用户"></el-table-column>
        <el-table-column prop="user_phone" label="用户电话"></el-table-column>
        <el-table-column prop="weight" label="用户权重"></el-table-column>
        <el-table-column prop="all_balance" label="执行金额"></el-table-column>
        <el-table-column prop="users" label="状态"></el-table-column>
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
const detailObj = ref({})
const rowData = ref()
const queryForm = ref({
  page: 1,
  page_size: 20
})

/** 打开弹窗 */
const open = async (row) => {
  rowData.value = row
  getDetail(row.id)
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

const getDetail = (id) => {
  axios.get("/autoselladmin/manage/fund_pond/get", { params: { fund_pond_id: id } }).then(res => {
    console.log(res);
    detailObj.value = res;
  })
}

const getList = () => {
  axios.get("/autoselladmin/manage/fund_weight_log/filter", { params: queryForm.value }).then(res => {
    dataList.value = res.data
    total.value = res.total
  })
}

const config = () => {
  axios.get("/autoselladmin/manage/fund_pond/run", { params: { fund_id: rowData.value.id } }).then(res => {
    ElMessage.success('执行成功')
  })
}

defineExpose({ open }); // 提供 open 方法，用于打开弹窗

</script>