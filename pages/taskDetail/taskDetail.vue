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
    <view class="file-list" v-if="fileList.length > 0">
      <view class="file-item" v-for="(item, index) in fileList" :key="index">
        <view class="file-src">
          <u--image :showLoading="true" shape="circle" :src="item.url" width="90rpx" height="90rpx"></u--image>
          <view class="file-name">{{ item.name }}</view>
        </view>
        <u-icon name="close" size="22" @click="bindDelFile(item, index)"></u-icon>
      </view>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u--text color="#214579" text="评论"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u-line></u-line>
    <u-gap height="20rpx"></u-gap>
    <u--text v-for="item in boardList" :key="item.id" type="info" margin="10rpx 0" size="24rpx" :text="item.description"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u-row class="btn-group" gutter="20rpx" justify="space-around">
      <u-col span="3">
        <u-button text="完成任务" color="#aaaaaa" shape="circle" @click="bindReceive"></u-button>
      </u-col>
      <u-col span="3">
        <u-button :text="taskTypeDesc" color="#214579" shape="circle" @click="bindRegistration"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="添加附件" color="#aaaaaa" shape="circle" @click="bindPhoto"></u-button>
      </u-col>
    </u-row>
    <!-- 操作人选择器 -->
    <u-picker :show="accountShow" :columns="accountColumns" :defaultIndex="accountIndex" keyName="nickname" confirmColor="#214579" @cancel="bindClose" @close="bindClose"
              @confirm="confirmAccount"></u-picker>
    <!-- 键盘 -->
    <u-keyboard ref="uKeyboard" mode="number" :closeOnClickOverlay="false"
                :showTips="false" :show="isKeyBoard" safeAreaInsetBottom @change="bindKeyBoard"
                @backspace="bindBackspace" @confirm="bindKeyConfirm" @cancel="bindKeyCancel">
      <view slot="default">
        <view class="board-number">
          <!-- 工时登记 -->
          <view v-if="taskType === 'project'" class="register">
            <view class="qualified">请输入(h)：</view>
            <u-number-box :min="0.5" :step="0.5" v-model="workingHours">
              <text class="number-input" slot="input">{{workingHours}}</text>
            </u-number-box>
          </view>
          <!-- 数量登记 -->
          <view class="quantity" v-else>
            <view class="quantity-item">
              <view class="qualified">合格：</view>
              <u-number-box integer :min="0" v-model="quantity">
                <text :class="['number-input', quantityFocus === 1 ? 'active': '']" slot="input" @click="bindQuantityFocus(1)">{{quantity}}</text>
              </u-number-box>
            </view>
            <view class="quantity-item">
              <view class="unqualified">不合格：</view>
              <u-number-box integer :min="0" color="#fa3534" v-model="unQuantity">
                <text :class="['number-input', quantityFocus === 2 ? 'active': '']" slot="input" @click="bindQuantityFocus(2)">{{unQuantity}}</text>
              </u-number-box>
            </view>
          </view>
        </view>
      </view>
    </u-keyboard>
  </view>
</template>

<script>
import {getTaskDetail, missionTask, getTaskRecord, workTimeRegister, quantityRegister, createTaskAttachment, updateTaskOwner} from "@/api/task";
import {timestampToTime} from "@/utils/utils";
import {uploadFile} from "@/api/auth";
export default {
  data() {
    return {
      taskId: '',
      taskInfo: {},
      boardList: [],
      isKeyBoard: false, // 键盘
      keyboardInput: '', // 用于临时键盘输入
      taskType: '',
      quantityFocus: 1, // 数量登记
      workingHours: 3.5, // 工时 => 3.5h => 3.5h * 60m => 210m
      quantity: 0, // 合格数量
      unQuantity: 0, // 不合格数量
      accountShow: false, // 操作人选择器
      accountColumns: [],
      accountIndex: [0],
      fileList: [],
      taskTypeDesc: '结果登记'
    };
  },
  onLoad(options) {
    const {taskId, taskType} = options;
    this.taskType = taskType;
    this.taskTypeDesc = taskType === 'project' ? '工时登记' : '结果登记';
    this.taskId = taskId;
    this.accountColumns = [this.userList]
    this.getTaskDetail(this.taskId)
    this.getTaskRecord(this.taskId)
  },
  computed: {
    projectList() {
      return this.$store.getters.projectList
    },
    userInfo() {
      return this.$store.getters.userInfo
    },
    userList() {
      return this.$store.getters.userList
    }
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
    // 获取任务记录
    getTaskRecord(taskId) {
      getTaskRecord({taskId}).then(res => {
        this.boardList = res.data || []
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
    // 结果登记
    bindRegistration() {
      this.isKeyBoard = true
    },
    // 光标聚焦步进器
    bindQuantityFocus(type) {
      this.quantityFocus = type
    },
    // 键盘输入
    bindKeyBoard(e) {
      if (e === '.') {
        if (!this.keyboardInput.includes('.')) {
          this.keyboardInput += e;
        }
      } else if (/^\d+(\.\d?)?$/.test(this.keyboardInput + e)) {
        this.keyboardInput += e;
      }
      if (this.taskType === 'project') {
        this.workingHours = parseFloat(this.keyboardInput) || 0.5;
      } else {
        if (this.quantityFocus === 1) {
          this.quantity = parseFloat(this.keyboardInput);
        } else {
          this.unQuantity = parseFloat(this.keyboardInput);
        }
      }
    },
    // 键盘删除
    bindBackspace(e) {
      if (this.taskType === 'project') {
        this.workingHours = parseFloat(this.workingHours.toString().slice(0, -1)) || 0.5;
      } else {
        if (this.quantityFocus === 1) {
          this.quantity = parseFloat(this.quantity.toString().slice(0, -1));
        } else {
          this.unQuantity = parseFloat(this.unQuantity.toString().slice(0, -1));
        }
      }
      this.keyboardInput = ''; // 清空键盘输入
    },
    // 键盘确认
    bindKeyConfirm() {
      this.isKeyBoard = false
      if (this.taskType === 'project') {
        this.workTimeRegister()
      } else {
        this.quantityRegister()
      }
    },
    // 键盘取消
    bindKeyCancel() {
      this.isKeyBoard = false
    },
    // 工时登记
    workTimeRegister() {
      const {taskId, workingHours, taskInfo} = this
      const workMinute = taskInfo.consumedWorkMinute + workingHours * 60
      const params = {taskId, workMinute}
      console.log(params)
      debugger
      workTimeRegister(params).then(() => {
        uni.$u.toast('登记成功')
        setTimeout(() => {
          this.resetData()
          this.getTaskDetail(this.taskId)
          this.getTaskRecord(this.taskId)
        }, 300)
      })
    },
    // 数量登记
    quantityRegister() {
      const {taskId, quantity, unQuantity, taskInfo} = this
      const qualifiedQty = taskInfo?.extra?.qualifiedQty + quantity
      const unQualifiedQty = taskInfo?.extra?.unQualifiedQty + unQuantity
      const params = {taskId, qualifiedQty, unQualifiedQty}
      quantityRegister(params).then(() => {
        uni.$u.toast('登记成功')
        setTimeout(() => {
          this.resetData()
          this.getTaskDetail(this.taskId)
          this.getTaskRecord(this.taskId)
        }, 300)
      })
    },
    // 数据重置
    resetData() {
      this.workingHours = 3.5
      this.quantity = 0
      this.unQuantity = 0
      this.quantityFocus = 1
    },
    // 添加附件
    bindPhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          this.uploadFile(res.tempFiles[0])
        }
      })
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
    async bindReceive() {
      const urls = this.fileList.map(item => item.url);
      if (urls.length > 0) {
        await createTaskAttachment({ taskId: this.taskId, urls });
      }
      await missionTask({ taskId: this.taskId });
      uni.$u.toast('任务完成');
      setTimeout(() => {
        uni.navigateBack();
      }, 300);
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

.board-number {
  padding: 20rpx;
  background-color: #FFFFFF;

  .register {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .quantity {
    @include flex-space-between;

    &-item {
      display: flex;
      align-items: center;
    }
  }
}

.qualified {
  color: $custom-content-color;
}

.unqualified {
  color: #fa3534;
}

.btn-group {
  position: fixed;
  bottom: 200rpx;
  right: 0;
  left: 0;
}

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

// 自定义步进器
.number-input {
  background-color: #EBECEE;
  height: 30px;
  width: 35px;
  margin: 0 4rpx;
  padding: 0 5rpx;
  position: relative;
  text-align: center;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background-color: #ecf5ff;
  }
}

/deep/ .u-cell__body {
  padding: 10rpx 0;
}
/deep/ .u-keyboard__tooltip {
  background-color: #e0e4e6;
}
/deep/ .u-keyboard__tooltip__submit {
  color: $custom-content-color;
}
</style>
