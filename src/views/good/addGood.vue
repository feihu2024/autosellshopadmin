<template>
  <div class="add">
    <el-card class="add-container">
      <el-form :model="state.good" :rules="state.rules" ref="goodRef" label-width="100px" class="good">
        <el-form-item label="名称" prop="title">
          <el-input style="width: 300px" v-model="state.good.title" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item required label="副标题" prop="subtitle">
          <el-input style="width: 300px" v-model="state.good.subtitle" placeholder="请输入副标题"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品类别" prop="type">
          <el-select style="width: 300px" v-model="state.good.type" class="m-2" placeholder="请选择">
            <el-option label="普通商品" :value="0" />
            <el-option label="报单商品" :value="1" />
          </el-select>
        </el-form-item> -->

        <el-form-item label="供应商">
          <el-input type="number" min="0" style="width: 300px" v-model="state.good.supplier_id"
            placeholder="请输入供应商id"></el-input>
          <div style="margin: 0 8px;">{{ employeeObj.TSupplier.name }}</div>
          <el-button type="primary" @click="searchSupplier">确定</el-button>
        </el-form-item>

        <el-form-item label="过期期限">
          <el-date-picker style="width: 300px" @change="dataInput" value-format="YYYY-MM-DD" v-model="expired_time"
            type="date" placeholder="请选择" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="state.good.status" class="ml-4">
            <el-radio :label="1" size="large">上架</el-radio>
            <el-radio :label="0" size="large">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="可用卷数">
          <el-input type="number" style="width: 300px" v-model="state.good.coinable_number"
            placeholder="请输入可用卷数"></el-input>
        </el-form-item>

        <el-form-item label="视频上传" prop="goodsCoverImg">
          <div v-if="state.good.video_url" class="main-box">
            <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9" :src="state.good.video_url"
              class="avatar" />
            <el-icon class="del" @click="delImg2(1)">
              <CircleCloseFilled />
            </el-icon>
          </div>
          <el-upload class="avatar-uploader" ref="upload0" :action="uploadURL" :data="dataToken" accept=".mp4,.avi"
            :limit="1" :show-file-list="false" :auto-upload="false"
            :on-change="(file) => handleBeforeUpload(file, 'product')" :on-success="handleUrlSuccess0">
            <el-icon v-if="!state.good.video_url" class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="封面图" prop="cover_url">
          <div v-if="state.good.cover_url" class="main-box">
            <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9" :src="state.good.cover_url"
              class="avatar" />
            <el-icon class="del" @click="delImg2(2)">
              <CircleCloseFilled />
            </el-icon>
          </div>
          <el-upload ref="upload1" class="avatar-uploader" :action="uploadURL" :data="dataToken" :auto-upload="false"
            accept="jpg,jpeg,png" :limit="1" :show-file-list="false"
            :on-change="(file) => handleBeforeUpload(file, 'cover')" :on-success="handleUrlSuccess1">
            <el-icon v-if="!state.good.cover_url" class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="主图" prop="goodsCoverImg">
          <div v-if="state.imgList.length > 0" class="main-box2">
            <div style="position: relative;" v-for="(item, index) in state.imgList" :key="index">
              <img :src="item" style="width: 100%; height: 100%" />
              <el-icon class="del" @click="delImg(index)">
                <CircleCloseFilled />
              </el-icon>
            </div>
          </div>

          <el-upload ref="upload2" :action="uploadURL" :data="dataToken" accept="jpg,jpeg,png" :show-file-list="false"
            :limit="5" :auto-upload="false" :on-change="(file) => handleBeforeUpload(file, 'main')"
            :on-success="handleUrlSuccess2">
            <el-icon class="avatar-uploader-icon2">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="一级分类">
          <el-select @change="chooseOneType" style="width: 300px" v-model="state.good.parent_category_id" class="m-2"
            placeholder="请选择">
            <el-option v-for="(item, index) in oneList" :key="index" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select style="width: 300px" v-model="state.good.category_id" class="m-2" placeholder="请选择">
            <el-option v-for="(item, index) in twoList" :key="index" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="详情内容">
          <div ref="editor"></div>
        </el-form-item>
      </el-form>

      <!--商品选项卡-->
      <!-- <div class="basicInformation">
        <div class="basicInformation_title" style="margin-right: 26px; margin-top: 20px">
          规格快写
        </div>
        <div class="merchandise_Tab_box">
          <div class="merchandise_Tab">
            <div class="tabVal_box2">
              <el-input class="tabVal" v-model="pl_random_fee" placeholder="随机分润比例%"></el-input>
            </div>
            <div class="tabVal_box2">
              <el-input class="tabVal" v-model="pl_price_line" placeholder="设置划线价"></el-input>
            </div>
            <div class="tabVal_box">
              <button @click="pl_setupall" style="width: 80px">
                应用全部
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="basicInformation">
        <div class="basicInformation_title">基础规格区</div>
        <div class="basicInformation_continer">
          <div class="pic_list">
            <div class="pic_items_left" style="margin-bottom: 15px" v-for="(item, index) in specificationArea"
              :key="index">
              <div class="pic_items_box">
                <div class="pic_items">
                  <div>
                    <span>图片</span>
                    <div class="file-image" v-if="item.image">
                      <el-icon class="del" @click="delImgClick(item)">
                        <CircleCloseFilled />
                      </el-icon>
                      <img :src="item.image" />
                    </div>
                    <div>
                      <el-upload class="upload" v-if="!item.image" :ref="(el) => setItemRef(el, index)"
                        :action="uploadURL" :data="dataToken" accept="jpg,jpeg,png" :show-file-list="false" :limit="1"
                        :auto-upload="false" :on-change="(file) => handleBeforeUpload3(file, index)"
                        :on-success="handleUrlSuccess3" list-type="picture-card">
                        <el-icon style="
                                color: #409eff;
                                font-size: 33px;">
                          <Plus />
                        </el-icon>
                      </el-upload>
                    </div>
                  </div>
                  <div>
                    <span>名称</span>
                    <el-input v-model="item.value" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>售价</span>
                    <el-input v-model="item.price" type="number" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>会员价</span>
                    <el-input v-model="item.wholesale_price" type="number" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>划线价</span>
                    <el-input v-model="item.price_line" type="number" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>成本</span>
                    <el-input v-model="item.cost" type="number" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>利润</span>
                    <el-input v-model="item.profit" type="number" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>库存</span>
                    <el-input v-model="item.stock" type="number" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>层级收益</span>
                    <el-input v-model="item.parent_fee" type="number" @input="parent_feeInput(item, index)"
                      placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>老板收益</span>
                    <el-input v-model="item.top_fee" type="number" @input="top_feeInput(item, index)"
                      placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>供货收益</span>
                    <el-input v-model="item.supplier_fee" type="number" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>直推收益</span>
                    <el-input v-model="item.recommender_fee" type="number" @input="recommender_feeInput(item, index)"
                      placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>分享收益</span>
                    <el-input v-model="item.share_fee" type="number" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>批发商返利</span>
                    <el-input v-model="item.wholesale_fee" type="number" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>平级收益</span>
                    <el-input v-model="item.eqlevel_fee" type="number" @input="eqlevel_feeInput(item, index)"
                      placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>额外推荐人奖励</span>
                    <el-input v-model="item.recommender2_fee" type="number" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>进价</span>
                    <el-input v-model="item.purchase_price" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>运费</span>
                    <el-input v-model="item.freight_txt" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>克重</span>
                    <el-input v-model="item.kg_num" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>税</span>
                    <el-input v-model="item.taxation_txt" placeholder="请输入"></el-input>
                  </div>
                  <div>
                    <span>编号</span>
                    <el-input v-model="item.spec_num" placeholder="请输入"></el-input>
                  </div>
                  <div v-if="state.good.type == 0">
                    <span>包间</span>
                    <el-select style="margin-left: 0px !important" v-model="item.room" placeholder="请选择">
                      <el-option v-for="item in privateRoom_List" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </div>

                  <div v-if="state.good.type == 0">
                    <span>人数上限</span>
                    <el-input v-model="item.lower_num_people" type="number" placeholder="人数上限"></el-input>
                  </div>
                  <div v-if="state.good.type == 0">
                    <span>人数下限</span>
                    <el-input v-model="item.upper_num_people" type="number" placeholder="人数下限"></el-input>
                  </div>
                  <div>
                    <span>海报图片</span>
                    <div style="
                            line-height: 48px;
                            font-size: 12px;
                            cursor: pointer;
                          " @click="posterPicture(index, item)">
                      请点击
                    </div>
                  </div>
                  <div>
                    <span>批发单份数量</span>
                    <el-input v-model="item.pifa_num" placeholder="请输入批发单份数量"></el-input>
                  </div>
                  <div>
                    <span>是否单份代卖</span>
                    <el-input v-model="item.is_single" placeholder="默认0为否，1是"></el-input>
                  </div>
                  <div>
                    <span>单份差价</span>
                    <el-input v-model="item.unitprice_diff" placeholder="设置批发商品单个利润"></el-input>
                  </div>
                  <div>
                    <span>随机分润≈约</span>
                    <el-input v-model="item.random_fee" placeholder="商家随机获取的分润"></el-input>
                  </div>
                  <div v-if="state.good.type == 0">
                    <span>套餐详情</span>
                    <div style="
                            line-height: 48px;
                            font-size: 12px;
                            cursor: pointer;
                          " @click="spec_details(index, item)">
                      请点击
                    </div>
                  </div>
                </div>
              </div>
              <div class="pic_items_right">
                <div class="pic_items_right_top">
                  <img class="del_icon" @click="editClick(index, item)" src="" alt="" />
                  <span class="del_icon" @click="delistClick(index, item)" style="
                          font-size: 14px;
                          float: left;
                          display: block;
                          line-height: 35px;
                          color: #409eff;
                        " v-if="state.good.id && item.status == 1">下架</span>
                  <span class="del_icon" @click="listingClick(index, item)" style="
                          font-size: 14px;
                          float: left;
                          display: block;
                          line-height: 35px;
                          color: #409eff;
                        " v-if="state.good.id && item.status == 0">上架</span>
                </div>
                <div class="pic_items_right_center">
                  <span @click="calculateClick(item, index)">计算收益</span>
                  <span @click="calculateClick2(item, index)">计算收益0.13</span>
                </div>
                <div class="pic_items_right_bottom">
                  <el-switch style="display: block" v-model="item.switchFlag" active-color="#13ce66"
                    inactive-color="#ff4949" active-text="默认" @change="switchDefaule(item, index)" inactive-text="不默认">
                  </el-switch>
                </div>
                <div class="pic_items_right_bottom">
                  <el-switch style="display: block" v-model="item.is_pifa_Flag" active-color="#13ce66"
                    inactive-color="#ff4949" active-text="批发" @change="switchDefaulePifa(item, index)"
                    inactive-text="商品">
                  </el-switch>
                </div>
              </div>
            </div>
            <div class="addition_box">
              <div class="addition" @click="additionClick">
                <img class="add_icon" src="../../assets//good/play.png" alt="" />
                <span>添加</span>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- 自定义规格，变成字段 -->
      <div class="basicInformation">
        <div class="basicInformation_title">自定义规格区</div>
        <div class="basicInformation_continer">
          <div style="display: flex; width: 370px" class="zidingyi">
            <el-input v-model="zidingyi_titlename" placeholder="标题名称"></el-input>
            <span class="queren" @click="zidingyiTitleClick" style="margin-left: 4px">添加规格标题</span>
            <span class="queren" @click="zidingyiAttrOneClick" style="margin-left: 4px">一键载入规格</span>
            <span class="queren" @click="zidingyigetval" style="margin-left: 4px">刷新全值</span>
          </div>
          <div class="zidingyititle">
            <div class="list" v-for="(item, index) of zidingyi_title" :key="index">
              <div style="font-size: large; font-weight: bold;padding-top: 10px;">
                {{ item.title }}
                <div style="position: relative;
                        top: -36px;
                        right: -80px;
                        cursor: pointer;
                        width: 16px;
                      " @click="delTitleClick(index)">
                  ×
                </div>
              </div>
              <div style="display: flex;align-items: center;">
                <div v-for="(itemval, index2) in item.val" class="val" :key="index2">
                  <el-input v-model="itemval.v" :placeholder="index2">
                    <template #suffix>
                      <el-button @click="delzidingyi_titel(index, itemval.v)" style="
                              border: none;
                              margin-top: 1px;
                              padding: 0px 0px;
                              width: 24px;
                            ">
                        <span sytle="font-size:12px;">删</span>
                      </el-button>
                    </template>
                  </el-input>
                </div>
                <div class="addition" @click="addzidingyi_titel(index)">
                  <img class="add_icon" src="../../assets/good/play.png" alt="" />
                  <span>添加</span>
                </div>
                <!-- <span class="queren" @click="zidingyiAttrClick(index)">创建规格</span>  -->
              </div>
            </div>
          </div>
          <!-- Table -->
          <div>
            <el-table height="300" :data="zidingyi_list_res" border size="mini" :header-cell-style="{
              background: '#eef1f6',
              color: '#606266',
            }">
              <el-table-column v-for="(column, index) in zidingyi_title_res" :key="index" :prop="column.title"
                :label="column.title" :render-header="renderTipsHeader">
                <template #default="scope">
                  <div v-if="column.title === '图片'">
                    <div class="file-image" v-if="scope.row[column.title]">
                      <i class="el-icon-delete" @click="zdydelImgClick(scope)"></i>
                      <img :src="scope.row[column.title]" />
                    </div>
                    <div @click="zdyuploadClick(scope)" v-if="!scope.row[column.title]">
                      <el-upload class="upload" :headers='headerObj' :action="uploadImgsServer"
                        :on-success="zdyhandSuccess" list-type="picture-card" :show-file-list="false">
                        <i style="
                                  margin-top: 90px;
                                  color: #409eff;
                                  font-size: 33px;
                                " class="el-icon-plus"></i>
                      </el-upload>
                    </div>
                  </div>
                  <div class="zidingyi" v-else>
                    <el-input v-model="scope.row[column.title]" :placeholder="index + ''"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <div class="zidingyi">
                    <el-button type="primary" @click="clickKuaisuJisuan(scope)">快速填充</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <div style="display: flex;justify-content: center;margin-top: 30px;">
        <el-button type="primary" @click="submitAdd()">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  h
} from "vue";
import WangEditor from "wangeditor";
import axios from "@/utils/axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { localGet, uploadImgServer, uploadImgsServer } from "@/utils";

const { proxy } = getCurrentInstance();
const headerObj = ref({
  jinnengyuansession: localGet("jinnengyuansession"),
})
const editor = ref(null);
const upload0 = ref(null);
const upload1 = ref(null);
const upload2 = ref(null);
const itemRefs = ref([]);
const expired_time = ref('');
// 定义setItemRef函数
const setItemRef = (el, index) => {
  if (el) {
    itemRefs.value[index] = el;
  } else {
    // 处理元素被移除的情况
    itemRefs.value.splice(index, 1);
  }
};
const goodRef = ref(null);
const route = useRoute();
const router = useRouter();
const { id } = route.query;
const uploadURL = ref("https://up-z1.qiniup.com");
const dataToken = ref({
  token: "",
  key: "",
});
const state = reactive({
  uploadImgServer,
  id: id,
  defaultCate: "",
  imgList: [],
  good: {
    "display": "1",
    "is_wholesale": "0",
    "coinable": "0",
    "priority": 0,
    "title": "",
    "subtitle": "",
    "id": null,
    "supplier_id": null,
    "share_ratio": null,
    "video_url": "",
    "cover_url": "",
    "image_url": "",
    "type": 0,
    "status": 1,
    "stock_cordon": "0",
    "expired_time": null,
    "order_expired_time": null,
    "introducer_id": null,
    "category_id": null,
    "parent_category_id": null,
    "coinable_number": 0,
    "store_id": null,
    "fake_owner_name": "",
    "fake_owner_phone": "",
    "zdyspec": "",
    "sale_type": "0"
  },
  rules: {
    title: [
      { required: "true", message: "请填写名称", trigger: ["change"] },
    ],
    subtitle: [
      { required: "true", message: "请填写副标题", trigger: ["change"] },
    ],
    type: [
      { required: "true", message: "请选择", trigger: ["change"] },
    ],
    // stockNum: [
    //   { required: "true", message: "请填写商品库存", trigger: ["change"] },
    // ],
  },
  categoryId: "",
});

// 规格区开始
const specificationArea = reactive([{
  image: "",
  value: "",
  price: "",
  price_line: "",
  cost: "",
  stock: "",
  room: "",
  spec_num: "",
  purchase_price: "",
  freight_txt: "",
  taxation_txt: "",
  share_fee: "",
  profit: "",
  eqlevel_fee: "",
  recommender2_fee: "", //额外的推荐人奖励
  kg_num: "", //克重
  status: 1,
  switchFlag: false,
  is_pifa_Flag: false,
  wholesale_fee: "", //批发商返利
  wholesale_price: "", //批发商价格既是会员价
  is_default: 0, //1设为默认0不设为默认
  is_pifa: 0, //默认是商品，不是批发
  is_single: 0, //是否单份代卖,默认0单份,1为整份
  pifa_num: 0, //单份批发商品数量
  lower_num_people: null, //人数下限
  upper_num_people: null, //人数上限
  unitprice_diff: 0, ////单份批发商品利润
  random_fee: 0,
}]);
const img_index = ref(0);
const zidingyi_titlename = ref("");
const zidingyi_title = ref([]); //自定义表title
const zidingyi_title_res = ref([]); //自定义表title
const zidingyi_list = ref([]); //自定义表list
const zidingyi_list_res = ref([]); //自定义表list最终结果
const pl_random_fee = ref(""); //批量设置批发商随机分润比例
const pl_price_line = ref(""); //批量设置划线价
const privateRoom_List = reactive([
  {
    value: "1",
    label: "可用",
  },
  {
    value: "0",
    label: "不可用",
  },
])
const TGoodText = ref({});
const zdyimgIndex = ref(0);
// 规格区结束

//分类数组
const oneList = ref([]);
const twoList = ref([]);

const employeeObj = ref({
  TSupplier: { name: '' }
})

let instance;
onMounted(() => {
  instance = new WangEditor(editor.value);
  instance.config.showLinkImg = false;
  instance.config.showLinkImgAlt = false;
  instance.config.showLinkImgHref = false;
  instance.config.uploadImgMaxSize = 2 * 1024 * 1024; // 2M
  instance.config.uploadFileName = "file";
  instance.config.uploadImgHeaders = {
    jinnengyuansession: localGet("jinnengyuansession"),
  };
  // 图片返回格式不同，需要自定义返回格式
  instance.config.uploadImgHooks = {
    // 图片上传并返回了结果，想要自己把图片插入到编辑器中
    // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
    customInsert: function (insertImgFn, result) {
      let res = JSON.parse(result);
      // result 即服务端返回的接口
      // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
      // if (result.data && result.data.length) {
      //   result.data.forEach((item) => insertImgFn(item));
      // }

      axios.get("/assets/qiniu_httpurl?httpurl=" + 'https://mlcfjihuaqn.yxiaozhu.com/' + res.key).then((data) => {
        insertImgFn(data)
      });
    },
  };
  instance.config.uploadImgServer = uploadImgsServer;
  Object.assign(instance.config, {
    onchange() {
      console.log("change");
    },
  });
  instance.create();
  getList();
  getSupplierList();
  if (id) {
    getDetail();
  }
});
onBeforeUnmount(() => {
  instance.destroy();
  instance = null;
});

// 获取供应商列表
function getSupplierList() {
  let data = {
    page: 1,
    page_size: 1000
  }
  axios.post("/autoselladmin/manage/supplier/getlist", { params: data }).then((res) => {
    // oneList.value = res.data;
    console.log(res);

  });
}

// 获取一级分类列表
function getList() {
  let data = {
    general_id: 0,
    page: 1,
    page_size: 1000
  }
  axios.get("/autoselladmin/manage/good_category/filter", { params: data }).then((res) => {
    oneList.value = res.data;
  });
}

// 获取二级分类列表
const getDataList = (id) => {
  let data = {
    general_id: id,
    page: 1,
    page_size: 1000
  }
  axios
    .get("/autoselladmin/manage/good_category/filter", {
      params: data
    })
    .then((res) => {
      twoList.value = res.data;
    });
};

function chooseOneType(e) {
  getDataList(e);
}

function getDetail() {
  let params = {
    good_id: id
  }
  axios.get(`/autoselladmin/manage/good_details/get`, { params: params }).then((res) => {
    state.good = res[0].TGood;
    state.good.coinable_number = state.good.coinable_number / 100
    TGoodText.value = res[0].TGoodText;
    state.good.expired_time = res[0].TGood.expired_time;//过期时间
    if (res[0].TGoodCategory) {
      state.good.parent_category_id =
        res[0].TGoodCategory.general_id; //大分类类别id
      state.good.category_id = res[0].TGoodCategory.id; //二级类类别id
    }

    expired_time.value = res[0].TGood.expired_time ? res[0].TGood.expired_time.substr(0, 10) : "";
    if (state.good.image_url) {
      let arr = state.good.image_url.split(',')
      state.imgList = arr;
    }
    instance.txt.html(res[0].TGoodText.description);
    // 自定义规格区
    init_zdyspec();

    getDataList(state.good.parent_category_id)

    if (state.good.supplier_id) {
      searchSupplier()
    }
  });
}

//过期期限传时间戳
function dataInput(e) {
  let days = e + ' ' + '00:00:00'
  let date = new Date(days);
  state.good.expired_time = Date.parse(date) / 1000;
}

const handleBeforeUpload = async (file, type) => {
  let params = {
    filename: file.name,
    type: type,
  };
  const res = await axios.get("/assets/qiniu_token", { params: params });
  dataToken.value.token = res.token;
  dataToken.value.key = res.fname;
  if (type == "product") {
    upload0.value.submit();
  } else if (type == "cover") {
    upload1.value.submit();
  } else if (type == "main") {
    upload2.value.submit();
  }
};

const handleBeforeUpload3 = async (file, index) => {
  img_index.value = index;
  let params = {
    filename: file.name,
    type: 'product',
  };
  const res = await axios.get("/assets/qiniu_token", { params: params });
  dataToken.value.token = res.token;
  dataToken.value.key = res.fname;
  itemRefs.value[index].submit()
};

const handleUrlSuccess0 = (response) => {
  let url = "https://mlcfjihuaqn.yxiaozhu.com/" + response.key;
  axios.get("/assets/qiniu_httpurl?httpurl=" + url).then((data) => {
    state.good.video_url = data;
  });
};
const handleUrlSuccess1 = (response) => {
  let url = "https://mlcfjihuaqn.yxiaozhu.com/" + response.key;
  axios.get("/assets/qiniu_httpurl?httpurl=" + url).then((data) => {
    state.good.cover_url = data;
  });
};
const handleUrlSuccess2 = (response) => {
  let url = "https://mlcfjihuaqn.yxiaozhu.com/" + response.key;
  axios.get("/assets/qiniu_httpurl?httpurl=" + url).then((data) => {
    state.imgList.push(data);
  });
};

const handleUrlSuccess3 = (response) => {
  let url = "https://mlcfjihuaqn.yxiaozhu.com/" + response.key;
  axios.get("/assets/qiniu_httpurl?httpurl=" + url).then((data) => {
    specificationArea[img_index.value].image = data;
  });
};

function delImg(index) {
  state.imgList.splice(index, 1);
}
function delImg2(type) {
  if (type == 1) {
    state.good.video_url = "";
  } else {
    state.good.cover_url = "";
  }
}

//添加其他规格区
function additionClick() {
  specificationArea.push({
    image: "",
    value: "",
    price: "",
    price_line: "",
    cost: "",
    stock: "",
    room: "",
    is_default: 0,
    switchFlag: false,
    lower_num_people: null,//人数下限
    upper_num_people: null,//人数上限
  })
}

//批量设置函数
function pl_setupall() {
  specificationArea.map((item, index) => {
    if (pl_random_fee.value.length > 0) {
      specificationArea[index].random_fee = Object.is(
        (parseInt(pl_random_fee.value) / 100) *
        specificationArea[index].price,
      )
        ? 0
        : parseInt(
          (parseInt(pl_random_fee.value) / 100) *
          specificationArea[index].price
        );
    }
    if (pl_price_line.value.length > 0) {
      specificationArea[index].price_line = parseInt(
        pl_price_line.value
      );
    }
  });
}

//计算收益
function calculateClick(item, index) {
  // (售价减会员价-利润)*0.8  分享收益
  // 层级收益 老板收益
  // 直推平级0.1
  if (item.price > 0) {
    //层级收益
    // const parent_fee = (Number(item.price)-Number(item.cost)-Number(item.profit))*0
    // this.$set(this.specificationArea[index], 'parent_fee', parent_fee.toFixed(2))
    //老板收益
    // const top_fee = (Number(item.price)-Number(item.cost)-Number(item.profit))*0.2
    // this.$set(this.specificationArea[index], 'top_fee', top_fee.toFixed(2))

    //分享收益
    const share_fee =
      (Number(item.price) -
        Number(item.wholesale_price) -
        Number(item.profit)) *
      0.8;

    specificationArea[index].share_fee = share_fee.toFixed(2);

    //平级收益
    const eqlevel_fee =
      (Number(item.price) - Number(item.cost) - Number(item.profit)) * 0.1;
    specificationArea[index].eqlevel_fee = eqlevel_fee.toFixed(2);

    //直推收益
    const p_fee =
      (Number(item.price) - Number(item.cost) - Number(item.profit)) * 0.1;
    const r_fee =
      (Number(item.price) - Number(item.cost) - Number(item.profit)) * 0.1;
    const recommender_fee = (p_fee + r_fee).toFixed(2);
    specificationArea[index].recommender_fee = recommender_fee.toFixed(2);

    //计算税
    const pur_price = Number(item.purchase_price) * 0.07;
    specificationArea[index].taxation_txt = pur_price.toFixed(2);

    //计算会员费用
    const vip_prie =
      Number(item.purchase_price) +
      Number(item.freight_txt) +
      Number(item.taxation_txt);
    specificationArea.wholesale_price = vip_prie.toFixed(2);
  } else {
    return ElMessage.error("请填写售价");
  }
}
function calculateClick2(item, index) {
  if (item.price > 0) {
    //层级收益
    // const parent_fee = (Number(item.price)-Number(item.cost)-Number(item.profit))*0
    // this.$set(this.specificationArea[index], 'parent_fee', parent_fee.toFixed(2))
    //老板收益
    // const top_fee = (Number(item.price)-Number(item.cost)-Number(item.profit))*0.2
    // this.$set(this.specificationArea[index], 'top_fee', top_fee.toFixed(2))

    //分享收益
    const share_fee =
      (Number(item.price) -
        Number(item.wholesale_price) -
        Number(item.profit)) *
      0.8;
    specificationArea[index].share_fee = share_fee.toFixed(2);


    //平级收益
    const eqlevel_fee =
      (Number(item.price) - Number(item.cost) - Number(item.profit)) * 0.1;
    specificationArea[index].eqlevel_fee = eqlevel_fee.toFixed(2);
    //直推收益
    const p_fee =
      (Number(item.price) - Number(item.cost) - Number(item.profit)) * 0.1;
    const r_fee =
      (Number(item.price) - Number(item.cost) - Number(item.profit)) * 0.1;
    const recommender_fee = (p_fee + r_fee).toFixed(2);
    specificationArea[index].recommender_fee = recommender_fee.toFixed(2);

    //计算税
    const pur_price = Number(item.purchase_price) * 0.13;
    specificationArea[index].taxation_txt = pur_price.toFixed(2);

    //计算会员费用
    const vip_prie =
      Number(item.purchase_price) +
      Number(item.freight_txt) +
      Number(item.taxation_txt);
    specificationArea[index].wholesale_price = vip_prie.toFixed(2);

  } else {
    return ElMessage.error("请填写售价");
  }
}

//层级收益判断
function parent_feeInput(item, index) {
  if (
    item.parent_fee >
    Number(item.price) + Number(item.cost) + Number(item.profit)
  ) {
    specificationArea[index].parent_fee = "";
    return ElMessage.error("层级收益不能大于售价+成本+利润的总和");
  }
}

//老板收益判断
function top_feeInput(item, index) {
  if (
    item.top_fee >
    Number(item.price) + Number(item.cost) + Number(item.profit)
  ) {
    specificationArea[index].top_fee = "";
    return ElMessage.error("老板收益不能大于售价+成本+利润的总和");
  }
}

//平级收益判断
function eqlevel_feeInput(item, index) {
  if (
    item.eqlevel_fee >
    Number(item.price) + Number(item.cost) + Number(item.profit)
  ) {
    specificationArea[index].eqlevel_fee = "";
    return ElMessage.error("平级收益不能大于售价+成本+利润的总和");
  }
}
//直推收益判断
function recommender_feeInput(item, index) {
  if (
    item.recommender_fee >
    Number(item.price) + Number(item.cost) + Number(item.profit)
  ) {
    specificationArea[index].recommender_fee = "";
    return ElMessage.error("直推收益不能大于售价+成本+利润的总和");
  }
}

//删除其他规格区商品图片
function delImgClick(item) {
  item.image = "";
}

//增加自定义规格标题
function zidingyiTitleClick() {
  zidingyi_title.value.push({
    title: zidingyi_titlename.value,
    val: [],
  });
  addzidingyi_title_init();
}

//删除自定义规格标题
function delTitleClick(index) {
  //删除zidingyi_list
  zidingyi_list.value.map((item, num) => {
    if (item.hasOwnProperty(zidingyi_title.value[index].title)) {
      delete zidingyi_list[num][zidingyi_title.value[index].title];
    }
  });
  //zidingyi_list_res
  zidingyi_list_res.value.map((item, num) => {
    if (item.hasOwnProperty(zidingyi_title.value[index].title)) {
      delete zidingyi_list_res.value[num][zidingyi_title.value[index].title];
    }
  });
  //删除zidingyi_title
  zidingyi_title.value.splice(index, 1);
  //删除zidingyi_title_res
  zidingyi_title_res.value.splice(index, 1);
}

function addzidingyi_title_init() {
  zidingyi_title_res.value = [];
  zidingyi_title.value.map((item, index) => {
    zidingyi_title_res.value[index] = {};
    zidingyi_title_res.value[index]["title"] = item.title;
    zidingyi_title_res.value[index]["val"] = item.val;
  });
  let $n = zidingyi_title_res.value.length;
  // zidingyi_title_res.value[$n] = {};
  // zidingyi_title_res.value[$n]["title"] = "规格";
  // zidingyi_title_res.value[$n]["val"] = [];
  // $n++;
  zidingyi_title_res.value[$n] = {};
  zidingyi_title_res.value[$n]["title"] = "库存";
  zidingyi_title_res.value[$n]["val"] = [];
  $n++;
  zidingyi_title_res.value[$n] = {};
  zidingyi_title_res.value[$n]["title"] = "克重";
  zidingyi_title_res.value[$n]["val"] = [];
  $n++;
  zidingyi_title_res.value[$n] = {};
  zidingyi_title_res.value[$n]["title"] = "成本";
  zidingyi_title_res.value[$n]["val"] = [];
  $n++;
  zidingyi_title_res.value[$n] = {};
  zidingyi_title_res.value[$n]["title"] = "售价";
  zidingyi_title_res.value[$n]["val"] = [];
  $n++;
  // zidingyi_title_res.value[$n] = {};
  // zidingyi_title_res.value[$n]["title"] = "会员价";
  // zidingyi_title_res.value[$n]["val"] = [];
  // $n++;
  // zidingyi_title_res.value[$n] = {};
  // zidingyi_title_res.value[$n]["title"] = "供货";
  // zidingyi_title_res.value[$n]["val"] = [];
  // $n++;
  // zidingyi_title_res.value[$n] = {};
  // zidingyi_title_res.value[$n]["title"] = "层级";
  // zidingyi_title_res.value[$n]["val"] = [];
  // $n++;
  zidingyi_title_res.value[$n] = {};
  zidingyi_title_res.value[$n]["title"] = "直推";
  zidingyi_title_res.value[$n]["val"] = [];
  $n++;
  // zidingyi_title_res.value[$n] = {};
  // zidingyi_title_res.value[$n]["title"] = "老板";
  // zidingyi_title_res.value[$n]["val"] = [];
  // $n++;
  zidingyi_title_res.value[$n] = {};
  zidingyi_title_res.value[$n]["title"] = "分享";
  zidingyi_title_res.value[$n]["val"] = [];
  $n++;
  // zidingyi_title_res.value[$n] = {};
  // zidingyi_title_res.value[$n]["title"] = "平级";
  // zidingyi_title_res.value[$n]["val"] = [];
  // $n++;
  zidingyi_title_res.value[$n] = {};
  zidingyi_title_res.value[$n]["title"] = "随机分";
  zidingyi_title_res.value[$n]["val"] = [];
  $n++;
  // zidingyi_title_res.value[$n] = {};
  // zidingyi_title_res.value[$n]["title"] = "团长";
  // zidingyi_title_res.value[$n]["val"] = [];
  // $n++;
  // zidingyi_title_res.value[$n] = {};
  // zidingyi_title_res.value[$n]["title"] = "上级团";
  // zidingyi_title_res.value[$n]["val"] = [];
  // $n++;
  zidingyi_title_res.value[$n] = {};
  zidingyi_title_res.value[$n]["title"] = "图片";
  zidingyi_title_res.value[$n]["val"] = [];
  $n++;
}

function addzidingyi_titel(index) {
  zidingyi_title.value[index].val.push({ v: "" });
}
function delzidingyi_titel(index, val) {
  ElMessageBox.confirm("此操作将永久删除该文件, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      //删除 zidingyi_list_res
      zidingyi_list_res.value.map((item, num) => {
        if (item.hasOwnProperty(zidingyi_title.value[index].title)) {
          if (item[zidingyi_title.value[index].title] == val) {
            zidingyi_list_res.value.splice(num, 1);
          }
        }
      });

      //删除 zidingyi_list
      zidingyi_list.value.map((item, num) => {
        if (item.hasOwnProperty(zidingyi_title.value[index].title)) {
          if (item[zidingyi_title.value[index].title] == val) {
            zidingyi_list.value.splice(num, 1);
          }
        }
      });
      //删除 zidingyi_title
      zidingyi_title.value[index].val.map((item, num) => {
        if (item.v == val) {
          zidingyi_title.value[index].val.splice(num, 1);
        }
      });

      ElMessage({
        type: "success",
        message: "删除成功!",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
  console.log(index, val, "------------index----val--");
}
// 一键载入
function zidingyiAttrOneClick() {
  zidingyi_list.value = [];
  zidingyi_title.value.map((item1, index1) => {
    let this_list = JSON.parse(JSON.stringify(zidingyi_list.value));
    let vv = item1.title;
    item1.val.map((item2, index2) => {
      if (index1 == 0) {
        //初始化表格
        console.log("------------------------1");
        zidingyi_list.value[index2] = {};
        zidingyi_list.value[index2][vv] = item2.v;
      } else if (index2 == 0) {
        //给原有表格增加列
        console.log("------------------------2");
        this_list.map((item3, index3) => {
          zidingyi_list.value[index3][vv] = item2.v;
        });
      } else {
        //生成增加列
        console.log("------------------------3");
        this_list.map((item3, index3) => {
          let this_index = zidingyi_list.value.length;
          zidingyi_list.value[this_index] = {};
          for (let key in item3) {
            zidingyi_list.value[this_index][key] = item3[key];
          }
          zidingyi_list.value[this_index][vv] = item2.v;
        });
      }
    });
  });
  zidingyi_list_res_init();
}

function zidingyi_list_res_init() {
  let this_list_res = JSON.parse(JSON.stringify(zidingyi_list_res.value));
  let this_zidingyi_list_res = [];
  let this_zidingyi_list_res_order = [];
  zidingyi_list_res.value = [];
  zidingyi_list.value.map((item, index) => {
    if (this_list_res.length > index) {
      for (let key in item) {
        this_zidingyi_list_res[index][key] = this_list_res[index].hasOwnProperty(key) ? this_list_res[index][key] : item[key];
      }
    } else {
      this_zidingyi_list_res[index] = {};
      for (let key in item) {
        this_zidingyi_list_res[index][key] = item[key];
      }
      // this_zidingyi_list_res[index]["规格"] = "0";
      this_zidingyi_list_res[index]["库存"] = "0";
      this_zidingyi_list_res[index]["克重"] = "0";
      this_zidingyi_list_res[index]["成本"] = "0";
      this_zidingyi_list_res[index]["售价"] = "0";
      // this_zidingyi_list_res[index]["会员价"] = "0";
      // this_zidingyi_list_res[index]["供货"] = "0";
      // this_zidingyi_list_res[index]["层级"] = "0";
      this_zidingyi_list_res[index]["直推"] = "0";
      // this_zidingyi_list_res[index]["老板"] = "0";
      this_zidingyi_list_res[index]["分享"] = "0";
      // this_zidingyi_list_res[index]["平级"] = "0";
      this_zidingyi_list_res[index]["随机分"] = "0";
      // this_zidingyi_list_res[index]["团长"] = "0";
      // this_zidingyi_list_res[index]["上级团"] = "0";
      this_zidingyi_list_res[index]["图片"] = "";
    }
  });
  //排序
  zidingyi_title.value[0].val.map((itemt, indext) => {
    this_zidingyi_list_res.map((item, index) => {
      //this.zidingyi_title[0].title
      if (
        this_zidingyi_list_res[index][zidingyi_title.value[0].title] ==
        itemt.v
      ) {
        this_zidingyi_list_res_order.push(this_zidingyi_list_res[index]);
      }
    });
  });

  zidingyi_list_res.value = this_zidingyi_list_res_order;
}

function renderTipsHeader({ column }) {
  let arr = [
    // "规格",
    "库存",
    "克重",
    "成本",
    "售价",
    // "会员价",
    // "供货",
    // "层级",
    "直推",
    // "老板",
    "分享",
    // "平级",
    // "团长",
    // "上级团",
    "随机分",
    "图片"
  ]

  if (
    arr.indexOf(column.label) > 1
  ) {
    return h("div", [
      h("span", column.label),
      h(
        "el-button",
        {
          props: {
            type: "text",
            size: "small",
            icon: "el-icon-document-copy",
            // title:'向下复制第一行内容'
          },
          style: "margin-left:2px",
          on: {
            click: function () {
              clickTitleButton(column);
            },
          },
        },
        ""
      ),
    ]);
  } else {
    return h("div", [h("span", column.label)]);
  }
}
//删除自定义规格标题
function clickTitleButton(data) {
  let this_list_res_order = JSON.parse(
    JSON.stringify(zidingyi_list_res.value)
  );
  this_list_res_order.map((item, num) => {
    if (num >= 1) {
      item[data.label] = this_list_res_order[0][data.label];
    }
  });
  zidingyi_list_res.value = this_list_res_order;
}
// 刷新全值
function zidingyigetval() {
  addzidingyi_title_init();
  zidingyi_list_res_init_flush();
}
function zdyuploadClick(data) {
  console.log(data, '------------------------------zdyuploadClick')
  zdyimgIndex.value = data.$index;
}
//删除其他规格区商品图片
function zdydelImgClick(item) {
  item.row['图片'] = "";
}
function zdyhandSuccess(result) {
  let res = JSON.parse(result);
  // result 即服务端返回的接口
  // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
  // if (result.data && result.data.length) {
  //   result.data.forEach((item) => insertImgFn(item));
  // }

  axios.get("/assets/qiniu_httpurl?httpurl=" + 'https://mlcfjihuaqn.yxiaozhu.com/' + res.key).then((data) => {
    // specificationArea[img_index.value].image = data;
    zidingyi_list_res.value[zdyimgIndex.value]['图片'] = data;
  });

}
function zidingyi_list_res_init_flush() {
  let this_list_res = JSON.parse(JSON.stringify(zidingyi_list_res.value));
  this_list_res.map((item, index) => {
    this_list_res[index]["团长"] = "0";
    this_list_res[index]["上级团"] = "0";
  });
  zidingyi_list_res.value = this_list_res;
}

//自定义贵规格填充快速
function clickKuaisuJisuan(data) {
  zidingyi_list_res.value[data.$index]["会员价"] =
    zidingyi_list_res.value[data.$index]["成本"] +
    zidingyi_list_res.value[data.$index]["售价"] * 0.1;
  zidingyi_list_res.value[data.$index]["直推"] =
    zidingyi_list_res.value[data.$index]["售价"] * 0.01;
}

const submitAdd = () => {
  let str = instance.txt.html()
  const cleanedString = str.replace(/&amp;/g, "&");
  goodRef.value.validate((vaild) => {
    if (vaild) {
      state.good.image_url = state.imgList.join(',');
      state.good.zdyspec = JSON.stringify(zidingyi_title.value) + "@@" + JSON.stringify(zidingyi_title_res.value) + "@@" + JSON.stringify(zidingyi_list.value) + "@@" + JSON.stringify(zidingyi_list_res.value);
      delete state.good.parent_category_id;
      state.good.coinable_number = state.good.coinable_number * 100
      const data = {
        good: state.good,
        delivery_rule: [],
        good_spec: [],
        //商品图片
        good_image: state.imgList.map((item) => {
          return { "good_id@": state.good.id ? state.good.id : 'good.id', image: item };
        }),
        good_text: {
          'good_id@': state.good.id ? state.good.id : 'good.id',
          description: cleanedString,
          id: TGoodText.value.id
        },
        good_spec_detail: [],
        good_spec_combo: [],
        good_rule: {}
      };
      // let data = {
      //   "good": {
      //     "display": "1", "is_wholesale": "0", "coinable": "0", "priority": 0, "title": "商品测试2.13", "subtitle": "副标题测试2.13", "id": null, "supplier_id": null, "share_ratio": null, "video_url": "",
      //     "cover_url": "https://mlcfjihuaqn.yxiaozhu.com/商品主图_1.jpg?e=3479289878&token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:FgMuwROxgsBguYVrxdxXk_Vs5XY=",
      //     "image_url": "https://mlcfjihuaqn.yxiaozhu.com/商品主图_2.jpg?e=3479289882&token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:L8wzmn6n9pe6ellTduPX8UMtMlA=,https://mlcfjihuaqn.yxiaozhu.com/商品主图_3.jpg?e=3479289888&token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:cVFBgWXPAdddzVuVg2Y_VriW5jM=,https://mlcfjihuaqn.yxiaozhu.com/商品主图_4.jpg?e=3479289892&token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:6GKlnJN_r9BBIx0YVBK89_U3IwI=",
      //     "type": 1,
      //     "status": 1,
      //     "stock_cordon": "0",
      //     "expired_time": 1769875200, "order_expired_time": null,
      //     "introducer_id": null, "category_id": 24, "coinable_number": 0,
      //     "store_id": null, "fake_owner_name": "", "fake_owner_phone": "",
      //     "zdyspec": "[{\"title\":\"测试1\",\"val\":[{\"v\":\"555\"},{\"v\":\"777\"}]},{\"title\":\"测试2\",\"val\":[{\"v\":\"666\"}]}]@@[{\"title\":\"测试1\",\"val\":[{\"v\":\"555\"},{\"v\":\"777\"}]},{\"title\":\"测试2\",\"val\":[{\"v\":\"666\"}]},{\"title\":\"库存\",\"val\":[]},{\"title\":\"克重\",\"val\":[]},{\"title\":\"成本\",\"val\":[]},{\"title\":\"售价\",\"val\":[]},{\"title\":\"直推\",\"val\":[]},{\"title\":\"分享\",\"val\":[]},{\"title\":\"随机分\",\"val\":[]},{\"title\":\"图片\",\"val\":[]}]@@[{\"测试1\":\"555\"},{\"测试1\":\"777\"}]@@[{\"测试1\":\"555\",\"库存\":\"15\",\"克重\":\"0\",\"成本\":\"15\",\"售价\":\"99\",\"直推\":\"50\",\"分享\":\"0\",\"随机分\":\"2\",\"图片\":\"https://mlcfjihuaqn.yxiaozhu.com/f214203c-e9d5-11ef-8c20-00163e410368.jpg?e=3479290114&token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:D4lVrz1xToXyrYYQx9B6DUsBZCs=\"},{\"测试1\":\"777\",\"库存\":\"15\",\"克重\":\"0\",\"成本\":\"15\",\"售价\":\"199\",\"直推\":\"50\",\"分享\":\"0\",\"随机分\":\"2\",\"图片\":\"https://mlcfjihuaqn.yxiaozhu.com/f37638b6-e9d5-11ef-9c18-00163e410368.jpg?e=3479290118&token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:o9RFIFjXmLsmL8JDq8VwX-UXO9M=\"}]", "sale_type": "0"
      //   },
      //   "delivery_rule": [],
      //   "good_spec": [],
      //   "good_image": [
      //     { "good_id@": "good.id", "image": "https://mlcfjihuaqn.yxiaozhu.com/商品主图_2.jpg?e=3479289882&token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:L8wzmn6n9pe6ellTduPX8UMtMlA=" },
      //     { "good_id@": "good.id", "image": "https://mlcfjihuaqn.yxiaozhu.com/商品主图_3.jpg?e=3479289888&token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:cVFBgWXPAdddzVuVg2Y_VriW5jM=" },
      //     { "good_id@": "good.id", "image": "https://mlcfjihuaqn.yxiaozhu.com/商品主图_4.jpg?e=3479289892&token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:6GKlnJN_r9BBIx0YVBK89_U3IwI=" }
      //   ],
      //   "good_text": { "good_id@": "good.id", "description": "<p><img src=\"https://mlcfjihuaqn.yxiaozhu.com/b72a2516-e9d5-11ef-9c18-00163e410368.jpg?e=3479289916&amp;token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:eKQewaA0SIc6EC1rasUSmdzhMf8=\" style=\"max-width:100%;\" contenteditable=\"false\"/><img src=\"https://mlcfjihuaqn.yxiaozhu.com/b8fc44c8-e9d5-11ef-8d90-00163e410368.jpg?e=3479289922&amp;token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:Wmy_k5JLc1JpzSdlpu5vjXblrnE=\" style=\"max-width:100%;\" contenteditable=\"false\"/><img src=\"https://mlcfjihuaqn.yxiaozhu.com/ba653982-e9d5-11ef-9388-00163e410368.jpg?e=3479289926&amp;token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:9AqE1Db-NWgtHKJ0HewKrjZ0qgw=\" style=\"max-width:100%;\" contenteditable=\"false\"/><img src=\"https://mlcfjihuaqn.yxiaozhu.com/bc026814-e9d5-11ef-9388-00163e410368.jpg?e=3479289932&amp;token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:VnEtjcEcDv9iYcaxn5q6fPf-oEU=\" style=\"max-width:100%;\" contenteditable=\"false\"/><img src=\"https://mlcfjihuaqn.yxiaozhu.com/bdc556b6-e9d5-11ef-9c18-00163e410368.jpg?e=3479289938&amp;token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:RHZU07l3ndeNsTxWMq7aPw899CQ=\" style=\"max-width:100%;\" contenteditable=\"false\"/><img src=\"https://mlcfjihuaqn.yxiaozhu.com/bf542e44-e9d5-11ef-9c18-00163e410368.jpg?e=3479289944&amp;token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:Uuw6P7IUkOd0OgciaEExfkEIMPc=\" style=\"max-width:100%;\" contenteditable=\"false\"/><img src=\"https://mlcfjihuaqn.yxiaozhu.com/c0bb060e-e9d5-11ef-8c20-00163e410368.jpg?e=3479289948&amp;token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:eZ5Xe8-AF7dhfklkZpl9wtWJB7Q=\" style=\"max-width:100%;\" contenteditable=\"false\"/><img src=\"https://mlcfjihuaqn.yxiaozhu.com/c21d4034-e9d5-11ef-9c18-00163e410368.jpg?e=3479289952&amp;token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:TqkC2_jd515C1Kthk2W6sNDce7o=\" style=\"max-width:100%;\" contenteditable=\"false\"/><img src=\"https://mlcfjihuaqn.yxiaozhu.com/c400117e-e9d5-11ef-9c18-00163e410368.jpg?e=3479289958&amp;token=8HYKX7kOi_0yI5lbCm9L15PD17ROW4bDVRCIXtCA:SFBwXgUypQfmNpmn65fVc1l2MlA=\" style=\"max-width:100%;\" contenteditable=\"false\"/></p>" },
      //   "good_spec_detail": [],
      //   "good_spec_combo": [],
      //   "good_rule": {}
      // }
      let url = id ? '/autoselladmin/manage/good_details/update' : '/autoselladmin/manage/good/create';
      axios.post(url, data).then((res) => {
        ElMessage.success("保存成功");
        router.go(-1);
      });
    }
  });
}


function init_zdyspec() {
  let [t1, t2, t3, t4] = state.good.zdyspec.split('@@')
  zidingyi_title.value = JSON.parse(t1)
  zidingyi_title_res.value = JSON.parse(t2)
  zidingyi_list.value = JSON.parse(t3)
  zidingyi_list_res.value = JSON.parse(t4)
}


function searchSupplier() {
  if (!state.good.supplier_id) {
    ElMessage.error("请输入供应商id");
    return
  }
  let params = {
    employee_id: state.good.supplier_id
  }
  axios.get('/autoselladmin/manage/supplier/register_info', { params: params }).then((res) => {
    employeeObj.value = res;
  }).catch(e => {
    ElMessage.error("系统错误，请联系管理员");
  })
}
</script>

<style scoped>
@import '../../styles/good.scss';
</style>