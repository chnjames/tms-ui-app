<template>
  <view class="container">
    <u--text size="28rpx" color="#214579" :text="taskInfo.projectName"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" :text="templateInfo.name"></u--text>
    <u-gap height="60rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="account-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view class="title" slot="title">
          <text class="attention">{{taskInfo.blameName}}</text>
        </view>
      </u-cell>
      <u-cell icon="share-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view class="title" slot="title">
          <text class="attention">{{taskInfo.followersStr}}</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view class="title" slot="title">
          <text class="attention">{{taskInfo.date}}</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-gap height="60rpx"></u-gap>
    <u--text color="#aaaaaa" text="所在位置"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" :text="deviceLocation"></u--text>
    <u-gap height="60rpx"></u-gap>
    <view v-if="isTab">
      <u--text color="#aaaaaa" text="设备编码"></u--text>
      <u-gap height="20rpx"></u-gap>
      <!-- #ifndef APP-NVUE -->
      <u-input class="device" @blur="bindDevice" color="#214579" shape="circle" placeholder="请扫码设备编码">
        <!-- #endif -->
        <!-- #ifdef APP-NVUE -->
        <u--input class="device" @blur="bindDevice" color="#214579" placeholder="请扫码设备编码">
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
    <!-- 操作人选择器 -->
    <u-picker :show="accountShow" :columns="accountColumns" :defaultIndex="accountIndex" keyName="nickname" confirmColor="#214579" @cancel="bindClose" @close="bindClose"
              @confirm="confirmAccount"></u-picker>
  </view>
</template>

<script>
import {getTaskDetail, getTemplate, updateTaskOwner} from "@/api/task";
import {getDeviceDetail} from "@/api/device";
import {timestampToTime} from "@/utils/utils";
export default {
  data() {
    return {
      taskId: '',
      taskInfo: {},
      templateInfo: {},
      deviceLocation: '',
      accountShow: false, // 操作人选择器
      accountColumns: [],
      accountIndex: [0],
      tabType: ''
    };
  },
  computed: {
    materialList() {
      return this.$store.getters.materialList
    },
    projectList() {
      return this.$store.getters.projectList
    },
    userList() {
      return this.$store.getters.userList
    },
    isTab() {
      return this.tabType !== '2' && this.tabType !== '3'
    }
  },
  onLoad(options) {
    const {taskId, tab} = options;
    this.taskId = taskId;
    this.tabType = tab;
    this.accountColumns = [this.userList]
    this.getTaskDetail(this.taskId);
  },
  methods: {
    // 获取任务详情
    getTaskDetail(taskId) {
      getTaskDetail({taskId}).then(res => {
        const {data} = res;
        data.projectName = this.projectList.find(item => item.id === data.projectId)?.name || ''
        data.blameName = this.userList.find(user => user?.id === data?.blameId)?.nickname || ''
        data.followersStr = data.followers.map(item => {
          return this.userList.find(user => user.id === item).nickname
        }).join('、')
        data.date = timestampToTime(data.endTime, 'yyyy-MM-dd')
        this.getDeviceDetail(data.deviceId)
        this.getTemplateDetail(data.extra.templateId)
        this.taskInfo = data;
      })
    },
    // 修改责任人
    updateTaskOwner(blameId) {
      updateTaskOwner({
        taskId: this.taskId,
        blameId
      }).then(() => {
        uni.$u.toast('修改成功')
        // 返回上一页刷新页面
        setTimeout(() => {
          uni.navigateBack()
        }, 300)
      })
    },
    // 获取设备信息
    getDeviceDetail(deviceId) {
      getDeviceDetail({deviceId}).then(res => {
        const {data} = res
        this.deviceLocation = data.location
      })
    },
    // 选择操作人
    bindAccount() {
      this.accountShow = true
    },
    // 确认操作人
    confirmAccount(e) {
      const [item] = e.value
      this.taskInfo.blameId = item.id
      this.taskInfo.blameName = item.nickname
      this.updateTaskOwner(item.id)
      this.accountShow = false
    },
    // 关闭选择器
    bindClose() {
      this.accountShow = false
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
      uni.scanCode({
        success: (res) => {
          const {result} = res;
          const id = parseInt(result)
          if (id !== taskInfo.deviceId) {
            uni.$u.toast('设备不匹配')
            return
          }
          uni.navigateTo({
            url: `/pages/executeTask/executeTask?taskId=${taskId}&deviceId=${taskInfo.deviceId}&templateId=${templateInfo.id}&projectId=${taskInfo.projectId}`
          });
        }
      });
    },
    // 失焦触发
    bindDevice(val) {
      const {taskInfo, templateInfo, taskId} = this;
      const id = parseInt(val)
      if (id !== taskInfo.deviceId) {
        uni.$u.toast('设备不匹配')
        return
      }
      uni.navigateTo({
        url: `/pages/executeTask/executeTask?taskId=${taskId}&deviceId=${taskInfo.deviceId}&templateId=${templateInfo.id}&projectId=${taskInfo.projectId}`
      });
    }
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
