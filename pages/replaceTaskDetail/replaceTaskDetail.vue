<template>
  <view class="container">
    <u--text size="28rpx" bold text="M38574359346 / 汽油加注机"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" bold text="更换备件"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" text="备件名称：M9285739685/加注机油嘴"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" text="规格型号：24V继电器"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u-cell-group class="user">
      <u-cell icon="account-fill">
        <view slot="title" @click="bindAccount">
          <text class="title">陈逸飞</text>
        </view>
      </u-cell>
      <u-cell icon="share-fill">
        <view slot="title">
          <text class="attention">陈逸飞</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill">
        <view slot="title">
          <text class="attention">2022/11/13</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-gap height="20rpx"></u-gap>
    <u--text text="所在位置"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="breadcrumb">
      <text v-for="(item, index) in breadcrumbList" :key="index">
        {{ item }}
        <text class="joiner" v-if="index !== breadcrumbList.length - 1"> > </text>
      </text>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u--text text="设备编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <!-- #ifndef APP-NVUE -->
    <u-input class="device" shape="circle" placeholder="请输入或扫码设备编码">
      <!-- #endif -->
      <!-- #ifdef APP-NVUE -->
      <u--input class="device" placeholder="请输入或扫码设备编码">
        <!-- #endif -->
        <template slot="suffix">
          <u-icon name="scan" color="#2979ff" size="28" @click="bindScan"></u-icon>
        </template>
        <!-- #ifndef APP-NVUE -->
    </u-input>
    <!-- #endif -->
    <!-- #ifdef APP-NVUE -->
    </u--input>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbList: ['深圳2工厂', '总装车间', '内饰一线']
    };
  },
  methods: {
    // 扫码
    bindScan() {
      uni.navigateTo({
        url: `/pages/replaceTask/replaceTask`,
      });
      uni.scanCode({
        success: (res) => {
          console.log(res);
          uni.navigateTo({
            url: `/pages/replaceTask/replaceTask`,
          });
        }
      });
    },
  },
}
</script>

<style lang="scss">
.container {
  padding: 20rpx;

  .user {
    background-color: #FFFFFF;

    .title {
      color: #2979ff;
      font-size: 26rpx;
      margin-right: 10rpx;
    }

    .attention {
      font-size: 26rpx;
      margin-right: 10rpx;
    }
  }
}

.breadcrumb {
  font-size: 26rpx;
  font-weight: bold;

  .joiner {
    margin: 0 10rpx;
  }
}
</style>
