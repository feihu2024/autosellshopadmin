<template>
  <div>
    <el-card class="good-container">
      <template #header>
        <div class="header">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="期id">
              <el-input v-model="queryForm.s_date_num" placeholder="请输入期id" clearable />
            </el-form-item>
            <el-form-item label="id">
              <el-input v-model="queryForm.s_users" placeholder="请输入当前达标人" clearable />
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getList">搜索</el-button>
              <!-- <el-button type="primary" @click="handleRecord">资金记录</el-button> -->
              <el-button type="primary" @click="updateMoney">更新资金池分润预测金额</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <el-table :data="dataList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="date_num" label="期id"></el-table-column>
        <el-table-column prop="balance" label="当前金额"></el-table-column>
        <el-table-column prop="run_balance" label="结算金额"></el-table-column>
        <el-table-column prop="endtime" label="结束时间"></el-table-column>
        <el-table-column prop="users" label="当前达标人"></el-table-column>
        <el-table-column label="状态" width="160">
          <template #default="scope">
            <span v-if="scope.row.stat == 0">待结算</span>
            <span v-if="scope.row.stat == 1">已结算</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px" @click="binding(scope.row)">详情</a>
            <a style="cursor: pointer; margin-right: 10px" @click="handleRecord(scope.row)">资金记录</a>
            <a style="cursor: pointer; margin-right: 10px" @click="updateData(scope.row)">更新资金池</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="total"
        :page-size="queryForm.page_size" :current-page="queryForm.page" @current-change="changePage"
        @size-change="sizeChange" />

    </el-card>

    <Detail ref="detailRef" @success="getList" />
    <Record ref="recordRef" @success="getList" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import Detail from './detail.vue'
import Record from './record.vue'

const dataList = ref([])
const total = ref(0)
const detailRef = ref()
const queryForm = ref({
  s_date_num: '',
  s_users: '',
  page: 1,
  page_size: 20
})
const recordRef = ref()

onMounted(() => {
  getList()
})

function changePage(val) {
  queryForm.value.page = val
  getList();
}


function sizeChange(val) {
  queryForm.value.page_size = val
  getList();
}


function filterEmptyFields(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] != null && obj[key] !== '') {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

const getList = () => {
  axios.get("/autoselladmin/manage/fund_pond/filter", { params: filterEmptyFields(queryForm.value) }).then(res => {
    dataList.value = res.data
    total.value = res.total
  })
}

function updateData(row) {
  axios.get("/autoselladmin/manage/fund_pond/run/users", { params: { fund_id: row.id } }).then(res => {
    ElMessage.success('操作成功')
    getList()
  })
}

function updateMoney() {
  axios.get("/autoselladmin/manage/fund_pond/prop/fund", {}).then(res => {
    ElMessage.success('操作成功')
    getList()
  })
}

function binding(row) {
  detailRef.value.open(row)
}

function handleRecord(row) {
  recordRef.value.open(row)
}

</script>