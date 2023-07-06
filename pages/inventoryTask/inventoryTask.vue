<template>
  <view class="container">
    <view class="inventory">{{storeDesc}}</view>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料清单"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="card" v-for="(item, index) in inventoryList" :key="index">
      <view class="layout">
        <u--text color="#666666" size="26rpx" :text="`${item.materialCode}/${item.materialName}`"></u--text>
        <u-number-box buttonSize="26" v-model="item.qty" :min="1"></u-number-box>
      </view>
      <u-line margin="10rpx 0"></u-line>
      <u--text color="#aaaaaa" size="24rpx" text="物料规格"></u--text>
      <u-gap height="10rpx"></u-gap>
      <u--text color="#666666" size="26rpx" :text="item.materialSpecs"></u--text>
    </view>
    <u-button class="receive" text="确 定" color="#214579" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
import {getStockPage, updateStock} from "@/api/stock";
export default {
  data() {
    return {
      storeDesc: '',
      taskInfo: {
        storeId: '',
        areaId: '',
        location: ''
      },
      inventoryList: []
    };
  },
  computed: {
    materialList() {
      return this.$store.getters.materialList
    }
  },
  onLoad(options) {
    const {areaId, storeId, storeDesc, location} = options;
    this.storeDesc = storeDesc
    this.taskInfo.areaId = areaId
    this.taskInfo.storeId = storeId
    this.taskInfo.location = location
    this.getStockPage()
  },
  methods: {
    // 库存列表
    getStockPage() {
      getStockPage(this.taskInfo).then(res => {
        const {data} = res
        this.inventoryList = data?.map(item => ({
          ...item,
          materialCode: this.materialList.find(material => material.id === item.materialId).code,
          materialName: this.materialList.find(material => material.id === item.materialId).name,
          materialSpecs: this.materialList.find(material => material.id === item.materialId).specs,
        })) || [];
      })
    },
    // 完成任务
    bindReceive() {
      const params = this.inventoryList.map(item => ({
        stockId: item.id,
        qty: item.qty
      }))
      updateStock(params).then(() => {
        uni.$u.toast('盘点成功')
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

  .inventory {
    margin: 12rpx 0;
    border-radius: 30rpx;
    padding: 16rpx;
    color: $custom-text-sub-color;
    background-color: #e7e6e6;
    font-size: 26rpx;
  }

  // 卡片
  .card {
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: 10rpx;
    background-color: #ffffff;

    .layout {
      @include flex-space-between;
    }
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
