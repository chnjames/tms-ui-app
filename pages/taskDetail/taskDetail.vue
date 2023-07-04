<template>
  <view class="container">
    <view class="task-top">
      <view class="tag" v-if="taskInfo.urgent === 1">紧急</view>
      <view class="task-name">{{taskInfo.projectName}}</view>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u-read-more textIndent="0" toggle closeText="展开">
      <view>{{ taskInfo.taskName }}</view>
    </u-read-more>
    <u-gap height="20rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="account-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title" @click="bindAccount">
          <text>陈逸飞</text>
        </view>
      </u-cell>
      <u-cell icon="share-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text class="attention">陈逸飞</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text class="attention">2022/11/13</text> 前截止
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
        <u-button text="完成任务" color="#aaaaaa" shape="circle" @click="bindCreate"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="结果登记" color="#214579" shape="circle" @click="bindRegistration"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="添加附件" color="#aaaaaa" shape="circle" @click="bindPhoto"></u-button>
      </u-col>
    </u-row>
    <!-- 操作人选择器 -->
    <u-picker :show="accountShow" :columns="accountColumns" cancelColor="#aaaaaa" confirmColor="#214579" @cancel="bindClose" @close="bindClose"
      @confirm="confirmAccount"></u-picker>
    <!-- 提醒 -->
    <u-toast ref="uToast"></u-toast>
    <!-- 键盘 -->
    <u-keyboard ref="uKeyboard" mode="number" :closeOnClickOverlay="false"
                :showTips="false" :show="isKeyBoard" safeAreaInsetBottom @change="bindKeyBoard"
                @backspace="bindBackspace">
      <view slot="default">
        <view class="board-number">
          <!-- 工时登记 -->
          <view v-if="isRegister" class="register">
            <view class="qualified">请输入(h)：</view>
            <u-number-box :min="0.5" :step="0.5" v-model="workingHours"></u-number-box>
          </view>
          <!-- 数量登记 -->
          <view class="quantity" v-else>
            <view class="quantity-item">
              <view class="qualified">合格：</view>
              <u-number-box integer :min="-100" v-model="quantity"></u-number-box>
            </view>
            <view class="quantity-item">
              <view class="unqualified">不合格：</view>
              <u-number-box integer :min="-100" color="#fa3534" v-model="unQuantity"></u-number-box>
            </view>
          </view>
        </view>
      </view>
    </u-keyboard>
  </view>
</template>

<script>
import {getTaskDetail, missionTask, getTaskRecord, uploadTaskFile} from "../../api/task";
export default {
  data() {
    return {
      taskId: '',
      taskInfo: {},
      boardList: [],
      isKeyBoard: false, // 键盘
      show: false,
      value: 2,
      isRegister: true,
      workingHours: 3.5, // 工时
      quantity: 0, // 合格数量
      unQuantity: 0, // 不合格数量
      accountShow: false, // 操作人选择器
      isBoard: true, // 是否显示底部工时登记
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
  async onLoad(options) {
    console.log(options)
    const {taskId} = options;
    this.taskId = taskId;
    await this.getTaskDetail(this.taskId)
    await this.getTaskRecord(this.taskId)
  },
  // async created() {
  //   const {taskId} = this.$route.query;
  //   this.taskId = taskId;
  //   await this.getTaskDetail(this.taskId)
  //   await this.getTaskRecord(this.taskId)
  // },
  computed: {
    projectList() {
      return this.$store.getters.projectList
    },
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
    // 获取任务详情
    getTaskDetail(taskId) {
      getTaskDetail({taskId}).then(res => {
        const data = res.data || {}
        data.projectName = this.projectList.find(pro => pro?.id === data?.projectId)?.name || ''
        this.taskInfo = data
      }).catch(err => {
        uni.$u.toast(err.message)
      })
    },
    // 获取任务记录
    getTaskRecord(taskId) {
      getTaskRecord({taskId}).then(res => {
        console.log(res)
        this.boardList = res.data || []
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
      console.log('confirm', e)
      this.accountShow = false
    },
    // 关闭选择器
    bindClose() {
      this.accountShow = false
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
    // 结果登记
    bindRegistration() {
      this.isKeyBoard = true
    },
    // 键盘输入
    bindKeyBoard(e) {
      // 改变工时
      if (this.isRegister) {
        // this.workingHours => string => 拼接 => number
        this.workingHours = Number(this.workingHours.toString() + e)
      } else {
        this.quantity += e
      }
    },
    // 键盘删除
    bindBackspace(e) {
      // 改变工时
      if (this.isRegister) {
        // this.workingHours => string => 拼接 => number
        this.workingHours = Number(this.workingHours.toString().slice(0, -1))
      } else {
        this.quantity -= e
      }
    },
    // 添加附件
    bindPhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          console.log(res);
        }
      });
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
