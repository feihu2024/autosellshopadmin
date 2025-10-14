<template>
  <div style="padding: 20px;">
    <el-form :model="form" label-width="180px">
      <el-form-item v-for="(item, index) in bigorderList" :key="index" :label="item.set_cont">
        <div style="display: flex;">
          <el-input type="number" v-model="item.val_int" />
          <div style="margin-left: 100px;">
            <el-button type="primary" @click="save(item)">保存</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>

  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/utils/axios';
import { ElMessage } from "element-plus";
const form = ref()
const bigorderList = ref([])

const getList = () => {
  axios.get("/autoselladmin/manage/bigorder_set/filter").then(res => {
    bigorderList.value = res.data;
    for (const item of bigorderList.value) {
      if (item.set_cont == '复投金额' || item.set_cont == '分身复购金额' || item.set_cont == '复购直推金额' || item.set_cont == '购物券数'
        || item.set_cont == '复购分红金额'
      ) {
        item.val_int = item.val_int / 100
      }
    }
    console.log(bigorderList.value);

  })
}

const save = (item) => {
  if (item.set_cont == '复投金额' || item.set_cont == '分身复购金额' || item.set_cont == '复购直推金额' || item.set_cont == '购物券数' || item.set_cont == '复购分红金额') {
    item.val_int = item.val_int * 100
  }
  axios.post("/autoselladmin/manage/bigorder_set/update", item).then(res => {
    ElMessage.success('操作成功')
    getList()
  })
}
onMounted(() => {
  getList()
})
</script>