<template>
  <view class="container">
    <u--text color="#aaaaaa" text="物料编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
      <!-- #ifndef APP-NVUE -->
      <u-input class="coding-name" color="#214579" fontSize="28rpx" placeholder="请扫描或输入物料名称" border="bottom" v-model="materialCode"
        @change="bindMaterial">
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
    <u--text color="#aaaaaa" text="物料规格"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#666666" text="三相四线制 380V鼓式电机"></u--text>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料位置"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="layout">
      <u--text size="28rpx" color="#666666" text="原材料仓 号库位  1-1-2"></u--text>
      <u--text size="28rpx" color="#666666" align="right" text="库存：5"></u--text>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view class="layout">
      <u--text color="#aaaaaa" text="出库数量"></u--text>
      <u-number-box v-model="quantity" :min="1" @change="bindQuantity"></u-number-box>
    </view>
    <u-gap height="60rpx"></u-gap>
    <view class="layout">
      <u--text size="28rpx" color="#666666" text="原材料仓 号库位  1-1-2"></u--text>
      <u--text size="28rpx" color="#666666" align="right" text="库存：5"></u--text>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view class="layout">
      <u--text color="#aaaaaa" text="出库数量"></u--text>
      <u-number-box v-model="quantity" :min="1" @change="bindQuantity"></u-number-box>
    </view>
    <u-button class="receive" text="出 库" color="#214579" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
  import {getMaterialBaseData} from "../../api/warehouse";
  import {getStockPage, outOfStorage} from "../../api/stock";

  export default {
    data() {
      return {
        materialBaseInfo: {}
      };
    },
    created() {
      this.getMaterialBaseData()
    },
    methods: {
      // 获取物料基础数据
      getMaterialBaseData() {
        getMaterialBaseData({id: 3}).then(res => {
          console.log(res)
          this.materialBaseInfo = res.data
          this.getStockPage()
        })
      },
      // 获取库存列表
      getStockPage() {
        getStockPage({
          materialId: 3
        }).then(res => {
          console.log(res)
        })
      },
      // 出库
      outOfStorage() {
        outOfStorage({
          materialId: 3,
          quantity: 1
        }).then(res => {
          console.log(res)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    padding: 20rpx;

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
</style>
