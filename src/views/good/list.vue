<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="id">
              <el-input v-model="query.id" placeholder="请输入ID" clearable />
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="query.title" placeholder="请输入标题" clearable />
            </el-form-item>
            <el-form-item label="供应商">
              <el-input v-model="query.supplier_id" placeholder="请输入供应商id" clearable />
            </el-form-item>
            <el-form-item label="类别">
              <el-select v-model="query.type" style="width: 200px" placeholder="请选择" clearable>
                <el-option label="普通商品" value="0" />
                <el-option label="报单商品" value="1" />
              </el-select>
            </el-form-item>

            <el-form-item label="">
              <el-button type="primary" @click="getGoodList">搜索</el-button>
              <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <div></div>
    <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column label="商品图片" width="150px">
        <template #default="scope">
          <img style="width: 100px; height: 100px" :key="scope.row.goodsId" :src="$filters.prefix(scope.row.cover_url)"
            alt="商品主图" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="supplier_id" label="供应商id"> </el-table-column>
      <el-table-column prop="goodsIntro" label="价格"> </el-table-column>
      <el-table-column prop="type" label="类别">
        <template #default="scope">
          <span v-if="scope.row.type == 0">普通商品</span>
          <span v-else>报单商品</span>
        </template>
      </el-table-column>
      <el-table-column prop="sellingPrice" label="排序"> </el-table-column>
      <el-table-column prop="order_expired_time" label="上驾时间"> </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handlePriority(scope.row)">优先级</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.id)">编辑</a>
          <!-- <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.goodsSellStatus == 0"
            @click="handleStatus(scope.row.goodsId, 1)">优先级</a> -->
          <!-- <a style="cursor: pointer; margin-right: 10px" @click="handleStatus(scope.row.goodsId, 0)">下架</a> -->
        </template>
      </el-table-column>
    </el-table>
    <!--总数超过一页，再展示分页器-->
    <el-pagination background layout="prev, pager, next" :total="state.total" :page-size="state.pageSize"
      :current-page="state.currentPage" @current-change="changePage" />

    <el-dialog v-model="open" title="优先级" width="400" @close="handleClose">
      <el-form label-width="auto" ref="formRef">
        <el-form-item label="优先级" prop="title">
          <el-input v-model="priority" autocomplete="off" />
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
  }
  if (query.id) {
    data.good_id = query.id
  }
  if (query.type) {
    data.good_type = query.type
  }
  axios
    .get("/autoselladmin/manage/good_list/search", { params: data })
    .then((res) => {
      console.log(res);

      state.tableData = res.data;
      state.total = res.total;
      state.loading = false;
      goTop && goTop();
    });
};
const handleAdd = () => {
  router.push({ path: "/good/add" });
};
const handleEdit = (id) => {
  router.push({ path: "/good/add", query: { id } });
};
const changePage = (val) => {
  state.currentPage = val;
  getGoodList();
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
  let params = {
    "good_id": rowData.value.id,
    "priority_num": priority.value
  }
  axios
    .post(`/autoselladmin/manage/update_priority`, params)
    .then(() => {
      ElMessage.success("修改成功");
      handleClose();
      getGoodList();
    });
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