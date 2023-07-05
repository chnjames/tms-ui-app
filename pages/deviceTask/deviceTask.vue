<template>
  <view class="container">
    <view class="device-top">
      <u-cell class="device-name" :border="false" isLink arrow-direction="down" @click="bindDevice">
        <view class="title" slot="title">
          <text v-if="!taskInfo.deviceName" class="placeholder">请选择或扫描设备编码</text>
          <text v-else>{{taskInfo.deviceName}}</text>
        </view>
      </u-cell>
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u--textarea v-model="taskInfo.name" placeholder="请输入快速上报问题描述" border="none" count height="200rpx"
      :maxlength="300"></u--textarea>
    <u-gap height="20rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="account-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title" @click="bindAccount">
          <text>{{taskInfo.blameName}}</text>
        </view>
      </u-cell>
      <u-cell icon="share-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text class="attention">陈逸飞</text> 关注
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
    <u-row class="btn-group" gutter="20rpx" justify="flex-end">
      <u-col span="3">
        <u-button text="立即创建" color="#214579" shape="circle" @click="createTask"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="添加附件" color="#aaaaaa" shape="circle" @click="bindPhoto"></u-button>
      </u-col>
    </u-row>
    <!-- 设备选择器 -->
    <u-picker :show="deviceShow" ref="deviceRef" keyName="name" :columns="deviceColumns" confirmColor="#214579" @confirm="confirmDevice" @cancel="bindClose"
      @close="bindClose" @change="bindDeviceChange"></u-picker>
    <!-- 日期选择器 -->
    <u-datetime-picker :show="calendarShow" v-model="taskInfo.endTime" mode="date" @confirm="confirmCalendar" @cancel="bindClose" @close="bindClose"></u-datetime-picker>
    <!-- 操作人选择器 -->
    <u-picker :show="accountShow" :columns="accountColumns" :defaultIndex="accountIndex" keyName="nickname" confirmColor="#214579" @cancel="bindClose" @close="bindClose" @confirm="confirmAccount"></u-picker>
    <!-- 提醒 -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import {getDeviceDetail, getDeviceSimpleList} from "../../api/device";
import {handleTree} from "../../utils/tree";
import {createTask} from "@/api/task";
import {uploadFile} from "@/api/auth";

export default {
  data() {
    return {
      deviceShow: false, // 设备选择器
      calendarShow: false, // 日期选择器
      accountShow: false, // 操作人选择器
      accountColumns: [],
      accountIndex: [0],
      deviceArr: [],
      deviceIndex: [0, 0, 0],
      deviceColumns: [[],[],[]],
      taskInfo: {
        name: '', // 任务名称
        projectId: '', // 项目id
        deviceId: '',
        deviceName: '',
        blameId: '', // 责任人
        blameName: '', // 责任人名称
        type: 50, // 任务类型: 快速任务：50 扫码设备任务：22
        endTime: '', // 截止时间
        endTimeStr: '', // 截止时间
        attachments: [] // 附件
      },
      fileList: []
    }
  },
  onLoad() {
    this.getDeviceSimpleList()
    this.taskInfo.endTime = Number(new Date(this.$u.timeFormat(null, 'yyyy/mm/dd') + ' 23:59:59'))
    this.taskInfo.endTimeStr = this.$u.timeFormat(null, 'yyyy/mm/dd')
    this.taskInfo.blameId = this.userInfo.id
    this.taskInfo.blameName = this.userInfo.nickname
    this.accountColumns = [this.userList]
    this.accountIndex = [this.userList.findIndex(item => item.id === this.userInfo.id)]
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    userList() {
      return this.$store.getters.userList
    }
  },
  methods: {
    // 获取设备信息
    getDeviceDetail(deviceId) {
      getDeviceDetail({deviceId}).then(res => {
        const {data} = res
        this.deviceDesc = `${data.code}/${data.name}`
        this.deviceLocation = data.location
        this.taskInfo.projectId = data.projectId
      })
    },
    // 创建任务
    createTask() {
      this.taskInfo.attachments = this.fileList.map(item => item.url)
      createTask(this.taskInfo).then(() => {
        uni.$u.toast('创建成功')
        setTimeout(() => {
          uni.navigateBack()
        }, 300)
      })
    },
    // 获取设备精简列表
    getDeviceSimpleList() {
      getDeviceSimpleList().then(res => {
        this.deviceArr = handleTree(res.data)
        this.deviceArr.forEach((item) => {
          this.deviceColumns[0].push({ ...item });
        });
        if (this.deviceArr[0]?.children?.length > 0) {
          this.deviceArr[0].children.forEach((item) => {
            this.deviceColumns[1].push({ ...item });
          });
          if (this.deviceArr[0].children[0]?.children?.length > 0) {
            this.deviceArr[0].children[0].children.forEach((item) => {
              this.deviceColumns[2].push({ ...item });
            });
          } else {
            this.deviceColumns[2] = [];
          }
        } else {
          this.deviceColumns[1] = [];
          this.deviceColumns[2] = [];
        }
      })
    },
    // 扫码
    bindScan() {
      uni.scanCode({
        success: (res) => {
          console.log(res);
        }
      });
    },
    // 打开设备选择器
    bindDevice() {
      this.deviceShow = true
    },
    // 改变设备
    bindDeviceChange(e) {
      console.log(e)
      const {columnIndex, index, picker = this.$refs.deviceRef} = e
      console.log(columnIndex, index, picker)
      // 根据列的索引值，判断当前改变的是哪一列，然后改变对应的列数据
      if (columnIndex === 0) {
        this.deviceColumns[1] = this.deviceArr[index]?.children || []
        picker.setColumnValues(1, this.deviceColumns[1])
        this.deviceColumns[2] = this.deviceArr[index]?.children?.[0]?.children || []
        picker.setColumnValues(2, this.deviceColumns[2])
      } else if (columnIndex === 1) {
        this.deviceColumns[2] = this.deviceArr[this.deviceIndex[0]]?.children[index]?.children || []
        picker.setColumnValues(2, this.deviceColumns[2])
      }
    },
    // 确认设备
    confirmDevice(e) {
      const [arr1, arr2, arr3] = e.value
      console.log(e.value)
      if (!arr1?.id || !arr2?.id || !arr3?.id) {
        uni.$u.toast('请选择设备')
        return
      }
      this.taskInfo.deviceName = `${arr3.name}`
      this.taskInfo.deviceId = arr3.id
      this.getDeviceDetail(arr3.id)
      this.deviceShow = false
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
      }).finally(() => {
        uni.hideLoading();
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;

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

  .device-top {
    @include flex-space-between;
  }

  .device-name {
    flex: 1;
    background-color: #ffffff;
    border-radius: 10rpx;
    margin-right: 20rpx;

    .title {
      color: $custom-content-color;
      font-size: 24rpx;
    }
  }

  .placeholder {
    color: #aaaaaa;
  }

  .btn-group {
    position: fixed;
    bottom: 200rpx;
    right: 0;
    left: 0;
  }
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
