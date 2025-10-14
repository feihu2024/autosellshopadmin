<template>
  <el-card class="good-container">
    <template #header>
      <!-- <div class="header">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label=""> -->
      <el-button type="primary" :icon="Plus" @click="handleAdd">添加</el-button>
      <!-- </el-form-item>
        </el-form>
      </div> -->
    </template>
    <div class="category_box">
      <el-table :load="oneState.loading" @row-click="rowClick" :data="oneState.tableData" tooltip-effect="dark"
        style="width: 100%">
        <el-table-column prop="id" label="一级分类id"> </el-table-column>
        <el-table-column prop="title" label="名称"> </el-table-column>
      </el-table>

      <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
        <!-- <el-table-column prop="id" label="一级分类id"> </el-table-column>
        <el-table-column prop="title" label="名称"> </el-table-column> -->
        <el-table-column prop="id" label="二级分类id"> </el-table-column>
        <el-table-column prop="title" label="名称"> </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row)">修改</a>
            <a style="cursor: pointer; margin-right: 10px" @click="handleDel(scope.row.id)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <ClassifyForm v-if="open" :open="open" :type="type" :classifyForm="classifyForm" @getList="getList"
      @close-modal="closeModal">
    </ClassifyForm>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import axios from "@/utils/axios";
import { ElMessageBox, ElMessage } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import ClassifyForm from './classifyForm.vue';
import { ref } from 'vue';

const app = getCurrentInstance();
const { goTop } = app.appContext.config.globalProperties;
const open = ref(false)
const type = ref(null)
const classifyForm = ref({})
const one_categoryId = ref(null)
const oneState = reactive({
  loading: false,
  tableData: [], // 数据列表
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
});
// 获取一级分类列表
function getList() {
  let data = {
    general_id: 0,
    page: 1,
    page_size: 1000
  }
  axios.get("/autoselladmin/manage/good_category/filter", { params: data }).then((res) => {
    oneState.tableData = res.data;
    if (oneState.tableData.length > 0) {
      getDataList(oneState.tableData[0].id);
    }
  });
}
const rowClick = (row, column, e) => {
  one_categoryId.value = row.id
  getDataList(one_categoryId.value)
}
// 获取二级分类列表
const getDataList = (id) => {
  state.loading = true;
  let data = {
    general_id: id,
    page: state.currentPage,
    page_size: state.pageSize,
  }
  axios
    .get("/autoselladmin/manage/good_category/filter", {
      params: data
    })
    .then((res) => {
      state.tableData = res.data;
      state.loading = false;
      goTop && goTop();
    });
};
const handleAdd = () => {
  type.value = 'add';
  open.value = true;
}
const handleEdit = (row) => {
  type.value = 'edit';
  classifyForm.value = row;
  console.log(classifyForm.value);

  open.value = true;
}
const handleDel = (id) => {

}
const closeModal = () => {
  open.value = false;
}
</script>

<style scoped>
.good-container {
  min-height: 100%;
}

.category_box {
  display: grid !important;
  grid-template-columns: 49% 49% !important;
  grid-column-gap: 2% !important;
  padding-top: 20px;
}
</style>