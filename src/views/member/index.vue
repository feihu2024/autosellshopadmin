<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="呢称">
              <el-input v-model="query.nickname" @keyup.enter.native="getList" placeholder="请输入呢称" clearable />
            </el-form-item>
            <el-form-item label="绑定手机">
              <el-input v-model="query.phone" @keyup.enter.native="getList" placeholder="请输入绑定手机" clearable />
            </el-form-item>
            <el-form-item label="id">
              <el-input v-model="query.id" @keyup.enter.native="getList" placeholder="请输入id" clearable />
            </el-form-item>
            <el-form-item label="所属团队">
              <el-input v-model="query.tuan_id" @keyup.enter.native="getList" placeholder="所属团队" clearable />
            </el-form-item>
            <el-form-item label="身份">
              <el-select style="width: 190px" v-model="query.wholesale_id" clearable>
                <el-option v-for="(item, index) in wholesaleList" :key="index" :label="item.gname" :value="item.id" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="是否完成订单">
              <el-input v-model="query.id" placeholder="是否完成订单" clearable />
            </el-form-item> -->
            <el-form-item label="级别">
              <el-select style="width: 190px" v-model="query.level_id" clearable>
                <el-option v-for="(item, index) in levelList" :key="index" :label="item.gname" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否接受托管">
              <el-select style="width: 190px" v-model="query.entrust_status" clearable>
                <el-option label="未接受" value="0" />
                <el-option label="托管中" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="熄灯状态">
              <el-select style="width: 190px" v-model="query.light_status" clearable>
                <el-option label="熄灯" value="1" />
                <el-option label="未熄灯" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="reset">重置</el-button>
              <el-button type="primary" @click="getList">搜索</el-button>
              <el-button type="primary" @click="openRecharge">用户充值</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>

    <el-table :load="state.loading" :data="state.tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="avatar" label="头像">
        <template #default="scope">
          <img style="width: 80px;height: 80px;" :src="scope.row.avatar" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="120"> </el-table-column>
      <el-table-column prop="tuan_id" label="所属团队"> </el-table-column>
      <el-table-column prop="nickname" label="昵称"> </el-table-column>
      <!-- <el-table-column prop="username" label="昵称"> </el-table-column> -->
      <el-table-column prop="entrust_status" label="是否接受托管" width="120">
        <template #default="scope">
          <span v-if="scope.row.entrust_status == 0">未接受</span>
          <span v-if="scope.row.entrust_status == 1">托管中</span>
          <span v-if="scope.row.entrust_status == 2">永久托管</span>
        </template>
      </el-table-column>
      <el-table-column prop="invited_user_id" label="上级推荐人" width="100"> </el-table-column>
      <el-table-column prop="invited_user_id" label="任务卷数量" width="100"> </el-table-column>
      <el-table-column prop="light_status" label="熄灯状态" width="180">
        <template #default="scope">
          <el-switch @change="changeLightStatus(scope.row)" :active-value="0" :inactive-value="1"
            v-model="scope.row.light_status" size="large" active-text="未熄灯" inactive-text="熄灯" />
        </template>
      </el-table-column>
      <el-table-column prop="time" label="身份" width="120">
        <template #default="scope">
          <el-select style="width: 90px" v-model="scope.row.wholesale_id" disabled>
            <el-option v-for="(item, index) in wholesaleList" :key="index" :label="item.gname" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="level_id" label="级别" width="120">
        <template #default="scope">
          <el-select style="width: 90px" v-model="scope.row.level_id" disabled>
            <el-option v-for="(item, index) in levelList" :key="index" :label="item.gname" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="endorders_total" label="完成订单数量" width="120"> </el-table-column>
      <el-table-column prop="money" label="注册时间"> </el-table-column>

      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleView(scope.row.id)">编辑</a>
          <a style="cursor: pointer; margin-right: 10px" @click="goList(scope.row.id)">团队列表</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleVisual(scope.row.id)">可视图</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleActivation(scope.row.id)">卡密激活</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, prev, pager, next, sizes, jumper" :total="state.total"
      :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage"
      @size-change="sizeChange" />

    <avatar-list ref="listRef"></avatar-list>
    <recharge ref="rechargeRef"></recharge>
    <activation ref="activationRef"></activation>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import axios from "@/utils/axios";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import AvatarList from './avatarList.vue'
import Activation from './activation.vue'
import Recharge from './components/recharge.vue'

const router = useRouter();
const wholesaleList = ref([])
const levelList = ref([])
const listRef = ref()
const rechargeRef = ref()
const activationRef = ref()
const query = reactive({
  id: null,
  phone: null,
  tuan_id: null,
  wholesale_id: null,
  level_id: null,
  entrust_status: null,
  light_status: null,
  nickname: null
})
const state = reactive({
  loading: false,
  tableData: [

  ], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
})

const handleView = (id) => {
  router.push({ path: "/member/detail", query: { id } });
}

const handleVisual = (id) => {
  router.push({ path: "/member/visual", query: { id } });
}

const reset = () => {
  query.id = null
  query.phone = null
  query.wholesale_id = null
  query.level_id = null
  query.entrust_status = null
  query.light_status = null
  query.tuan_id = null
  query.nickname = null
  getList()
}

// 获取列表
const getList = () => {
  if (!query.id) {
    query.id = null
  }
  if (!query.phone) {
    query.phone = null
  }
  let params = {
    page: state.currentPage,
    page_size: state.pageSize,
    id: query.id,
    phone: query.phone,
    wholesale_id: query.wholesale_id,
    level_id: query.level_id,
    entrust_status: query.entrust_status,
    light_status: query.light_status,
    order_by: '-id',
    's_nickname': query.nickname,
  }
  axios
    .get("/autoselladmin/manage/member/filter", {
      params
    })
    .then((res) => {
      console.log(res);
      state.tableData = res.data;
      state.total = res.total;
    });
};

function changePage(val) {
  state.currentPage = val
  getList();
}


function sizeChange(val) {
  state.pageSize = val
  getList();
}

function changeLightStatus(row) {
  axios
    .post("/autoselladmin/manage/member/update_light_stat", row)
    .then((res) => {
      ElMessage.success("操作成功");
    });
}

function getUserWholesale() {
  axios.get("/autoselladmin/manage/member/get_user_wholesale", {}).then((data) => {
    wholesaleList.value = data;
  });
}

function getUserLevel() {
  axios.get("/autoselladmin/manage/member/get_user_level", {}).then((data) => {
    levelList.value = data;
  });
}

function goList(id) {
  listRef.value.open(id);
}

function openRecharge() {
  rechargeRef.value.open();
}

function handleActivation(row) {
  activationRef.value.open(row)
}

onMounted(async () => {
  await getUserWholesale()
  await getUserLevel()
  getList();
});

</script>

<style scoped>
.good-container {
  min-height: 100%;
}
</style>