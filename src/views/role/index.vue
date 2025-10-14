<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="id">
              <el-input v-model="query.id" placeholder="请输入id" clearable />
            </el-form-item>
            <el-form-item label="登录电话 ">
              <el-input v-model="query.phone" placeholder="登录电话" clearable />
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getList">搜索</el-button>
              <el-button type="primary" @click="add">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>

    <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="username" label="登录账号"> </el-table-column>
      <el-table-column prop="phone" label="电话"> </el-table-column>
      <el-table-column prop="user_info" label="备注信息"> </el-table-column>
      <el-table-column prop="register_time" label="创建时间" width="160"> </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="edit(scope.row)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="state.total"
      :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage"
      @size-change="sizeChange" />

    <add-pop ref='addPop' :type="state.type" @getList="getList" />
  </el-card>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import axios from "@/utils/axios";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import AddPop from './add.vue'

const router = useRouter()
const addPop = ref()
const query = reactive({
  id: null,
  phone: null
})
const state = reactive({
  loading: false,
  type: '',
  tableData: [

  ], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
})



// 获取列表
const getList = () => {
  if (!query.id) {
    query.id = null
  }
  if (!query.phone) {
    query.phone = null
  }
  let params = {
    page: state.currentPage,
    page_size: state.pageSize,
    id: query.id,
    phone: query.phone,
  }
  axios
    .get("/autoselladmin/manage/admin_filter", {
      params
    })
    .then((res) => {
      console.log(res);
      state.tableData = res.data;
      state.total = res.total;
    });
};

function changePage(val) {
  state.currentPage = val
  getList();
}


function sizeChange(val) {
  state.pageSize = val
  getList();
}

function add() {
  state.type = 'add'
  addPop.value.open()
}

const edit = (row) => {
  state.type = 'edit'
  addPop.value.open(row)
}

onMounted(() => {
  getList();
});

</script>

<style scoped>
.good-container {
  min-height: 100%;
}
</style>