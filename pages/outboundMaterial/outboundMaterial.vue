<template>
  <view class="container">
    <u--text color="#aaaaaa" text="物料编码/名称"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" :text="materialDesc"></u--text>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="需求数量"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" :text="quantity"></u--text>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料位置"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view v-for="item in outboundList" :key="item.id">
      <view class="layout">
        <u--text size="28rpx" color="#666666" :text="item.storeDesc"></u--text>
        <u--text size="28rpx" color="#666666" align="right" :text="'库存：' + item.stockQty"></u--text>
      </view>
      <u-gap height="40rpx"></u-gap>
      <view class="layout">
        <u--text color="#aaaaaa" text="出库数量"></u--text>
        <u-number-box v-model="item.qty" :min="0" :max="item.stockQty" :disablePlus="item.disablePlus"></u-number-box>
      </view>
      <u-gap height="60rpx"></u-gap>
    </view>
    <u-button class="receive" text="出 库" color="#214579" shape="circle" @click="bindOutBound"></u-button>
  </view>
</template>

<script>
import {getMaterialBaseData} from "@/api/warehouse";
import {getStockPage, outOfStorage} from "@/api/stock";
export default {
  data() {
    return {
      quantity: 0,
      bomId: '',
      materialDesc: '',
      outboundList: []
    };
  },
  watch: {
    outboundList: {
      handler(val) {
        // 监听出库数量qty的变化 出库数量的总和必须等于需求数量quantity，同时避免无限循环
        const total = val.reduce((total, item) => total + item.qty, 0)
        if (total === this.quantity && !this.isOutboundListDisabled(val)) {
          this.outboundList = val.map(item => ({...item, disablePlus: true}))
        } else if (total !== this.quantity && this.isOutboundListDisabled(val)) {
          this.outboundList = val.map(item => ({...item, disablePlus: false}))
        }
      },
      immediate: true,
      deep: true
    }
  },
  onLoad(options) {
    const {materialId, qty, id} = options
    this.quantity = +qty
    this.bomId = id
    this.getMaterialBaseData(materialId)
    this.getStockPage(materialId)
  },
  methods: {
    isOutboundListDisabled(list) {
      return list.every(item => item.disablePlus);
    },
    // 获取物料基础数据
    getMaterialBaseData(id) {
      getMaterialBaseData({id}).then(res => {
        const {data} = res
        this.materialDesc = `${data.code} ${data.name}`
      })
    },
    // 获取库存列表
    getStockPage(materialId) {
      getStockPage({materialId}).then(res => {
        const {data} = res
        this.outboundList = data?.map(item => ({
          materialId: item.materialId,
          storeDesc: `${item.storeName} ${item.storeAreaName} ${item.location}`,
          storeAreaId: item.storeAreaId,
          location: item.location,
          stockQty: item.qty,
          bomId: this.bomId,
          qty: 0
        })) || [];
      })
    },
    // 出库
    bindOutBound() {
      outOfStorage(this.outboundList).then(res => {
        uni.$u.toast('出库成功')
        setTimeout(() => {
          uni.navigateBack()
        }, 300)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  .layout {
    @include flex-space-between;
  }

  .receive {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 200rpx;
    width: 200rpx;
  }
}
</style>
