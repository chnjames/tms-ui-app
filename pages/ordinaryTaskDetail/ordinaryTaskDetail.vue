<template>
  <view class="container">
    <view class="task-top">
      <view class="tag" v-if="taskInfo.urgent === 1">紧急</view>
      <view class="task-name">{{taskInfo.projectName}}</view>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u--text color="#666666" size="14" :text="taskInfo.taskName"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="account-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text class="attention">{{taskInfo.blameName}}</text>
        </view>
      </u-cell>
      <u-cell icon="share-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text class="attention">{{taskInfo.followersStr}}</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text class="attention">{{taskInfo.date}}</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-gap height="200rpx"></u-gap>
    <!-- 附件列表 -->
    <view class="file-list" v-if="taskInfo.attachments.length > 0">
      <view class="file-item" v-for="(item, index) in taskInfo.attachments" :key="index">
        <view class="file-src">
          <u--image @click="bindImage" :showLoading="true" shape="circle" :src="item" width="90rpx" height="90rpx"></u--image>
        </view>
      </view>
    </view>
    <!-- 完成任务 -->
    <u-button v-if="isTab" class="receive" text="完成任务" color="#214579" shape="circle" @click="bindReceive"></u-button>
    <!-- 操作人选择器 -->
    <u-picker :show="accountShow" :columns="accountColumns" :defaultIndex="accountIndex" keyName="nickname" cancelColor="#aaaaaa" confirmColor="#214579" @cancel="bindClose" @close="bindClose"
              @confirm="confirmAccount"></u-picker>
  </view>
</template>

<script>
import {getTaskDetail, missionTask, updateTaskOwner} from "@/api/task";
import {timestampToTime} from "@/utils/utils";
export default {
  data() {
    return {
      taskId: '',
      taskInfo: {
        attachments: []
      },
      show: false,
      value: 2,
      isRegister: true,
      workingHours: 3.5, // 工时
      quantity: 0, // 合格数量
      unQuantity: 0, // 不合格数量
      accountShow: false, // 操作人选择器
      isBoard: false, // 是否显示底部工时登记
      accountColumns: [],
      accountIndex: [0],
      tabType: ''
    };
  },
  computed: {
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
    this.accountColumns = [this.userList];
    this.getTaskDetail(this.taskId);
  },
  methods: {
    // 获取任务详情
    getTaskDetail(taskId) {
      getTaskDetail({taskId}).then(res => {
        const {data} = res;
        this.accountIndex = [this.userList.findIndex(user => user?.id === data?.blameId)]
        this.taskInfo = {
          ...data,
          date: timestampToTime(data.endTime, 'yyyy-MM-dd'),
          followersStr: data.followers.map(item => {
            return this.userList.find(user => user.id === item).nickname
          }).join('、'),
          blameName: this.userList.find(user => user?.id === data?.blameId)?.nickname || '',
          projectName: this.projectList.find(pro => pro?.id === data?.projectId)?.name || '',
        }
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
    // 完成任务
    bindReceive() {
      missionTask({taskId: this.taskId}).then(() => {
        uni.$u.toast('任务完成')
        setTimeout(() => {
          uni.navigateBack()
        }, 300)
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
    // 查看图片
    bindImage() {
      uni.previewImage({
        urls: this.taskInfo.attachments
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  .task-top {
    @include flex-left;
    font-size: 26rpx;
    font-weight: bold;

    .tag {
      margin-right: 10rpx;
      color: $custom-text-danger-color;
    }

    .task-name {
      color: $custom-text-color;
    }
  }

  u-tag {
    width: auto;
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
}

/deep/ .u-cell__body {
  padding: 10rpx 0;
}

.receive {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 200rpx;
  width: 200rpx;
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

