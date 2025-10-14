<template>
  <div>
    <el-card class="good-container">
      <template #header>
        <div class="header">
          <el-button type="primary" :icon="Plus" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="image" label="图片">
          <template #default="scope">
            <img style="width: 50px; height: 50px" :src="scope.row.poster_url" alt="商品主图" />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <a style="cursor: pointer" @click="handleDel(scope.row.id)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <posterFrom :type="type" v-if="open" :open="open" :bannerInput="bannerInput" @closeModal="closeModal"
        @getList="getList">
      </posterFrom>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import posterFrom from "./posterFrom.vue"

const type = ref(null)
const bannerInput = ref(null)
const open = ref(false)
const state = ref({
  loading: false,
  tableData: []
})
onMounted(() => {
  getList()
})
const getList = () => {
  axios.get("/autoselladmin/manage/poster_list").then(res => {
    state.value.tableData = res
  })
}
const handleAdd = () => {
  type.value = 'add'
  open.value = true

}
const handleEdit = (row) => {
  type.value = 'edit'
  open.value = true
  bannerInput.value = row
}
const closeModal = () => {
  open.value = false;
}
const handleDel = (id) => {
  ElMessageBox.confirm(
    '是否删除图片?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      axios.get('/autoselladmin/manage/poster_del', {
        params: {
          poster_id: id,
          valcode: "IAqGo4QhEGET"
        }
      }).then(() => {
        console.log('111');
        ElMessage.success('删除成功')
        getList()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })

}
</script>