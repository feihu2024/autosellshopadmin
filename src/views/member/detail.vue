<template>
  <view>
    <el-card class="add-container">
      <el-form :model="state.userInfo" :rules="state.rules" ref="goodRef" label-width="200px" class="good">
        <el-form-item label="用户id" prop="id">
          <el-input style="width: 300px" v-model="state.userInfo.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="绑定电话" prop="phone">
          <el-input style="width: 300px" v-model="state.userInfo.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input style="width: 300px" v-model="state.userInfo.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="呢称" prop="nickname">
          <el-input style="width: 300px" v-model="state.userInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="上级推荐人呢称" prop="invited_user_id">
          <el-input style="width: 300px" v-model="state.userInfo.invited_user_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="上级推荐人" prop="invited_user_id">
          <el-input style="width: 300px" v-model="state.userInfo.invited_user_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="邀请码" prop="invited_code">
          <el-input style="width: 300px" v-model="state.userInfo.invited_code" disabled></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input style="width: 300px" v-model="state.balance.balance" disabled></el-input>
        </el-form-item>
        <el-form-item label="推荐金额" prop="lock_balance">
          <el-input style="width: 300px" v-model="state.balance.lock_balance" disabled></el-input>
        </el-form-item>
        <el-form-item label="购物券额" prop="coin">
          <el-input style="width: 300px" v-model="state.balance.coin" disabled></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="wholesale_id">
          <el-select style="width: 300px" v-model="state.userInfo.wholesale_id" placeholder="请选择">
            <el-option v-for="(item, index) in wholesaleList" :key="index" :label="item.gname" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="级别" prop="level_id">
          <el-select style="width: 300px" v-model="state.userInfo.level_id" placeholder="请选择">
            <el-option v-for="(item, index) in levelList" :key="index" :label="item.gname" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="light_status">
          <el-radio-group v-model="state.userInfo.light_status" class="ml-4">
            <el-radio :label="0" size="large">未熄灯</el-radio>
            <el-radio :label="1" size="large">熄灯</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当前权重" prop="weight_num">
          <el-input style="width: 300px" v-model="state.userInfo.weight_num"></el-input>
        </el-form-item>
        <el-form-item label="认购卷（张数）" prop="voucher_total">
          <el-input style="width: 300px" v-model="state.userInfo.voucher_total"></el-input>
        </el-form-item>
        <el-form-item label="是否接受托管" prop="entrust_status">
          <el-radio-group v-model="state.userInfo.entrust_status" class="ml-4">
            <el-radio :label="1" size="large">托管中</el-radio>
            <el-radio :label="0" size="large">未接受</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提现" prop="entrust_status">
          <el-button type="primary" @click="openWithdrawal()">提现</el-button>
        </el-form-item>
      </el-form>

      <div style="display: flex;justify-content: center;margin-top: 30px;">
        <el-button type="primary" @click="submitAdd()">保存</el-button>
      </div>
    </el-card>

    <withdrawal ref="withdrawalRef"></withdrawal>
  </view>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from "vue-router";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import withdrawal from "./components/withdrawal.vue"
const route = useRoute();
const router = useRouter();
const { id } = route.query;
const wholesaleList = ref([])
const levelList = ref([])
const withdrawalRef = ref()
const state = reactive({
  userInfo: {
    title: ''
  },
  balance: {},
  rules: {}
})

function getDetail() {
  let params = {
    user_id: id
  }
  axios.get("/autoselladmin/manage/member/get", { params: params }).then((data) => {
    state.userInfo = data.user;
    state.balance = data.balance;
    state.balance.balance = state.balance.balance / 100
    state.balance.lock_balance = state.balance.lock_balance / 100
    state.balance.coin = state.balance.coin / 100
  });
}

function submitAdd() {
  // state.userInfo.entrust_status = Number(state.userInfo.entrust_status)
  // state.userInfo.light_status = Number(state.userInfo.light_status)
  // state.userInfo.voucher_total = Number(state.userInfo.voucher_total)
  axios.post("/autoselladmin/manage/member/update", state.userInfo).then((data) => {
    console.log(data);
    ElMessage.success("操作成功");
    router.go(-1);
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

function openWithdrawal() {
  withdrawalRef.value.open()
}

onMounted(() => {
  getUserWholesale()
  getUserLevel()
  getDetail()

})
</script>
<style scoped></style>