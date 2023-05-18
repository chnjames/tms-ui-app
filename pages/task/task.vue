<template>
  <view>
    <u-sticky bgColor="#fff">
      <u-tabs itemStyle="width: 150rpx;height: 60rpx" :scrollable="false" :list="list1" @click="click"></u-tabs>
    </u-sticky>
    <!-- 快速创建 -->
    <view class="add-img">
      <u-icon name="plus" color="#FFFFFF" size="56rpx"></u-icon>
    </view>
    <!-- 扫码 -->
    <view class="scan-img" @click="bindScan">
      <u-icon name="scan" color="#FFFFFF" size="56rpx"></u-icon>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        addImg: require('../../static/images/icons/add.png'),
        outgoingImg: require('../../static/images/icons/outgoing.png'),
        list1: [{
          name: '进行中'
        }, {
          name: '已逾期',
          badge: {
            value: 6
          }
        }, {
          name: '已完成'
        }, {
          name: '我关注',
          badge: {
            value: 1
          }
        }]
      }
    },
    methods: {
      click(item) {
        console.log('item', item);
      },
      // 扫码
      bindScan() {
        // 允许从相机和相册扫码
        uni.scanCode({
          autoDecodeCharset: false,
        	success: function (res) {
        		console.log('条码类型：' + res.scanType);
        		console.log('条码内容：' + res.result);
        	},
          fail: function (err) {
            console.log('err', err)
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .add-img, .scan-img {
    width: 80rpx;
    height: 80rpx;
    background-color: #4988fd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .add-img {
    position: fixed;
    bottom: 200rpx;
    left: 30rpx;
  }
  .scan-img {
    position: fixed;
    bottom: 200rpx;
    right: 30rpx;
  }
</style>
