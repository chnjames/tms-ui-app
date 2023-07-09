<template>
  <view class="container">
    <u--text size="28rpx" color="#214579" :text="taskInfo.projectName"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" :text="taskInfo.taskName"></u--text>
    <u-gap height="40rpx"></u-gap>
    <u--text size="28rpx" :text="`备件名称：${taskInfo.materialCode}/${taskInfo.materialName}`"></u--text>
    <u-gap height="40rpx"></u-gap>
    <u--text size="28rpx" :text="`规格型号：${taskInfo.materialSpecs}`"></u--text>
    <u-gap height="40rpx"></u-gap>
    <u--text size="28rpx" :text="`备件数量：${taskInfo.quantity}`"></u--text>
    <u-gap height="120rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="account-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view class="title" slot="title" @click="bindAccount">
          <text class="title">陈逸飞</text>
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
import {getTaskDetail} from "@/api/task";
import {getDeviceDetail} from "@/api/device";
export default {
  data() {
    return {
      taskId: '',
      taskInfo: {},
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
        data.materialName = this.materialList.find(material => material.id === data.extra.materialId)?.name || ''
        data.materialSpecs = this.materialList.find(material => material.id === data.extra.materialId)?.specs || ''
        data.materialCode = this.materialList.find(material => material.id === data.extra.materialId)?.code || ''
        data.quantity = data?.extra?.qty || ''
        this.getDeviceDetail(data.deviceId)
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
    // 扫码
    bindScan() {
      // 与taskInfo.deviceId比较，如果不一致，提示用户
      uni.navigateTo({
        url: `/pages/replaceTask/replaceTask?taskId=${this.taskId}`,
      });
      uni.scanCode({
        success: (res) => {
          console.log(res);
          uni.navigateTo({
            url: `/pages/replaceTask/replaceTask?taskId=${this.taskId}`,
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
