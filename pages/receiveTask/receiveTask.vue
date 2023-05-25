<template>
  <view class="container">
    <u--text v-if="taskId === '2'" color="#333333" bold text="M38574359346 / 汽油加注机"></u--text>
    <u--text v-else color="#333333" bold text="WNC项目YOUITMS系统开发"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u-read-more toggle closeText="展开" color="#214579" textIndent="0" :shadowStyle="shadowStyle" :showHeight="200">
      <u--text v-if="taskId === '2'" color="#666666" size="14" text="日常点检"></u--text>
      <u--text v-else color="#666666" size="14" text="【MES】在配置界面中增加超时时间设置，日期选择的控制，其他问题的解决..."></u--text>
    </u-read-more>
    <u-gap height="160rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="share-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text>陈逸飞</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text>2022/11/13</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-button class="receive" text="领取任务" color="#214579" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      taskId: '',
      taskType: '',
      shadowStyle: {
        // #ifndef APP-NVUE
        backgroundImage: "linear-gradient(-180deg, rgba(245, 245, 245, 0) 0%, #F5F5F5 80%)",
        // #endif
        // #ifdef APP-NVUE
        // nvue上不支持设置复杂的backgroundImage属性
        backgroundImage: "linear-gradient(to top, #F5F5F5, rgba(245, 245, 245, 0.5))",
        // #endif
        paddingTop: "100px",
        marginTop: "-100px"
      }
    };
  },
  created() {
    const {
      id,
      type
    } = this.$route.query;
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
  padding: 30rpx;

  .user {
    .title {
      color: $custom-text-assist-color;
      font-size: 24rpx;

      text {
        margin-right: 20rpx;
      }
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

/deep/ .u-cell__body {
  padding: 10rpx 0;
}
</style>
