<template>
  <div>
    <el-card class="good-container">
      <template #header>
        <div class="header">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="名称">
              <el-input v-model="queryForm.bag_name" placeholder="请输入名称" clearable />
            </el-form-item>
            <el-form-item label="绑定团长id">
              <el-select style="width: 180px;" v-model="tuan_id" clearable>
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
              <!-- <el-input v-model="queryForm.tuan_id" placeholder="请输入团长id" clearable /> -->
            </el-form-item>
            <el-form-item label="团长电话">
              <el-input v-model="queryForm.phone" placeholder="请输入团长电话" clearable />
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="getList">搜索</el-button>
              <el-button type="primary" :icon="Plus" @click="handleAdd">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <el-table :data="dataList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="bag_name" label="名称"></el-table-column>
        <el-table-column prop="price_total" label="价格">
          <template #default="scope">
            <span>{{ scope.row.price_total / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invited_money" label="直推金额"> <template #default="scope">
            <span>{{ scope.row.invited_money / 100 }}</span>
          </template></el-table-column>
        <el-table-column prop="layer_every" label="每层复购金额"> <template #default="scope">
            <span>{{ scope.row.layer_every / 100 }}</span>
          </template></el-table-column>
        <el-table-column prop="grant_num" label="给兑换券数">
          <template #default="scope">
            <span>{{ scope.row.grant_num / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fund_one" label="归集初级资金池额度">
          <template #default="scope">
            <span>{{ scope.row.fund_one / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fund_two" label="归集高级资金池额度">
          <template #default="scope">
            <span>{{ scope.row.fund_two / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fund_three" label="归集顶级资金池额度">
          <template #default="scope">
            <span>{{ scope.row.fund_three / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tuan_id" label="绑定团长id"></el-table-column>
        <el-table-column prop="phone" label="团长电话"></el-table-column>
        <el-table-column prop="register_time" label="创建时间">
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row)">修改</a>
            <a style="cursor: pointer; margin-right: 10px" @click="binding(scope.row)">绑定团长</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="total"
        :page-size="queryForm.page_size" :current-page="queryForm.page" @current-change="changePage"
        @size-change="sizeChange" />

    </el-card>

    <Add ref="addRef" @success="getList" />

    <el-dialog title="绑定团长" width="30%" v-model="dialogVisiblePop" :close-on-click-modal="false">
      <el-form label-width="90px">
        <el-form-item label="用户id">
          <div style="display: flex;">
            <el-input style="width: 100%;" type="text" v-model="userId" />
            <el-button type="primary" @click="identify" style="margin-left: 10px;">识别</el-button>
          </div>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input type="text" disabled v-model="userInfo.phone" />
        </el-form-item>
      </el-form>
      <div style="display: flex;justify-content: center;margin: 40px 0;">
        <el-button type="primary" @click="save()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import Add from './add.vue'

const dataList = ref([])
const total = ref(0)
const addRef = ref()
const queryForm = ref({
  bag_name: '',
  tuan_id: '',
  page: 1,
  page_size: 20
})
const dialogVisiblePop = ref(false)
const rowData = ref()
const userInfo = ref({
  phone: ''
})
const userId = ref('')
const tuan_id = ref('')
onMounted(() => {
  getList()
})

function changePage(val) {
  queryForm.value.page = val
  getList();
}


function sizeChange(val) {
  queryForm.value.page_size = val
  getList();
}


function filterEmptyFields(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] != null && obj[key] !== '') {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

const getList = () => {
  if (tuan_id.value == '是') {
    queryForm.value.tuan_id = '0,'
  } else if (tuan_id.value == '否') {
    queryForm.value.tuan_id = ',0'
  }
  axios.get("/autoselladmin/manage/bigorder_initbag/filter", { params: filterEmptyFields(queryForm.value) }).then(res => {
    dataList.value = res.data
    total.value = res.total
  })
}

const handleAdd = () => {
  addRef.value.open();
}

const handleEdit = (row) => {
  addRef.value.open(row);
}

function binding(row) {
  dialogVisiblePop.value = true
  rowData.value = row;
}

function save() {
  if (!userInfo.value.phone) {
    ElMessage.error('请输入用户id并识别出用户信息')
    return
  }
  rowData.value.tuan_id = userId.value
  rowData.value.phone = userInfo.value.phone
  axios.post("/autoselladmin/manage/bigorder_initbag/update", rowData.value).then(res => {
    ElMessage.success('操作成功！')
    dialogVisiblePop.value = false
    getList()
  })

}

function identify() {
  if (!userId.value) {
    ElMessage.error('请输入用户id')
    return
  }
  axios.get("/autoselladmin/manage/member/get", { params: { user_id: userId.value } }).then(res => {
    userInfo.value = res;
  })
}
</script>