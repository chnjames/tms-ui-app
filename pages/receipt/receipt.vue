<template>
  <view class="container">
    <u--text color="#aaaaaa" text="库位编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <u-cell class="coding-name" :border="false" isLink arrow-direction="down" @click="bindLocation">
        <view class="title" slot="title">
          <text v-if="!inboundInfo.storeAreaDesc" class="placeholder">请选择或扫描库位编码</text>
          <text v-else>{{inboundInfo.storeAreaDesc}}</text>
        </view>
      </u-cell>
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="80rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <u--input class="coding-name" v-model="inboundInfo.materialDesc" readonly border="bottom" color="#214579" fontSize="28rpx" placeholder="请扫描物料条码"></u--input>
      <u-icon name="scan" color="#214579" size="36" @click="bindBaseScan"></u-icon>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view class="quantity">
      <u--text color="#aaaaaa" text="物料数量"></u--text>
      <u-number-box v-model="inboundInfo.qty" :min="1" @change="bindQuantity"></u-number-box>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view v-if="inboundInfo.materialId">
      <u--text color="#aaaaaa" text="物料名称"></u--text>
      <u-gap height="20rpx"></u-gap>
      <u--text size="28rpx" color="#666666" :text="inboundInfo.materialName"></u--text>
      <u-gap height="40rpx"></u-gap>
      <u--text color="#aaaaaa" text="物料规格"></u--text>
      <u-gap height="20rpx"></u-gap>
      <u--text size="28rpx" color="#666666" :text="inboundInfo.materialSpecs"></u--text>
    </view>
    <u-button class="receive" text="确 定" :disabled="isSubmit" color="#214579" shape="circle" @click="bindInStorage"></u-button>
    <!--库位选择器-->
    <u-picker :show="materialShow" ref="materialRef" keyName="name" :columns="materialColumns" confirmColor="#214579" @confirm="confirmMaterial" @cancel="bindClose"
              @close="bindClose" @change="bindMaterialChange"></u-picker>
  </view>
</template>

<script>
import {getStockList, putInStorage} from "@/api/stock";
import {getMaterialBaseData, getAllMaterial} from "@/api/warehouse";
import {handleTree} from "@/utils/tree";

export default {
  data() {
    return {
      locationShow: false, // 库位选择器
      locationArr: [], // 库位列表
      locationIndex: [0, 0, 0], // 库位选择器索引
      locationColumns: [[],[],[]], // 库位选择器列
      materialShow: false, // 物料选择器
      materialArr: [], // 物料列表
      materialIndex: [0, 0, 0], // 物料选择器索引
      materialColumns: [[],[],[]], // 物料选择器列
      // 入库
      inboundInfo: {
        materialId: '', // 物料ID
        materialName: '', // 物料名称
        materialSpecs: '', // 物料规格
        materialDesc: '', // 物料描述
        storeAreaId: '', // 库区ID => 对应parentId
        storeAreaDesc: '', // 库区描述
        location: '', // 库位码
        qty: 1
      }
    };
  },
  computed: {
    isSubmit() {
      return !this.inboundInfo.materialId || !this.inboundInfo.storeAreaId
    }
  },
  onLoad() {
    this.getStockList()
  },
  methods: {
    // 获取所有库位及其父集列表
    getStockList() {
      getStockList().then(res => {
        this.materialArr = handleTree(res.data)
        this.materialArr.forEach((item) => {
          this.materialColumns[0].push({ ...item });
        });
        if (this.materialArr[0]?.children?.length > 0) {
          this.materialArr[0].children.forEach((item) => {
            this.materialColumns[1].push({ ...item });
          });
          if (this.materialArr[0].children[0]?.children?.length > 0) {
            this.materialArr[0].children[0].children.forEach((item) => {
              this.materialColumns[2].push({ ...item });
            });
          } else {
            this.materialColumns[2] = [];
          }
        } else {
          this.materialColumns[1] = [];
          this.materialColumns[2] = [];
        }
      })
    },
    // 获取物料列表
    getAllMaterial() {
      getAllMaterial().then(res => {
        console.log(res.data)
        this.PNColumns = [res.data || []]
      })
    },
    // 获取物料基础数据
    getMaterialBaseData(id) {
      getMaterialBaseData({id}).then(res => {
        const {data} = res
        this.inboundInfo.materialDesc = `${data.code}/${data.category}`
        this.inboundInfo.materialId = data.id
        this.inboundInfo.materialName = data.name
        this.inboundInfo.materialSpecs = data.specs
      })
    },
    // 扫码库位编码
    bindScan() {
      this.inboundInfo.storeAreaDesc = `012303 原材料仓 01号库位`
      this.inboundInfo.storeAreaId = 25
      this.inboundInfo.location = '1-1-1'
      uni.scanCode({
        success: (res) => {
          console.log(res)
        }
      });
    },
    // 扫码基础数据
    bindBaseScan() {
      this.getMaterialBaseData()
      uni.scanCode({
        success: (res) => {
          console.log(res)
        }
      });
    },
    // 打开物料选择
    bindLocation() {
      this.locationShow = true
    },
    // 改变物料
    bindMaterialChange(e) {
      console.log(e)
      const {columnIndex, index, picker = this.$refs.materialRef} = e
      console.log(columnIndex, index, picker)
      // 根据列的索引值，判断当前改变的是哪一列，然后改变对应的列数据
      if (columnIndex === 0) {
        this.materialColumns[1] = this.materialArr[index]?.children || []
        picker.setColumnValues(1, this.materialColumns[1])
        this.materialColumns[2] = this.materialArr[index]?.children?.[0]?.children || []
        picker.setColumnValues(2, this.materialColumns[2])
      } else if (columnIndex === 1) {
        this.materialColumns[2] = this.materialArr[this.materialIndex[0]]?.children[index]?.children || []
        picker.setColumnValues(2, this.materialColumns[2])
      }
    },
    // 确认物料
    confirmMaterial(e) {
      const [arr1, arr2, arr3] = e.value
      console.log(e.value)
      if (!arr1?.id || !arr2?.id || !arr3?.id) {
        uni.$u.toast('请选择设备')
        return
      }
      // this.taskInfo.deviceName = `${arr3.name}`
      // this.taskInfo.deviceId = arr3.id
      this.getMaterialBaseData(arr3.id)
      this.materialShow = false
    },
    // 关闭选择器
    bindClose() {
      this.materialShow = false
    },
    // 入库
    bindInStorage() {
      putInStorage(this.inboundInfo).then(res => {
        uni.$u.toast('入库成功')
        // 返回上一页
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      })
    },
    // 物料数量
    bindQuantity(e) {
      this.inboundInfo.qty = e.value
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  .quantity,
  .coding {
    @include flex-space-between;
  }

  .coding-name {
    flex: 1;
    background-color: #ffffff;
    border-radius: 10rpx;
    margin-right: 20rpx;

    .title {
      color: $custom-content-color;
      font-size: 24rpx;
    }
  }

  .placeholder {
    color: #aaaaaa;
  }
}

.receive {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 200rpx;
  width: 200rpx;
}
</style>
