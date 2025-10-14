<template>
  <el-dialog v-model="props.open" :title="props.type == 'edit' ? '修改分类' : '添加分类'" width="400" @close="handleClose">
    <el-form :model="form" label-width="auto" :rules="form.rules" ref="formRef">
      <el-form-item label="一级分类" prop="general_id">
        <el-select v-model="form.general_id" placeholder="请选择" clearable @change="generalNameClick">
          <el-option v-for="item in topCategoryList" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" prop="title">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSure">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import axios from "@/utils/axios";
import { id } from "element-plus/es/locales.mjs";
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
  },
  classifyForm: {
    type: Object,
  },
})
const topCategoryList = ref(null)
const formRef = ref(null);
const form = ref({
  id: '',
  title: '',
  general_name: '',
  general_id: '',
  rules: {
    general_id: [
      { required: "true", message: "请选择一级分类", trigger: ["change"] },
    ],
    title: [
      { required: "true", message: "请填写二级分类", trigger: ["change"] },
    ],
  },
})
const emit = defineEmits(['close-modal',]);
const handleSure = () => {
  formRef.value.validate((vaild) => {
    if (vaild) {
      let params = {
        title: form.value.title,
        general_id: form.value.general_id,
      };
      const url = props.type == 'edit' ? '/autoselladmin/manage/good_category/update' : '/autoselladmin/manage/good_category/create'
      const query = props.type == 'edit' ? form.value : params
      axios.post(url, query).then(() => {
        ElMessage.success(id ? "修改成功" : "添加成功");
        emit('close-modal');
        emit('getList');
      });

    }
  });
}
const handleCancel = () => {
  emit('close-modal');
}
const handleClose = () => {
  emit('close-modal');
}
function getList() {
  let data = {
    general_id: 0,
    page: 1,
    page_size: 1000
  }
  axios.get("/autoselladmin/manage/good_category/filter", { params: data }).then((res) => {
    topCategoryList.value = res.data
  });
}
onMounted(() => {
  getList()
  if (props.type == 'edit') {
    form.value = props.classifyForm
    console.log(form);
  }
})
</script>