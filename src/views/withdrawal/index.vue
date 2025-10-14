<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="用户电话">
              <el-input v-model="query.phone" placeholder="请输入用户电话" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query.status" style="width: 200px" placeholder="请选择" clearable>
                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="">
              <el-button type="primary" @click="getList">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>

    <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
      <!-- <el-table-column type="index" label="序号" width="60" /> -->
      <el-table-column prop="id" label="id" width="60" />
      <el-table-column prop="user_bank_other" label="姓名"> </el-table-column>
      <el-table-column prop="user_phone" label="电话"> </el-table-column>
      <el-table-column prop="amount" label="金额">
        <template #default="scope">
          <div>{{ scope.row.amount / 100 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="时间"> </el-table-column>
      <el-table-column prop="user_withdraw_status_id" label="状态">
        <template #default="scope">
          <div v-if="scope.row.user_withdraw_status_id == 0">待审批</div>
          <div v-if="scope.row.user_withdraw_status_id == 1">已提现</div>
          <div v-if="scope.row.user_withdraw_status_id == 2">已驳回</div>
        </template>
      </el-table-column>
      <el-table-column prop="batch_remark" label="提现类型"> </el-table-column>
      <el-table-column prop="goodsId" label="资金明细">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleFinancialDetails(scope.row.goodsId)">查看</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleView(scope.row, 'detailed')">提现详情</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleScreenshot(scope.row, 'screenshot')">截图回传</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleWithdrawal(scope.row)">确认提现</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleReject(scope.row.id)">驳回</a>
        </template>
      </el-table-column>
    </el-table>

    <!--总数超过一页，再展示分页器-->
    <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="state.total"
      :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage"
      @size-change="sizeChange" />
    <Details v-if="open" :open="open" :type="type" :inputFrom="inputFrom" @close-modal="closeModal"></Details>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import axios from "@/utils/axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ref } from 'vue'
import Details from './details.vue';
const open = ref(false)
const type = ref('')
const inputFrom = ref(null)
const query = reactive({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  phone: null,
  status: null
})
const state = reactive({
  loading: false,
  tableData: [
    {
      phone: '',
      name: '张三',
      money: '',
      time: '',
    }
  ], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
})
const statusList = ref([
  {
    label: '待审批',
    value: '0'
  },
  {
    label: '已提现',
    value: '1'
  },
  {
    label: '已驳回',
    value: '2'
  },
])

onMounted(() => {
  getList()
})
const getList = () => {
  let data = {
    "page": state.currentPage,
    "page_size": state.pageSize,
    order_by: '-id',
    user_phone: query.phone == '' ? null : query.phone,
    user_withdraw_status_id: query.status == '' ? null : query.status,
  }
  axios.get('/autoselladmin/balance/withdraw_filter', { params: data }).then(res => {
    state.tableData = res.data
    state.total = res.total
  })
}

const handleFinancialDetails = (Id) => {

}

const handleWithdrawal = (item) => {
  ElMessageBox.confirm(
    '是否确认提现?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      let params = {
        "withdraw_id": item.id,
        "amount": item.amount,
        "user_id": item.user_id,
        "fee_type": item.fee_type,
        "fee_pro": item.fee_pro,
        "fee_balance": item.fee_balance,
        "deduct_balance": item.deduct_balance,
      }
      axios.post('/autoselladmin/balance/pass_withdraw', params).then(res => {
        console.log(res);
        ElMessage({
          type: 'success',
          message: '提现成功！',
        })
        getList();
      })

    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}
const handleReject = (id) => {
  ElMessageBox.confirm(
    '是否确认驳回?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      const params = {
        withdraw_id: id
      }
      axios.get('/autoselladmin/balance/deny_withdraw', params).then(res => {
        console.log(res);
        ElMessage({
          type: 'success',
          message: '驳回成功！',
        })
        getList();
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}
const handleView = (row, value) => {
  open.value = true
  type.value = value
  inputFrom.value = row

}
const handleScreenshot = (row, value) => {
  open.value = true
  type.value = value
  inputFrom.value = row

}
const closeModal = () => {
  open.value = false;
  getList();
}

function changePage(val) {
  state.currentPage = val
  getList();
}


function sizeChange(val) {
  state.pageSize = val
  getList();
}



const handleStatus = (Id, value) => {

}
</script>

<style scoped>
.good-container {
  min-height: 100%;
}
</style>