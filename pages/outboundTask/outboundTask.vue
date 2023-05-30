<template>
  <view class="container">
    <view class="card" v-for="(item, index) in taskList" :key="index">
      <view>
        <u--text color="#214579" size="26rpx" :text="item.name"></u--text>
        <u-gap height="10rpx"></u-gap>
        <u--text color="#779dbd" size="26rpx" :text="`数量：${item.quantity}`"></u--text>
      </view>
      <view class="btn" @click="bindOutbound(item)">出库</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      taskList: [{
        name: 'M38574359346 汽油加注机滤芯',
        quantity: 5,
        status: 1
      }, {
        name: 'M38574359346 汽油加注机滤芯',
        quantity: 5,
        status: 2
      }, {
        name: 'M38574359346 汽油加注机滤芯',
        quantity: 5,
        status: 2
      }, {
        name: 'M38574359346 汽油加注机滤芯',
        quantity: 5,
        status: 1
      }]
    };
  },
  methods: {
    bindOutbound(item) {
      uni.navigateTo({
        url: `/pages/outboundMaterial/outboundMaterial`
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  .card {
    background-color: #fff;
    border-radius: 10rpx;
    color: $custom-content-color;
    font-size: 26rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    @include flex-space-between;

    .btn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      background-color: #d9d9d9;
      color: $custom-content-color;
      border-radius: 5rpx;
    }
  }
}
</style>
