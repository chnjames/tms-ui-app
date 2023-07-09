<template>
  <view class="container">
    <u--text size="28rpx" color="#214579" :text="taskInfo.projectName"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" :text="templateInfo.name"></u--text>
    <u-gap height="60rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="account-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view class="title" slot="title" @click="bindAccount">
          <text>陈逸飞</text>
        </view>
      </u-cell>
      <u-cell icon="share-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view class="title" slot="title">
          <text class="attention">陈逸飞</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view class="title" slot="title">
          <text class="attention">2022/11/13</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-gap height="60rpx"></u-gap>
    <u--text color="#aaaaaa" text="所在位置"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" :text="deviceLocation"></u--text>
    <u-gap height="60rpx"></u-gap>
    <u--text color="#aaaaaa" text="设备编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <!-- #ifndef APP-NVUE -->
    <u-input class="device" readonly color="#214579" shape="circle" placeholder="请扫码设备编码">
      <!-- #endif -->
      <!-- #ifdef APP-NVUE -->
      <u--input class="device" readonly color="#214579" placeholder="请扫码设备编码">
        <!-- #endif -->
        <template slot="suffix">
          <u-icon name="scan" color="#214579" size="28" @click="bindScan"></u-icon>
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
import {getTaskDetail, getTemplate} from "@/api/task";
import {getDeviceDetail} from "@/api/device";
export default {
  data() {
    return {
      taskId: '',
      taskInfo: {},
      templateInfo: {},
      deviceLocation: ''
    };
  },
  computed: {
    materialList() {
      return this.$store.getters.materialList
    },
    projectList() {
      return this.$store.getters.projectList
    }
  },
  onLoad(options) {
    const {taskId} = options;
    this.taskId = taskId;
    this.getTaskDetail(this.taskId);
  },
  methods: {
    // 获取任务详情
    getTaskDetail(taskId) {
      getTaskDetail({taskId}).then(res => {
        const {data} = res;
        data.projectName = this.projectList.find(item => item.id === data.projectId)?.name || ''
        this.getDeviceDetail(data.deviceId)
        this.getTemplateDetail(data.extra.templateId)
        this.taskInfo = data;
      })
    },
    // 获取设备信息
    getDeviceDetail(deviceId) {
      getDeviceDetail({deviceId}).then(res => {
        const {data} = res
        this.deviceLocation = data.location
      })
    },
    // 模板详情
    getTemplateDetail(id) {
      getTemplate({id}).then(res => {
        const {data} = res;
        this.templateInfo = data;
      })
    },
    // 扫码
    bindScan() {
      const {taskInfo, templateInfo, taskId} = this;
      uni.navigateTo({
        url: `/pages/executeTask/executeTask?taskId=${taskId}&deviceId=${taskInfo.deviceId}&templateId=${templateInfo.id}&projectId=${taskInfo.projectId}`,
      });
      uni.scanCode({
        success: (res) => {
          console.log(res);
          uni.navigateTo({
            url: `/pages/executeTask/executeTask`,
          });
        }
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  .user {

    .title {
      font-size: 24rpx;
      color: #aaaaaa;

      text {
        color: $custom-content-color;
        font-size: 24rpx;
        margin-right: 20rpx;
      }

      .attention {
        color: #aaaaaa;
      }
    }
  }
}

.device {
  background-color: #FFFFFF;
}

.breadcrumb {
  font-size: 28rpx;
  color: $custom-content-color;

  .joiner {
    margin: 0 10rpx;
  }
}

/deep/ .u-cell__body {
  padding: 10rpx 0;
}
</style>
