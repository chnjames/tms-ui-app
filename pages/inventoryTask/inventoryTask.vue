<template>
  <view class="container">
    <view class="inventory">原材料仓 01号库位 01排23层03列</view>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料清单"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="card" v-for="(item, index) in inventoryList" :key="index">
      <view class="layout">
        <u--text color="#666666" size="26rpx" :text="item.name"></u--text>
        <u-number-box buttonSize="26" v-model="item.quantity" :min="1"></u-number-box>
      </view>
      <u-line margin="10rpx 0"></u-line>
      <u--text color="#aaaaaa" size="24rpx" text="物料规格"></u--text>
      <u-gap height="10rpx"></u-gap>
      <u--text color="#666666" size="26rpx" :text="item.spec"></u--text>
    </view>
    <u-button class="receive" text="确 定" color="#214579" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inventoryList: [{
        name: 'M38574359346/汽油加注机滤芯',
        quantity: 6,
        spec: '三相四线制 380V鼓式电机'
      }, {
        name: 'M38574359346/汽油加注机滤芯',
        quantity: 6,
        spec: '三相四线制 380V鼓式电机'
      }, {
        name: 'M38574359346/汽油加注机滤芯',
        quantity: 6,
        spec: '三相四线制 380V鼓式电机'
      }]
    };
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
