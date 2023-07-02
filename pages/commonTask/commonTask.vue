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
        <u-button text="立即创建" color="#214579" shape="circle" @click="bindCreate"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="添加附件" color="#aaaaaa" shape="circle" @click="bindPhoto"></u-button>
      </u-col>
    </u-row>
    <!-- 日期选择器 -->
    <u-calendar :show="calendarShow" @confirm="confirmCalendar" @cancel="bindClose" @close="bindClose"></u-calendar>
    <!-- 操作人选择器 -->
    <u-picker :show="accountShow" :columns="accountColumns" @cancel="bindClose" @close="bindClose"
              @confirm="confirmAccount"></u-picker>
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
      accountColumns: [
        ['操作人1', '操作人2', '操作人3']
      ],
      fileList: [{
        name: '附件1232.ipg',
        url: 'https://cdn.uviewui.com/uview/album/1.jpg'
      }, {
        name: '附件1232.ipg',
        url: 'https://cdn.uviewui.com/uview/album/1.jpg'
      }]
    };
  },
  methods: {
    // 创建任务
    createTask() {
      createTask(this.taskInfo).then(res => {
        console.log(res);
      })
    },
    // 选择操作人
    bindAccount() {
      this.accountShow = true
    },
    // 确认操作人
    confirmAccount(e) {
      console.log('confirm', e)
      this.accountShow = false
    },
    // 选择日期
    bindCalendar() {
      this.calendarShow = true
    },
    // 确认日期
    confirmCalendar(e) {
      console.log('confirm', e)
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
      console.log(item, index);
      this.fileList.splice(index, 1)
    },
    // 立即创建
    bindCreate() {
      this.$refs.uToast.show({
        type: 'success',
        message: "创建成功",
        complete() {
          uni.navigateBack()
        }
      })
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
      uploadFile({filePath: file.path}).then(res => {
        this.fileList.push({
          name: file.name,
          url: res.data
        })
      }).catch(err => {
        uni.$u.toast(err.msg)
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
