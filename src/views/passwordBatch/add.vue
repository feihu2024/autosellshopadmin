<template>
  <el-dialog :title="dialogTitle" width="50%" v-model="dialogVisible" :close-on-click-modal="false" v-loadind="loading">
    <el-form :model="form" label-width="180px">
      <el-form-item label="批次名称">
        <el-input type="text" v-model="form.pc_name" />
      </el-form-item>
      <el-form-item label="卡密数量">
        <el-input type="number" v-model="form.pc_num" />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker value-format="YYYY-MM-DD HH:mm:ss" v-model="form.endtime" type="datetime" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="礼包id">
        <el-select v-model="form.bag_id" class="m-2" placeholder="请选择">
          <el-option v-for="item in dataList" :key="item.id" :label="item.bag_name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <div style="display: flex;justify-content: center;margin: 40px 0;">
      <el-button type="primary" @click="save(item)">保存</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
import axios from '@/utils/axios'
import { ElMessage } from "element-plus";
import WangEditor from "wangeditor";
import { localGet, uploadImgServer, uploadImgsServer } from "@/utils";
let instance;
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({
  pc_name: '',      //'批次名称')
  pc_num: '',   // '批次数量')
  endtime: '',      // '结束时间')
  bag_id: '',      // '礼包id')
})
const endtime = ref()
const dataList = ref()
const loading = ref(false)
const open = (row) => {
  getList()
  if (row) {
    dialogTitle.value = '编辑'
  } else {
    dialogTitle.value = '新增批次'
    form.value = {
      pc_name: '',      //'批次名称')
      pc_num: '',   // '批次数量')
      endtime: '',      // '结束时间')
      bag_id: '',      // '礼包id')
    }
  }
  dialogVisible.value = true;
}

function dataInput(e) {
  let days = e + ' ' + '00:00:00'
  let date = new Date(days);
  form.value.endtime = Date.parse(date) / 1000;
}

const emits = defineEmits(['success']);
const save = () => {
  loading.value = true
  let url = '';
  if (dialogTitle.value == '编辑') {
    url = 'autoselladmin/manage/bigorder_initbag/update'
  } else {
    url = 'autoselladmin/manage/bag_cagegory/create'
  }
  form.value.pc_num = Number(form.value.pc_num)
  form.value.bag_id = Number(form.value.bag_id)
  axios.post(url, form.value).then(() => {
    loading.value = false
    ElMessage.success('操作成功')
    dialogVisible.value = false;
    emits('success');
  }).catch(e => {
    loading.value = false
    ElMessage.error('网络错误')
  })
}

function getList() {
  axios.get("/autoselladmin/manage/bigorder_initbag/filter", {}).then(res => {
    console.log(res);

    dataList.value = res.data

  })
}

defineExpose({ open }); // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
  color: #ddd;
  font-size: 30px;
}

.avatar-uploader-icon {
  display: block;
  width: 100%;
  border: 1px solid #e9e9e9;
  padding: 32px 17px;
  text-align: center;
}

.avatar-uploader-icon2 {
  width: 100px;
  height: 100px;
  border: 1px solid #e9e9e9;
  font-size: 30px;
  color: #ddd;
}

.del {
  position: absolute;
  right: 0;
  top: 0;
  color: red;
  font-size: 30px;
  cursor: pointer;
}

:deep(.el-upload) {
  width: 100%;
  height: 100%;
}
</style>