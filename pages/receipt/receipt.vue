<template>
  <view class="container">
    <u--text text="库位编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <u-cell class="coding-name" :border="false" isLink arrow-direction="down" @click="bindCoding">
        <view class="title" slot="title">
          <text>PN202303948853</text>
        </view>
      </u-cell>
      <u-icon name="scan" color="#2979ff" size="28" @click="bindScan"></u-icon>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u--text text="物料编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <u--input class="coding-name" placeholder="请扫描或输入物料名称" border="bottom" v-model="materialCode"
        @change="bindMaterial">
        <template slot="suffix">
          <u-icon name="search" color="#2979ff" size="24"></u-icon>
        </template>
      </u--input>
      <u-icon name="scan" color="#2979ff" size="28" @click="bindScan"></u-icon>
    </view>
    <u-gap height="20rpx"></u-gap>
    <view class="quantity">
      <u--text text="物料数量"></u--text>
      <u-number-box v-model="quantity" :min="1" @change="bindQuantity"></u-number-box>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u--text text="物料名称"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" bold text="380V鼓式电机"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text text="物料规格"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" bold text="三相四线制 380V鼓式电机"></u--text>
    <u-button class="receive" text="确 定" type="primary" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      quantity: 1,
      materialCode: ''
    };
  },
  methods: {
    // 物料数量
    bindQuantity(e) {
      console.log('当前值为: ' + e.quantity)
    },
    // 物料编码
    bindMaterial(e) {
      console.log('当前值为: ' + e)
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;

  .quantity {
    @include flex-space-between;
  }
}

.coding {
  @include flex-space-between;
}

.coding-name {
  flex: 1;
  background-color: #ffffff;
  border-radius: 10rpx;
  margin-right: 20rpx;

  .title {
    color: #303133;
    font-size: 24rpx;
    font-weight: bold;
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
