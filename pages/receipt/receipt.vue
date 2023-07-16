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
      <u-icon name="scan" color="#214579" size="36" @click="bindMaterialScan"></u-icon>
    </view>
    <u-gap height="80rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <u-cell class="coding-name" :border="false" isLink arrow-direction="down" @click="bindMaterial">
        <view class="title" slot="title">
          <text v-if="!inboundInfo.materialDesc" class="placeholder">请选择或扫描物料编码</text>
          <text v-else>{{inboundInfo.materialDesc}}</text>
        </view>
      </u-cell>
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
    <u-picker :show="locationShow" ref="locationRef" keyName="name"
              :columns="locationColumns" confirmColor="#214579"
              @confirm="confirmLocation" @cancel="bindClose"
              @close="bindClose" @change="bindLocationChange"></u-picker>
    <!--物料选择器 -->
    <u-picker :show="materialShow" :columns="materialColumns"
              :defaultIndex="materialIndex" keyName="name"
              confirmColor="#214579" @cancel="bindClose"
              @close="bindClose" @confirm="confirmMaterial"></u-picker>
  </view>
</template>

<script>
import {getStockList, putInStorage, getLocationDetail} from "@/api/stock";
import {getMaterialBaseData} from "@/api/warehouse";
import {handleTree} from "@/utils/tree";

export default {
  data() {
    return {
      locationShow: false, // 库位选择器
      locationArr: [], // 库位列表
      locationIndex: [0, 0, 0], // 库位选择器索引
      locationColumns: [[],[],[]], // 库位选择器列
      materialShow: false, // 物料选择器
      materialIndex: [0], // 物料选择器索引
      materialColumns: [], // 物料选择器列
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
      console.log(this.inboundInfo)
      return !this.inboundInfo.materialId || !this.inboundInfo.storeAreaId
    },
    materialList() {
      return this.$store.getters.materialList
    }
  },
  onLoad() {
    this.materialColumns = [this.materialList || []]
    this.getStockList()
  },
  methods: {
    // 获取所有库位及其父集列表
    getStockList() {
      getStockList().then(res => {
        this.locationArr = handleTree(res.data)
        this.locationArr.forEach((item) => {
          this.locationColumns[0].push({ ...item });
        });
        if (this.locationArr[0]?.children?.length > 0) {
          this.locationArr[0].children.forEach((item) => {
            this.locationColumns[1].push({ ...item });
          });
          if (this.locationArr[0].children[0]?.children?.length > 0) {
            this.locationArr[0].children[0].children.forEach((item) => {
              this.locationColumns[2].push({ ...item });
            });
          } else {
            this.locationColumns[2] = [];
          }
        } else {
          this.locationColumns[1] = [];
          this.locationColumns[2] = [];
        }
      })
    },
    // 获取物料基础数据
    getMaterialBaseData(id) {
      getMaterialBaseData({id}).then(res => {
        const {data} = res
        this.inboundInfo.materialDesc = `${data.code}`
        this.inboundInfo.materialId = data.id
        this.inboundInfo.materialName = data.name
        this.inboundInfo.materialSpecs = data.specs
      })
    },
    // 获取库位详情
    getLocationDetail(areaId, location) {
      getLocationDetail({areaId, location}).then(res => {
        const {data} = res
        this.inboundInfo.storeAreaDesc = `${data.storeName} ${data.areaName} ${data.location}`
        this.inboundInfo.storeAreaId = data.areaId
        this.inboundInfo.location = data.location
      })
    },
    // 扫码库位编码
    bindMaterialScan() {
      uni.scanCode({
        success: (res) => {
          const {result} = res
          const {areaId, location} = JSON.parse(result)
          this.getLocationDetail(areaId, location)
        }
      });
    },
    // 扫码基础数据
    bindBaseScan() {
      uni.scanCode({
        success: (res) => {
          const {result} = res
          const id = parseInt(result)
          this.getMaterialBaseData(id)
        }
      });
    },
    // 打开物料选择
    bindMaterial() {
      this.materialShow = true
    },
    // 确认物料
    confirmMaterial(e) {
      const [item] = e.value
      this.getMaterialBaseData(item.id)
      this.materialShow = false
    },
    // 打开库位选择
    bindLocation() {
      this.locationShow = true
    },
    // 改变库位
    bindLocationChange(e) {
      const {columnIndex, index, picker = this.$refs.locationRef} = e
      // 根据列的索引值，判断当前改变的是哪一列，然后改变对应的列数据
      if (columnIndex === 0) {
        this.locationColumns[1] = this.locationArr[index]?.children || []
        picker.setColumnValues(1, this.locationColumns[1])
        this.locationColumns[2] = this.locationArr[index]?.children?.[0]?.children || []
        picker.setColumnValues(2, this.locationColumns[2])
      } else if (columnIndex === 1) {
        this.locationColumns[2] = this.locationArr[this.locationIndex[0]]?.children[index]?.children || []
        picker.setColumnValues(2, this.locationColumns[2])
      }
    },
    // 确认库位
    confirmLocation(e) {
      const [arr1, arr2, arr3] = e.value
      if (!arr1?.id || !arr2?.id || !arr3?.id || arr3?.type !== 2) {
        uni.$u.toast('请选择库位')
        return
      }
      this.getLocationDetail(arr3.parentId, arr3.location)
      this.locationShow = false
    },
    // 关闭选择器
    bindClose() {
      this.materialShow = false
      this.locationShow = false
    },
    // 入库
    bindInStorage() {
      putInStorage(this.inboundInfo).then(res => {
        uni.$u.toast('入库成功')
        // 返回上一页
        setTimeout(() => {
          uni.navigateBack()
        }, 300)
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
