<template>
  <el-dialog v-model="props.open" :title="props.type == 'detailed' ? '提现明细' : '截图回传'" width="500" @close="handleClose">
    <div v-if="props.type == 'detailed'">
      <el-form :model="form" label-width="auto" :rules="rules" ref="formRef">
        <el-form-item label="姓名" required prop="user_bank_other">
          <el-input v-model="form.user_bank_other" autocomplete="off" />
        </el-form-item>
        <el-form-item label="支付宝账号" required prop="user_bank_id">
          <el-input v-model="form.user_bank_id" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item label="银行卡账号" required prop="name">
          <el-input v-model="form.user_bank_id" autocomplete="off" />
        </el-form-item> -->
        <!-- <el-form-item label="余额">
          <div>778</div>
        </el-form-item> -->
        <el-form-item label="金额" required prop="amountValue">
          <el-input v-model="form.amountValue" autocomplete="off" />
        </el-form-item>
        <el-form-item required label="截图" prop="money_pic">
          <div v-if="form.money_pic" class="main-box">
            <img :src="form.money_pic" style="width: 100%; height: 100%" />
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div v-else>
      <el-form :model="formImg" label-width="auto" ref="formImgRef">
        <el-form-item label="图片" required prop="money_pic">
          <div v-if="formImg.money_pic" class="main-box">
            <img :key="index" :src="formImg.money_pic" style="width: 100%; height: 100%" />
            <el-icon class="del" @click="delImg(2)">
              <CircleCloseFilled />
            </el-icon>
          </div>
          <el-upload ref="upload2" v-else :action="uploadURL" :data="dataToken" accept="jpg,jpeg,png"
            :show-file-list="false" :limit="5" :auto-upload="false"
            :on-change="(file) => handleBeforeUpload(file, 'screenshot')" :on-success="handleUrlSuccess2">
            <el-icon class="avatar-uploader-icon2">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSure">
          确定
        </el-button>
      </div>
    </div>

  </el-dialog>
</template>

<script setup>
import { onMounted, defineProps, defineEmits, ref } from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { localGet, uploadImgServer, uploadImgsServer } from "@/utils";
import { el } from "element-plus/es/locales.mjs";

const formRef = ref(null);
const formImgRef = ref(null);
const upload = ref(null);
const upload2 = ref(null);
const uploadURL = ref("https://up-z1.qiniup.com");
const formImg = ref({
  money_pic: "",
  withdraw_id: ""
});
const dataToken = ref({
  token: "",
  key: "",
});
const form = ref({
  user_name: '',
  amount: '',
  money_pic: '',
  amountValue: ''
})
const rules = ref({
  name: [
    { required: "true", message: "请填写姓名", trigger: ["change"] },
  ],
  goodsCoverImg: [
    { required: "true", message: "请上传截图", trigger: ["change"] },
  ],
})
const props = defineProps({     //接收父组件传过来的参数
  open: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
  },
  inputFrom: {
    type: Object,
  },
})
onMounted(() => {
  form.value = props.inputFrom
  form.value.amountValue = form.value.amount / 100
})
function delImg(val) {
  if (val == 1) {
    form.value.money_pic = '';
  } else {
    formImg.value.money_pic = '';
  }

}
const handleUrlSuccess2 = (response) => {
  let url = "https://mlcfjihuaqn.yxiaozhu.com/" + response.key;
  axios.get("/assets/qiniu_httpurl?httpurl=" + url).then((data) => {
    console.log('data', data);

    if (props.type == 'detailed') {
      form.value.money_pic = data;
    } else {
      formImg.value.money_pic = data
    }

  });
};
const handleBeforeUpload = async (file, type) => {
  let params = {
    filename: file.name,
    type: type,
  };
  const res = await axios.get("/assets/qiniu_token", { params: params });
  dataToken.value.token = res.token;
  dataToken.value.key = res.fname;
  if (type == "main") {
    upload.value.submit();
  } else if (type == 'screenshot') {
    upload2.value.submit();
  }
};
const emit = defineEmits(['close-modal',]);
const handleSure = () => {
  const nameForm = props.type == 'detailed' ? formRef.value : formImgRef.value
  nameForm.validate((vaild) => {
    if (vaild) {
      let params = {
        withdraw_id: form.value.id,
        money_pic: formImg.value.money_pic
      };
      const url = '/jnyuanadmin/balance/withdraw_moneypic'
      axios.post(url, params).then((res) => {
        console.log(res);
      });
      emit('close-modal');
    }
  });

}
const handleCancel = () => {
  emit('close-modal')
}
const handleReject = () => {
  formRef.value.validate((vaild) => {
    if (vaild) {
      const params = {
        withdraw_id: '',
        jinnengyuansession: '',
      }
      axios.get("/jnyuanadmin/balance/deny_withdraw", params).then(() => {
        // ElMessage.success(id ? "修改成功" : "添加成功");
        // router.push({ path: "/good" });
      });
      emit('close-modal');
    }
  })
}
const handleClose = () => {
  emit('close-modal');
}
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>