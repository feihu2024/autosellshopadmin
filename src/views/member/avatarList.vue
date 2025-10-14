<template>
  <div>
    <el-dialog v-model="dialogVisible" title="分身列表" width="70%">
      <el-table :data="tableData" tooltip-effect="dark" height="500px" style="width: 100%" border>
        <el-table-column prop="id" label="id"> </el-table-column>
        <el-table-column prop="avatar" label="头像">
          <template #default="scope">
            <img style="width: 80px;height: 80px;" :src="scope.row.avatar" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="呢称"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="entrust_status" label="是否接受托管" width="120">
          <template #default="scope">
            <span v-if="scope.row.entrust_status == 0">未接受</span>
            <span v-if="scope.row.entrust_status == 1">托管中</span>
            <span v-if="scope.row.entrust_status == 2">永久托管</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="state.total"
        :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage"
        @size-change="sizeChange" />
    </el-dialog>
  </div>

</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, reactive } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false)
const tableData = ref([])
const state = reactive({
  loading: false,
  tableData: [

  ], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
})

function getList(id) {
  let params = {
    user_id: id,
    page: state.currentPage,
    page_size: state.pageSize,
  }
  axios
    .get("/autoselladmin/manage/get_invited_user", { params: params })
    .then((res) => {
      // console.log(res);
      tableData.value = res
    });
}


function changePage(val) {
  state.currentPage = val
  getList();
}


function sizeChange(val) {
  state.pageSize = val
  getList();
}

/** 打开弹窗 */
const open = async (id) => {
  dialogVisible.value = true;
  getList(id)
};

defineExpose({ open }); // 提供 open 方法，用于打开弹窗

</script>