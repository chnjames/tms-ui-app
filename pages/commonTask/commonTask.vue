<template>
  <view class="container">
    <u-toast ref="uToast"></u-toast>
    <u--textarea v-model="value1" placeholder="请输入任务内容" border="none" count height="200rpx"
      :maxlength="300"></u--textarea>
    <u-gap height="20rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="share-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text>陈逸飞</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text>2022/11/13</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-row class="btn-group" gutter="20rpx" justify="space-around">
      <u-col span="3">
        <u-button text="立即创建" color="#214579" shape="circle" @click="bindCreate"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="添加附件" color="#aaaaaa" shape="circle" @click="bindPhoto"></u-button>
      </u-col>
    </u-row>
  </view>
</template>

<script>
export default {
  data() {
    return {
      value1: ''
    };
  },
  methods: {
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
  padding: 30rpx;

  /deep/ .u-textarea {
    background-color: transparent;
  }

  .user {
    .title {
      color: $custom-text-assist-color;
      font-size: 24rpx;

      text {
        margin-right: 20rpx;
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
</style>
