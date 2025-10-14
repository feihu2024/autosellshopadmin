<template>
  <div>
    <el-dialog v-model="props.open" :title="props.type == 'edit' ? '修改备注' : '填写发货信息'" width="600" @close="handleClose">
      <div v-if="props.type == 'edit'">
        <el-form :model="formEdit" label-width="auto" :rules="formEdit.rules" ref="editRef">
          <el-form-item label="备注" required prop="detail">
            <el-input type="textarea" :rows="6"  v-model="formEdit.user_detail" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-form :model="form" label-width="auto" :rules="form.rules" ref="formRef">
          <el-form-item label="快递公司" prop="delivery_company">
            <el-select v-model="form.delivery_company" placeholder="请选择" clearable>
              <el-option v-for="item in companyList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号" prop="delivery_track_code">
            <el-input v-model="form.delivery_track_code" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSure">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { localGet, uploadImgServer, uploadImgsServer } from "@/utils";

const props = defineProps({     //接收父组件传过来的参数
  open: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
  },
  orderInput: {
    type: Object,
  }
})

const editRef = ref(null);
const formEdit = ref({
  order_id: '',
  user_detail: '',
  rules: {
    detail: [
      { required: "true", message: "请填写备注", trigger: ["change"] },
    ],
  },
})
const formRef = ref(null);
const form = ref({
  delivery_company: '',
  delivery_track_code: '',
  rules: {
    delivery_company: [
      { required: "true", message: "请填写快递公司", trigger: ["change"] },
    ],
    delivery_track_code: [
      { required: "true", message: "请填写快递单号", trigger: ["change"] },
    ],
  },
})
const companyList = ref([
  {
    label: '顺丰速运',
    value: '顺丰速运'
  },
  {
    label: '圆通速递',
    value: '圆通速递'
  },
  {
    label: '申通快递',
    value: '申通快递'
  },
  {
    label: '中通快递',
    value: '中通快递'
  },
  {
    label: '百世快递',
    value: '百世快递'
  },
  {
    label: 'EMS 快递',
    value: 'EMS 快递'
  },
  {
    label: '德邦快递',
    value: '德邦快递'
  },
  {
    label: '京东快递',
    value: '京东快递'
  },
  {
    label: '极兔速递',
    value: '极兔速递'
  },
  {
    label: '韵达快递',
    value: '韵达快递'
  },
])

const emit = defineEmits(['close-modal', 'getList']);
onMounted(() => {
  if (props.type == 'edit') {
    formEdit.value = JSON.parse(JSON.stringify(props.orderInput))
  } else {
    form.value = props.orderInput
  }
})

const handleSure = () => {
  const nameRef = props.type == 'edit' ? editRef.value : formRef.value
  const url = props.type == 'edit' ? '/autoselladmin/manage/order/update_detail' : '/autoselladmin/manage/order/update_delivery'
  nameRef.validate((vaild) => {
    if (vaild) {
      // 默认新增用 post 方法
      let httpOption = axios.post;
      let params = {}
      if (props.type == 'edit') {
        params = {
          order_id: formEdit.value.id,
          detail: formEdit.value.user_detail,
        };
      } else {
        params = {
          id: form.value.id,
          delivery_company: form.value.delivery_company,
          delivery_track_code: form.value.delivery_track_code,
          status_id: 2
        }
      }
      httpOption(url, params).then((res) => {
        ElMessage.success(props.type == 'edit' ? "修改成功" : "添加成功");
        emit('close-modal');
        emit('getList');
      })
    }
  });
}
const handleCancel = () => {
  emit('close-modal')
}
const handleClose = () => {
  emit('close-modal')
}
</script>