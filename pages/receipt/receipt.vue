<template>
  <view class="container">
    <u--text color="#aaaaaa" text="库位编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
      <!-- #ifndef APP-NVUE -->
      <u-input class="coding-name" color="#214579" fontSize="28rpx" placeholder="请扫描或输入物料名称" border="bottom"
        v-model="materialCode" @change="bindCoding">
        <!-- #endif -->
        <!-- #ifdef APP-NVUE -->
        <u--input class="coding-name" color="#214579" fontSize="28rpx" placeholder="请扫描或输入物料名称" border="bottom" v-model="materialCode"
          @change="bindCoding">
          <!-- #endif -->
          <template slot="suffix">
            <u-icon name="arrow-down" color="#214579" size="18"></u-icon>
          </template>
          <!-- #ifndef APP-NVUE -->
      </u-input>
      <!-- #endif -->
      <!-- #ifdef APP-NVUE -->
      </u--input>
      <!-- #endif -->
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="80rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
      <!-- #ifndef APP-NVUE -->
      <u-input class="coding-name" color="#214579" fontSize="28rpx" placeholder="请扫描或输入物料名称" border="bottom"
        v-model="materialCode" @change="bindMaterial">
        <!-- #endif -->
        <!-- #ifdef APP-NVUE -->
        <u--input class="coding-name" color="#214579" fontSize="28rpx" placeholder="请扫描或输入物料名称" border="bottom" v-model="materialCode"
          @change="bindMaterial">
          <!-- #endif -->
          <template slot="suffix">
            <u-icon name="search" color="#214579" size="24"></u-icon>
          </template>
          <!-- #ifndef APP-NVUE -->
      </u-input>
      <!-- #endif -->
      <!-- #ifdef APP-NVUE -->
      </u--input>
      <!-- #endif -->
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view class="quantity">
      <u--text color="#aaaaaa" text="物料数量"></u--text>
      <u-number-box v-model="quantity" :min="1" @change="bindQuantity"></u-number-box>
    </view>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料名称"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#666666" text="380V鼓式电机"></u--text>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料规格"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#666666" text="三相四线制 380V鼓式电机"></u--text>
    <u-button class="receive" text="确 定" color="#214579" shape="circle" @click="bindReceive"></u-button>
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
