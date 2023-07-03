<template>
  <view class="container">
    <u--textarea v-model="taskInfo.name" placeholder="请输入任务内容" border="none" count height="200rpx"
      :maxlength="50"></u--textarea>
    <u-gap height="20rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="account-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title" @click="bindAccount">
          <text>{{taskInfo.blameName}}</text>
        </view>
      </u-cell>
      <u-cell icon="calendar-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title" @click="bindCalendar">
          <text>{{taskInfo.endTimeStr}}</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-gap height="20rpx"></u-gap>
    <!-- 附件列表 -->
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
        <u-button text="立即创建" color="#214579" shape="circle" @click="createTask"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="添加附件" color="#aaaaaa" shape="circle" @click="bindPhoto"></u-button>
      </u-col>
    </u-row>
    <!-- 日期选择器 -->
    <u-datetime-picker :show="calendarShow" v-model="taskInfo.endTime" mode="date" @confirm="confirmCalendar" @cancel="bindClose" @close="bindClose"></u-datetime-picker>
    <!-- 操作人选择器 -->
    <u-picker :show="accountShow" :columns="accountColumns" :defaultIndex="accountIndex" keyName="nickname" @cancel="bindClose" @close="bindClose" @confirm="confirmAccount"></u-picker>
    <!-- 提醒 -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import {createTask} from "@/api/task";
import {uploadFile} from "@/api/auth";
export default {
  data() {
    return {
      taskInfo: {
        name: '', // 任务名称
        deviceId: '',
        blameId: '', // 责任人
        blameName: '', // 责任人名称
        type: 50, // 任务类型: 快速任务：50 扫码设备任务：22
        endTime: '', // 截止时间
        endTimeStr: '', // 截止时间
        attachments: [] // 附件
      },
      calendarShow: false, // 日期选择器
      accountShow: false, // 操作人选择器
      accountColumns: [],
      accountIndex: [0],
      fileList: []
    };
  },
  created() {
    if (this.hasLogin) {
      this.taskInfo.endTime = Number(new Date(this.$u.timeFormat(null, 'yyyy/mm/dd') + ' 23:59:59'))
      this.taskInfo.endTimeStr = this.$u.timeFormat(null, 'yyyy/mm/dd')
      this.taskInfo.blameId = this.userInfo.id
      this.taskInfo.blameName = this.userInfo.nickname
      this.accountColumns = [this.userList]
      this.accountIndex = [this.userList.findIndex(item => item.id === this.userInfo.id)]
    } else {
      this.$u.toast('请先登录')
      uni.navigateTo({
        url: '/pages/login/mobile'
      })
    }
  },
  computed: {
    hasLogin() {
      return this.$store.getters.hasLogin
    },
    userInfo() {
      return this.$store.getters.userInfo
    },
    userList() {
      return this.$store.getters.userList
    }
  },
  methods: {
    // 创建任务
    createTask() {
      this.taskInfo.attachments = this.fileList.map(item => item.url)
      createTask(this.taskInfo).then(() => {
        uni.$u.toast('创建成功')
        setTimeout(() => {
          uni.navigateBack()
        }, 300)
      }).catch(err => {
        uni.$u.toast(err.message)
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
      this.accountShow = false
    },
    // 选择日期
    bindCalendar() {
      this.calendarShow = true
    },
    // 确认日期
    confirmCalendar(e) {
      // e.value：2023-07-04 00:00:00 => 2023-07-04 23:59:59 => 时间戳
      console.log(e)
      this.taskInfo.endTime = e.value
      this.calendarShow = false
    },
    // 关闭选择器
    bindClose() {
      this.deviceShow = false
      this.calendarShow = false
      this.accountShow = false
    },
    // 删除附件
    bindDelFile(item, index) {
      this.fileList.splice(index, 1)
    },
    // 添加附件
    bindPhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          this.uploadFile(res.tempFiles[0])
        }
      });
    },
    // 上传附件
    uploadFile(file) {
      uni.showLoading({
        title: '上传中'
      });
      uploadFile({filePath: file.path}).then(res => {
        this.fileList.push({
          name: file.name,
          url: res.data
        })
      }).catch(err => {
        uni.$u.toast(err.message)
      }).finally(() => {
        uni.hideLoading();
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  /deep/ .u-textarea {
    background-color: transparent;
  }

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

  .btn-group {
    position: fixed;
    bottom: 200rpx;
    right: 0;
    left: 0;
  }
}

/deep/ .u-cell__body {
  padding: 10rpx 0;
}
// 单个附件-卡片样式
.file-src {
  display: flex;
  align-items: center;
}

.file-name {
  font-size: 24rpx;
  color: #666666;
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
</style>
