<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="复购人id">
              <el-input v-model="query.user_id" placeholder="请输入ID" clearable />
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getGoodList">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <div></div>
    <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="user_id" label="复购人id"> </el-table-column>
      <el-table-column prop="price_total" label="总价格"></el-table-column>
      <el-table-column prop="invited_money" label="直推金额"> </el-table-column>
      <el-table-column prop="layer_every" label="每层复购金额"> </el-table-column>
      <el-table-column prop="layer_num" label="复购层数（含直推）"> </el-table-column>
      <el-table-column prop="grant_num" label="赠予兑换券额度"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handlePriority(scope.row)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <!--总数超过一页，再展示分页器-->
    <el-pagination background layout="prev, pager, next" :total="state.total" :page-size="state.pageSize"
      :current-page="state.currentPage" @current-change="changePage" />

    <el-dialog v-model="open" title="优先级" width="400" @close="handleClose">
      <el-form label-width="auto" ref="formRef">
        <el-form-item label="优先级" prop="title">
          <el-radio-group v-model="radio">
            <el-radio :label="3">审核通过</el-radio>
            <el-radio :label="6">审核中</el-radio>
            <el-radio :label="9">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSure">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance, ref } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

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
  title: '',
  type: '',
  supplier_id: ''
});
const open = ref(false);
const priority = ref('');
const rowData = ref({});
const radio = ref('')


onMounted(() => {
  getGoodList();
});
// 获取列表
const getGoodList = () => {
  state.loading = true;
  let data = {
    page: state.currentPage,
    page_size: state.pageSize,
    good_name: query.title,
    good_id: query.id,
    good_type: query.type,
  }
  axios
    .get("/autoselladmin/manage/bigorder_log/filter", {
      data
    })
    .then((res) => {
      console.log(res);

      state.tableData = res.data;
      state.total = res.total;
      state.loading = false;
      goTop && goTop();
    });
};

function handleClose() {
  open.value = false;
}

function handlePriority(row) {
  open.value = true;
  rowData.value = row;
  priority.value = row.priority;
}

function handleSure() {
  // let params = {
  //   "good_id": rowData.value.id,
  //   "priority_num": priority.value
  // }
  // axios
  //   .post(`/autoselladmin/manage/update_priority`, params)
  //   .then(() => {
  //     ElMessage.success("修改成功");
  //     handleClose();
  //     getGoodList();
  //   });
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