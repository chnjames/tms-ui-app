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
    <u-gap height="200rpx"></u-gap>
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
        <u-button text="拍 照" color="#007bed" shape="circle" @click="bindPhoto"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="完成任务" :disabled="fileList.length === 0" color="#214579" shape="circle" @click="bindReceive"></u-button>
      </u-col>
    </u-row>
  </view>
</template>

<script>
import {getTaskDetail, missionTask, createTaskAttachment} from "@/api/task";
import {uploadFile} from "@/api/auth";
export default {
  data() {
    return {
      taskId: '',
      taskInfo: {},
      fileList: []
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
        this.taskInfo = data;
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
    // 删除附件
    bindDelFile(item, index) {
      this.fileList.splice(index, 1)
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
    },
    // 完成任务
    bindReceive() {
      const urls = this.fileList.map(item => item.url);
      createTaskAttachment({ taskId: this.taskId, urls }).then(() => {
        return missionTask({ taskId: this.taskId });
      }).then(() => {
        uni.$u.toast('任务完成');
        setTimeout(() => {
          uni.navigateBack();
        }, 300);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;

  // 单个附件-卡片样式
  .file-src {
    display: flex;
    align-items: center;
  }

  .file-name {
    font-size: 24rpx;
    color: #303133;
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

  .btn-group {
    position: fixed;
    bottom: 200rpx;
    right: 0;
    left: 0;
  }
}
</style>
