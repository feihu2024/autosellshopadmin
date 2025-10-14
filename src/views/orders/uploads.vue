<template>
  <el-dialog v-model="props.upOpen" title="导入发货订单" width="400" @close="handleClose">
    <el-form :model="form" :rules="form.rules" ref="formRef">
      <!-- <el-form-item prop="company"> -->
      <el-upload class="upload-demo" drag :headers="headerObj"
        action="https://mlcfjihuawx.yxiaozhu.com/autoselladmin/manage/send_list/import_delivery" multiple>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>
      <!-- </el-form-item> -->
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
import { defineProps, defineEmits, ref } from "vue";
import { UploadFilled } from '@element-plus/icons-vue';
import { localGet, uploadImgServer, uploadImgsServer } from "@/utils";

const emit = defineEmits(['close-modal',]);
const props = defineProps({
  upOpen: {
    type: Boolean,
    default: false,
  },
})
const token = localGet("jinnengyuansession") || "";
const headerObj = ref({
  jinnengyuansession: token,
})

const form = ({
  company: ''
})
const handleSure = () => {
  emit('close-modal');
}
const handleCancel = () => {
  emit('close-modal');
}
const handleClose = () => {
  emit('close-modal');
}
</script>