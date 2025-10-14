<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="批次id">
              <el-input v-model="state.pc_id" placeholder="请输入批次id" clearable />
            </el-form-item>
            <el-form-item label="激活会员id">
              <el-input v-model="state.user_id" placeholder="请输入激活会员id" clearable />
            </el-form-item>

            <el-form-item label="">
              <el-button type="primary" @click="getList">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>

    <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="pass_num" label="加密编号"></el-table-column>
      <el-table-column prop="pc_id" label="批次id"></el-table-column>
      <el-table-column prop="user_id" label="激活会员id"> </el-table-column>
      <el-table-column prop="good_name" label="状态">
        <template #default="scope">
          <span v-if="scope.row.stat == 0">未激活</span>
          <span v-if="scope.row.stat == 1">已激活</span>
          <span v-if="scope.row.stat == 2">过期未用</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="190">
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px" @click="handleView(scope.row)">修改订单备注</a>
            <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row)">修改备注</a>
            <a style="cursor: pointer; margin-right: 10px" @click="handleInformation(scope.row)">填写发货信息</a>
          </template>
        </el-table-column> -->
    </el-table>

    <!--总数超过一页，再展示分页器-->
    <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="state.total"
      :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage"
      @size-change="sizeChange" />
  </el-card>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import axios from "@/utils/axios";
import { ElMessageBox, ElMessage } from "element-plus";
import { ref } from 'vue'

const upOpen = ref(false)
const open = ref(false)
const type = ref(null)
const orderInput = ref(null)
const query = reactive({
  order_status_id: null,
  customer_phone: null,
  customer_name: null,
  delivery_track_code: null,
  admin_id: 0,
  out_trade_id: null,
  order_id: null,
  out_trade_no: null,
  // jinnengyuansession: localGet("jinnengyuansession"),
  // page: 1, // 当前页
  // page_size: 10, // 分页大小
})
const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  page: 1, // 当前页
  page_size: 10, // 分页大小
  pc_id: null,
  user_id: null
})
const addRef = ref()
const statusList = ref([
  {
    label: '待付款',
    value: 0
  },
  {
    label: '待发货',
    value: 1
  },
  {
    label: '待收货',
    value: 2
  },
  {
    label: '已完成',
    value: 3
  },
])
onMounted(() => {
  getList()
})
function getList() {
  let data = {
    "page": state.page,
    "page_size": state.page_size,
    pc_id: state.pc_id,
    user_id: state.user_id,
  }
  axios.get("/autoselladmin/manage/bag_pas/filter", { params: data }).then((res) => {
    state.tableData = res.data
    state.total = res.total
  });
}

function changePage(val) {
  state.page = val
  getList();
}


function sizeChange(val) {
  state.page_size = val
  getList();
}


const handleInformation = (row) => {
  type.value = 'information'
  open.value = true;
  orderInput.value = row.s_Order

}
const add = () => {
  addRef.value.open()
}


</script>

<style scoped>
.good-container {
  min-height: 100%;
}

.text-tut {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
</style>