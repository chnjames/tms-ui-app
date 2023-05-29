<template>
  <view class="container">
    <u--text size="28rpx" color="#214579" text="M38574359346 / 汽油加注机"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" text="更换备件：M9285739685/加注机油嘴"></u--text>
    <u-gap height="200rpx"></u-gap>
    <view class="file-list" v-if="fileList.length > 0">
      <view class="file-item" v-for="(item, index) in fileList" :key="index">
        <view class="file-src">
          <u--image :showLoading="true" shape="circle" :src="item.url" width="90rpx" height="90rpx"></u--image>
          <view class="file-name">{{ item.name }}</view>
        </view>
        <u-icon name="close" size="22" @click="bindDelFile(item, index)"></u-icon>
      </view>
    </view>
    <u-row class="btn-group" gutter="20rpx" justify="space-around">
      <u-col span="3">
        <u-button text="拍 照" color="#007bed" shape="circle" @click="bindCreate"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="完成任务" color="#214579" shape="circle" @click="bindCreate"></u-button>
      </u-col>
    </u-row>
  </view>
</template>

<script>
export default {
  data() {
    return {
      fileList: [{
        name: '附件1232.ipg',
        url: 'https://cdn.uviewui.com/uview/album/1.jpg'
      }, {
        name: '附件1232.ipg',
        url: 'https://cdn.uviewui.com/uview/album/1.jpg'
      }]
    };
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;

  // 单个附件-卡片样式
  .file-src {
    display: flex;
    align-items: center;
  }

  .file-name {
    font-size: 24rpx;
    color: #303133;
    margin-left: 20rpx;
  }

  .file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    background-color: #e7e6e6;
    border-radius: 10rpx;
    margin-bottom: 20rpx;

    .u-icon {
      margin-left: 20rpx;
    }
  }

  .btn-group {
    position: fixed;
    bottom: 200rpx;
    right: 0;
    left: 0;
  }
}
</style>
