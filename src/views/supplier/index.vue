<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="id">
              <el-input v-model="query.id" placeholder="请输入ID" clearable />
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="query.phone" placeholder="请输入手机" clearable />
            </el-form-item>
            <el-form-item label="供应商呢称">
              <el-input v-model="query.name" placeholder="请输入供应商呢称" clearable />
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getGoodList">搜索</el-button>
              <el-button type="primary" :icon="Plus" @click="handleAdd">供应商注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <div></div>
    <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="id" label="id">
        <template #default="scope">
          <span>{{ scope.row.SSupplierOwner.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户手机号">
        <template #default="scope">
          <span>{{ scope.row.SSupplierOwner.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="供应商名称">
        <template #default="scope">
          <span>{{ scope.row.SSupplier.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="供应商联系方式">
        <template #default="scope">
          <span>{{ scope.row.SSupplier.phone }}</span>
        </template> </el-table-column>
      <el-table-column prop="licensse4" label="备注">
        <template #default="scope">
          <span>{{ scope.row.SSupplier.licensse4 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handlePriority(scope.row)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <!--总数超过一页，再展示分页器-->
    <el-pagination background layout="prev, pager, next" :total="state.total" :page-size="state.pageSize"
      :current-page="state.currentPage" @current-change="changePage" />

    <register ref="registerRef" @getList="getGoodList"></register>
    <edit ref="editRef" @getList="getGoodList"></edit>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance, ref } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import register from './register.vue'
import edit from './edit.vue'

const app = getCurrentInstance();
const { goTop } = app.appContext.config.globalProperties;
const router = useRouter();
const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
});
const query = reactive({
  id: '',
  phone: '',
  name: ''
});
const registerRef = ref()
const editRef = ref()


onMounted(() => {
  getGoodList();
});
// 获取列表
const getGoodList = () => {
  state.loading = true;
  let data = {
    page: state.currentPage,
    page_size: state.pageSize,
    id: query.id,
    phone: query.phone,
    name: query.name,
  }
  axios
    .post("/autoselladmin/manage/supplier/getlist", {
      data
    })
    .then((res) => {
      state.tableData = res.data;
      state.total = res.total;
      state.loading = false;
      goTop && goTop();
    });
};
const handleAdd = () => {
  registerRef.value.open()
};

const changePage = (val) => {
  state.currentPage = val;
  getGoodList();
};

function handlePriority(row) {
  editRef.value.open(row)
}

</script>

<style scoped>
.good-container {
  min-height: 100%;
}

.el-card.is-always-shadow {
  min-height: 100% !important;
}
</style>