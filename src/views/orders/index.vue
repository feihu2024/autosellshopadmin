<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="订单id">
              <el-input v-model="query.order_id" placeholder="请输入订单id" clearable />
            </el-form-item>
            <el-form-item label="商户单号">
              <el-input v-model="query.out_trade_no" placeholder="请输入商户单号" clearable />
            </el-form-item>
            <el-form-item label="用户注册电话">
              <el-input v-model="query.customer_phone" placeholder="请输入用户注册电话" clearable />
            </el-form-item>
            <el-form-item label="供应商">
              <el-input v-model="query.customer_name" placeholder="请输入供应商" clearable />
            </el-form-item>
            <el-form-item label="快递单号">
              <el-input v-model="query.delivery_track_code" placeholder="请输入快递单号" clearable />
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="query.order_status_id" style="width: 200px" placeholder="请选择" clearable>
                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="">
              <el-button type="primary" @click="getList">搜索</el-button>
              <el-button type="primary" @click="handleExport"><el-icon>
                  <Download />
                </el-icon>导出未发货订单</el-button>
              <el-button type="primary" @click="handleImport">
                <el-icon>
                  <Upload />
                </el-icon>导入发货订单</el-button>
              <!-- <el-button type="primary" @click="handleExportlogistics">
                <el-icon>
                  <Download />
                </el-icon>导出物流公司信息</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>

    <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="" label="订单id">
        <template #default="scope">
          {{ scope.row.s_Order.id }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="商户单号">
        <template #default="scope">
          {{ scope.row.s_Order.out_trade_no }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="供应商"> </el-table-column>
      <el-table-column prop="" label="下单人id">
        <template #default="scope">
          {{ scope.row.s_Order.paider_id }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="下单手机号">
        <template #default="scope">
          {{ scope.row.s_User.phone }}
        </template>
      </el-table-column>
      <el-table-column prop="good_name" label="商品名">
        <template #default="scope">
          <span v-if="scope.row.s_Good">{{ scope.row.s_Good.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="规格名">
        <template #default="scope"><span v-if="scope.row.s_Order.zdyspec">{{ JSON.parse(scope.row.s_Order.zdyspec)['规格']
        }}</span></template>
      </el-table-column>
      <el-table-column prop="" label="价格（元）">
        <template #default="scope">
          <span v-if="scope.row.s_Order.zdyspec">{{ JSON.parse(scope.row.s_Order.zdyspec)['售价'] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="收货地址">
        <template #default="scope">
          <p>{{ scope.row.s_Order.consignee_name }}{{ scope.row.s_Order.consignee_phone }}</p>
          {{ scope.row.s_Order.consignee_province }}{{ scope.row.s_Order.consignee_city }}{{
            scope.row.s_Order.consignee_area }}{{
            scope.row.s_Order.consignee_description }}
        </template> </el-table-column>
      <el-table-column prop="time_start" label="下单时间">
        <template #default="scope">
          {{ scope.row.s_Order.create_time }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="物流">
        <template #default="scope">
          <div>物流公司：</div>
          <div>物流单号：{{ scope.row.s_Order.delivery_track_code }}</div>
          <div>发货时间：{{ scope.row.s_Order.complete_start }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="备注">
        <template #default="scope">
          {{ scope.row.s_Order.user_detail }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="订单备注">
        <template #default="scope">
          <span class="text-tut">{{ scope.row.s_Order.detail_tut }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.s_Order.status_id == 0" type="danger">待付款</el-tag>
          <el-tag v-else-if="scope.row.s_Order.status_id == 1" type="primary">待发货</el-tag>
          <el-tag v-else-if="scope.row.s_Order.status_id == 2" type="warning">待收货</el-tag>
          <el-tag v-else-if="scope.row.s_Order.status_id == 3" type="success">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleView(scope.row)">修改订单备注</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row)">修改备注</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleInformation(scope.row)">填写发货信息</a>
        </template>
      </el-table-column>
    </el-table>

    <!--总数超过一页，再展示分页器-->
    <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="state.total"
      :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage"
      @size-change="sizeChange" />
    <OrderForm v-if="open" :open="open" :type="type" :orderInput="orderInput" @getList="getList"
      @close-modal="closeModal">
    </OrderForm>
    <Uploads :upOpen="upOpen" @close-modal="closesModals"></Uploads>

    <Remark ref="remarkRef" @getList="getList"></Remark>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import axios from "@/utils/axios";
import { ElMessageBox, ElMessage } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ref } from 'vue'
import { localGet, uploadImgServer, uploadImgsServer } from "@/utils";
import OrderForm from './orderForm.vue';
import Uploads from './uploads.vue';
import Remark from './remark.vue';

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
  tableData: [
    // {
    //   customer_phone: '121332'
    // }
  ], // 数据列表
  total: 0, // 总条数
  page: 1, // 当前页
  page_size: 10, // 分页大小
})
const remarkRef = ref()
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
    order_status_id: query.order_status_id == '' ? null : query.order_status_id,
    customer_phone: query.customer_phone == '' ? null : query.customer_phone,
    customer_name: query.customer_name == '' ? null : query.customer_name,
    delivery_track_code: query.delivery_track_code == '' ? null : query.delivery_track_code,
    order_id: query.order_id,
    out_trade_no: query.out_trade_no,
    admin_id: 0,
    "page": state.page,
    "page_size": state.page_size,
  }
  axios.post("/autoselladmin/manage/send_order/shop/get", data).then((res) => {
    state.tableData = res.data;
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


const handleExport = () => {
  // console.log(query.status_id);
  let params = {
    order_status_id: 1
  }
  ElMessageBox.confirm(
    '是否导出未发货订单?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      axios.post("/autoselladmin/manage/send_order/export", params
      ).then((res) => {
        axios.get("/autoselladmin/manage/send_list/get_export_url", { params: { path_url: res } }
        ).then((data) => {
          const link = document.createElement('a');
          const url = data
          link.href = url;
          link.setAttribute('download', '文件名'); //window下载窗口名称自定义
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}
const handleImport = () => {
  upOpen.value = true
}
const handleExportlogistics = () => {
  ElMessageBox.confirm(
    '是否导出物流公司信息?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '导出成功！',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}
const handleInformation = (row) => {
  type.value = 'information'
  open.value = true;
  orderInput.value = row.s_Order

}
const handleEdit = (row) => {
  type.value = 'edit';
  open.value = true;
  console.log(row.s_Order);
  orderInput.value = row.s_Order
  // console.log('222', type.value);
}

const handleView = (row) => {
  remarkRef.value.open(row)
}
const closeModal = () => {
  open.value = false;
}
const closesModals = () => {
  upOpen.value = false;
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