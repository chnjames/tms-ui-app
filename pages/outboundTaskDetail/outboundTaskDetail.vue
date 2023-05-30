<template>
  <view class="container">
    <view class="card" v-for="(item, index) in taskList" :key="index" @click="bindTask(item)">
      <u--text color="#666666" size="26rpx" :text="item.name"></u--text>
      <u--text color="#666666" size="26rpx" :text="item.content"></u--text>
      <u-gap height="10rpx"></u-gap>
      <u--text color="#999999" size="24rpx" :text="`需求人：${item.demand}`"></u--text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      taskList: [{
        name: '加注机设备生产制造',
        content: '日常点检滤芯更换',
        demand: '刘亦菲'
      }, {
        name: '加注机设备生产制造',
        content: '',
        demand: '刘亦菲'
      }, {
        name: '加注机设备生产制造',
        content: '日常点检滤芯更换',
        demand: '刘亦菲'
      }, {
        name: '加注机设备生产制造',
        content: '日常点检滤芯更换',
        demand: '刘亦菲'
      }]
    };
  },
  methods: {
    bindTask(item) {
      uni.navigateTo({
        url: `/pages/outboundTask/outboundTask`
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  // 卡片
  .card {
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: 10rpx;
    background-color: #ffffff;
  }
}
</style>
