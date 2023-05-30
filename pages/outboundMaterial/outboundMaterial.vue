<template>
  <view class="container">
    <u--text color="#aaaaaa" text="物料编码/名称"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" text="M38574359346 汽油加注机滤芯"></u--text>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="需求数量"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" text="15"></u--text>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料位置"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="layout">
      <u--text size="28rpx" color="#666666" text="原材料仓 号库位 1-1-2"></u--text>
      <u--text size="28rpx" color="#666666" align="right" text="库存：5"></u--text>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view class="layout">
      <u--text color="#aaaaaa" text="出库数量"></u--text>
      <u-number-box v-model="quantity" :min="0" @change="bindQuantity"></u-number-box>
    </view>
    <u-gap height="60rpx"></u-gap>
    <view class="layout">
      <u--text size="28rpx" color="#666666" text="原材料仓 号库位 1-1-2"></u--text>
      <u--text size="28rpx" color="#666666" align="right" text="库存：5"></u--text>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view class="layout">
      <u--text color="#aaaaaa" text="出库数量"></u--text>
      <u-number-box v-model="quantity" :min="0" @change="bindQuantity"></u-number-box>
    </view>
    <u-gap height="60rpx"></u-gap>
    <view class="layout">
      <u--text size="28rpx" color="#666666" text="原材料仓 号库位 1-1-2"></u--text>
      <u--text size="28rpx" color="#666666" align="right" text="库存：5"></u--text>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view class="layout">
      <u--text color="#aaaaaa" text="出库数量"></u--text>
      <u-number-box v-model="quantity" :min="0" @change="bindQuantity"></u-number-box>
    </view>
    <u-button class="receive" text="完成任务" color="#214579" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      quantity: 0
    };
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
