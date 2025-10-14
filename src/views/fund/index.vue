<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="用户id">
              <el-input v-model="query.id" placeholder="请输入用户id" clearable />
            </el-form-item>
            <el-form-item label="类别">
              <el-select v-model="query.type" style="width: 200px" placeholder="请选择" clearable>
                <el-option label="用户转账转出" value="用户转账转出" />
                <el-option label="商品购买" value="商品购买" />
              </el-select>
            </el-form-item>

            <el-form-item label="">
              <el-button type="primary" @click="getList">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>

    <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="type" label="记录"> </el-table-column>
      <el-table-column prop="change" label="金额">
        <template #default="scope">
          {{ scope.row.change / 100 }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const query = reactive({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  id:null,
  type:''
})
const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
})

onMounted(() => {
  getList()
})
const getList = () => {
  const data = {
    user_id: query.id == ''?'null': query.id,
    type: query.type,
    description: "",
    create_time: "",
    is_comein: 0,
    page: 1,
    page_size: 20
  }
  axios.post('/jnyuanadmin/balance/search_balance', data).then(res => {
    console.log(res);
    state.tableData = res.data
  })
}
</script>

<style scoped>
.good-container {
  min-height: 100%;
}
</style>