<template>
  <div>
    <el-card class="good-container">
      <template #header>
        <div class="header">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="批次名称">
              <el-input v-model="queryForm.pc_name" placeholder="请输入名称" clearable />
            </el-form-item>
            <el-form-item label="id">
              <el-input v-model="queryForm.id" placeholder="请输入名称" clearable />
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getList">搜索</el-button>
              <el-button type="primary" :icon="Plus" @click="handleAdd">添加批次</el-button>
              <el-button type="primary" :icon="Plus" @click="handleEdit">生成卡密</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <el-table :data="dataList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="pc_name" label="批次名称"></el-table-column>
        <el-table-column prop="pc_num" label="卡密数量"></el-table-column>
        <el-table-column prop="endtime" label="结束时间">
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px" @click="binding(scope.row)">卡密列表</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="total"
        :page-size="queryForm.page_size" :current-page="queryForm.page" @current-change="changePage"
        @size-change="sizeChange" />

    </el-card>

    <Add ref="addRef" @success="getList" />
    <AddForm ref="addFormRef" @getList="getList"></AddForm>
    <ListBatch ref="listBatchRef" @getList="getList"></ListBatch>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import Add from './add.vue'
import AddForm from './addForm.vue'
import ListBatch from './listBatch.vue'

const dataList = ref([])
const total = ref(0)
const addRef = ref()
const addFormRef = ref()
const listBatchRef = ref()
const queryForm = ref({
  pc_name: '',
  tuan_id: '',
  page: 1,
  page_size: 20
})


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
  axios.get("/autoselladmin/manage/bag_cagegory/filter", { params: filterEmptyFields(queryForm.value) }).then(res => {
    dataList.value = res.data
    total.value = res.total
  })
}

const handleAdd = () => {
  addRef.value.open();
}


function handleEdit() {
  addFormRef.value.open()
}

function binding(row) {
  listBatchRef.value.open(row)
}

</script>