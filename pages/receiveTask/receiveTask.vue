<template>
  <view class="container">
    <u-loading-page :loading="taskLoading" bgColor="#F5F5F5"></u-loading-page>
    <u--text color="#333333" bold :text="taskDetail.projectName"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text color="#666666" size="14" :text="taskDetail.taskName"></u--text>
    <u-gap height="160rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="share-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text>{{taskDetail.followersStr}}</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text>{{taskDetail.date}}</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-button class="receive" text="领取任务" color="#214579" shape="circle" @click="bindReceiveTask"></u-button>
  </view>
</template>

<script>
import { getCommonTaskDetail, receiveCommonTask } from "@/api/task";
import {timestampToTime} from "@/utils/utils";
export default {
  data() {
    return {
      taskId: '',
      taskDetail: {},
      taskLoading: false
    };
  },
  computed: {
    userList() {
      return this.$store.getters.userList
    },
    projectList() {
      return this.$store.getters.projectList
    },
  },
  onLoad(options) {
    const {taskId} = options;
    this.taskId = taskId;
    this.getCommonTaskDetail();
  },
  methods: {
    // 获取任务详情
    getCommonTaskDetail() {
      this.taskLoading = true;
      getCommonTaskDetail({taskId: this.taskId}).then(res => {
        const taskDetail = res.data || {};
        taskDetail.date = timestampToTime(taskDetail.endTime, 'yyyy-MM-dd');
        taskDetail.followersStr = taskDetail.followers.map(item => {
          return this.userList.find(user => user.id === item).nickname
        }).join('、');
        taskDetail.projectName = this.projectList.find(item => item.id === taskDetail.projectId)?.name || '';
        this.taskDetail = taskDetail;
      }).finally(() => {
        this.taskLoading = false;
      })
    },
    // 领取任务
    bindReceiveTask() {
      receiveCommonTask({ taskId: this.taskId }).then(() => {
        uni.$u.toast('领取成功')
        setTimeout(() => {
          uni.navigateBack()
        }, 300)
      })
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
