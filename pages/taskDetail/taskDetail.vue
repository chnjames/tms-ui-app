<template>
  <view class="container">
    <view style="display: flex;">
      <u--text type="error" text="紧急"></u--text>
      <u--text size="28rpx" bold text="WNC项目YOUITMS系统开发"></u--text>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u-read-more textIndent="0" toggle closeText="展开">
      <view>{{ content }}</view>
    </u-read-more>
    <u-gap height="20rpx"></u-gap>
    <u-cell-group class="user">
      <u-cell icon="account-fill">
        <view slot="title" @click="bindAccount">
          <text class="title">陈逸飞</text>
        </view>
      </u-cell>
      <u-cell icon="share-fill">
        <view slot="title">
          <text class="attention">陈逸飞</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill">
        <view slot="title">
          <text class="attention">2022/11/13</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-gap height="200rpx"></u-gap>
    <view class="file-list" v-if="fileList.length > 0">
      <view class="file-item" v-for="(item, index) in fileList" :key="index">
        <view class="file-src">
          <u--image :showLoading="true" shape="circle" :src="item.url" width="100rpx" height="100rpx"></u--image>
          <view class="file-name">{{ item.name }}</view>
        </view>
        <u-icon name="close" size="24" @click="bindDelFile(item, index)"></u-icon>
      </view>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u--text type="primary" text="评论"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u-line></u-line>
    <u-gap height="20rpx"></u-gap>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u--text type="info" size="24rpx" text="11月1日 12:23 刘能创建了代办"></u--text>
    <u-gap height="20rpx"></u-gap>
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
    <u-row class="btn-group" gutter="20rpx" justify="space-around">
      <u-col span="3">
        <u-button text="完成任务" type="primary" shape="circle" @click="bindCreate"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="结果登记" type="primary" shape="circle" @click="bindCreate"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="添加附件" color="#909399" shape="circle" @click="bindPhoto"></u-button>
      </u-col>
    </u-row>
    <!-- 操作人选择器 -->
    <u-picker :show="accountShow" :columns="accountColumns" @cancel="bindClose" @close="bindClose"
      @confirm="confirmAccount"></u-picker>
    <!-- 提醒 -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: `山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。
				苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。
				无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？`,
      show: false,
      value: 2,
      isRegister: true,
      workingHours: 3.5, // 工时
      quantity: 0, // 合格数量
      unQuantity: 0, // 不合格数量
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
  padding: 20rpx;

  u-tag {
    width: auto;
  }

  .user {
    background-color: #FFFFFF;

    .title {
      color: #2979ff;
      font-size: 26rpx;
      margin-right: 10rpx;
    }

    .attention {
      font-size: 26rpx;
      margin-right: 10rpx;
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
  color: #2979ff;
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
  background-color: #FFFFFF;
  border-radius: 10rpx;
  margin-bottom: 20rpx;

  .u-icon {
    margin-left: 20rpx;
  }
}
</style>
