<template>
  <div>
    <el-dialog v-model="showPop" title="卡密列表" width="80%" @close="handleClose">
      <el-card class="good-container">
        <template #header>
          <div class="header">
            <div>
              <el-form :inline="true" class="demo-form-inline">
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
    </el-dialog>
  </div>

</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, defineExpose, reactive } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
const showPop = ref(false)
const emit = defineEmits(['close-modal', 'getList']);
const open = (row) => {
  showPop.value = true
  getList(row.id)
}

const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  page: 1, // 当前页
  page_size: 10, // 分页大小
  pc_id: null,
  user_id: null
})

function getList(id) {
  let data = {
    "page": state.page,
    "page_size": state.page_size,
    pc_id: id,
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


defineExpose({
  open
})

</script>