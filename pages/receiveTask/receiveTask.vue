<template>
  <view class="container">
    <view v-if="taskId === '2'">M38574359346 / 汽油加注机</view>
    <view v-else>WNC项目YOUITMS系统开发</view>
    <u-gap height="20rpx"></u-gap>
    <view v-if="taskId === '2'">日常点检</view>
    <view v-else>【MES】在配置界面中增加超时时间设置，日期选择的控制，其他问题的解决，需要前...</view>
    <u-gap height="20rpx"></u-gap>
    <u-cell-group class="user">
      <u-cell icon="share-fill">
        <view slot="title">
          <text>陈逸飞</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill">
        <view slot="title">
          <text>2022/11/13</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-button class="receive" text="领取任务" type="primary" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      taskId: '',
      taskType: ''
    };
  },
  created() {
    const {id, type} = this.$route.query;
    this.taskId = id;
    this.taskType = type;
  },
  methods: {
    // 领取任务
    bindReceive() {
      console.log('领取任务');
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;

  .user {
    background-color: #FFFFFF;
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
