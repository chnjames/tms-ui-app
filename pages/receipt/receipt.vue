<template>
  <view class="container">
    <u--text color="#aaaaaa" text="库位编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <u--input class="coding-name" v-model="inboundInfo.storeAreaDesc" readonly border="bottom" color="#214579" fontSize="28rpx" placeholder="请扫描库位编码"></u--input>
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
  </view>
</template>

<script>
import {getStockList, putInStorage} from '../../api/stock'
import {getMaterialBaseData} from '../../api/warehouse'

export default {
  data() {
    return {
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
  created() {
    this.getStockList()
    setTimeout(() => {
      this.getMaterialBaseData()
    }, 2000)
  },
  methods: {
    // 获取所有库位及其父集列表
    getStockList() {
      getStockList().then(res => {
        console.log(res)
      })
    },
    // 获取物料基础数据
    getMaterialBaseData() {
      getMaterialBaseData({id: 3}).then(res => {
        const {data} = res
        this.inboundInfo.materialDesc = `${data.code}/${data.category}`
        this.inboundInfo.materialId = data.id
        this.inboundInfo.materialName = data.name
        this.inboundInfo.materialSpecs = data.specs
      }).catch(err => {
        uni.$u.toast(err.message)
      })
    },
    // 扫码库位编码
    bindScan() {
      this.inboundInfo.storeAreaDesc = `012303 原材料仓 01号库位`
      this.inboundInfo.storeAreaId = 17
      this.inboundInfo.location = '1-1-1'
      uni.scanCode({
        success: (res) => {
          console.log(res)
        }
      });
    },
    // 扫码基础数据
    bindBaseScan() {
      uni.scanCode({
        success: (res) => {
          console.log(res)
        }
      });
    },
    // 入库
    bindInStorage() {
      putInStorage(this.inboundInfo).then(res => {
        uni.$u.toast('入库成功')
        // 返回上一页
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      }).catch(err => {
        uni.$u.toast(err.message)
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
}

.coding-name {
  flex: 1;
  background-color: #ffffff;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.receive {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 200rpx;
  width: 200rpx;
}
</style>
