<template>
  <view class="container">
    <view class="user-header">
      <view class="user-info" @click="pageRouter('/pages/profile/profile')">
        <u-avatar size="60" shape="square" :src="userInfo.avatar"></u-avatar>
        <view class="info-text">
          <view class="user-nickname">{{ hasLogin ? userInfo.nickname || '会员用户' : '匿名用户' }}</view>
          <view class="user-mobile">{{ hasLogin ? userInfo.mobile || ' ' : '登录/注册' }}</view>
        </view>
      </view>
      <view class="user-setting">
        <u-icon v-if="hasLogin" name="setting" color="#939393" size="22" @click="pageRouter('/pages/setting/setting')"></u-icon>
      </view>
    </view>

    <u-gap height="10" bgColor="#f3f3f3"></u-gap>

    <u-cell-group class="fun-list">
      <u-cell class="fun-item" icon="integral" title="任务绩效" value="111111分"></u-cell>
      <u-cell class="fun-item" icon="order" title="本月/累计完成任务总数" value="231/8374条"></u-cell>
      <u-cell class="fun-item" icon="hourglass" title="本月/累计工时投入" value="12/193h"></u-cell>
      <u-cell class="fun-item" :border="false" icon="calendar" title="入职日期" value="2022/01/21"></u-cell>
      <u-gap height="10" bgColor="#f3f3f3"></u-gap>
      <u-cell class="fun-item" :border="false" icon="edit-pen" title="休假设置" @click="pageRouter('/pages/leave/leave')" isLink>
        <text slot="value" class="leave-name">程珂</text>
      </u-cell>
    </u-cell-group>

    <u-button v-if="hasLogin" type="primary" text="退出账号" class="logout"></u-button>
  </view>
</template>

<script>

export default {
  data() {
    return {
      orderPage: '/pages/order/list'
    }
  },
  onLoad() {
    if (this.hasLogin) {
      this.$store.dispatch('ObtainUserInfo')
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    hasLogin() {
      return this.$store.getters.hasLogin
    }
  },
  methods: {
    pageRouter(pageUrl, param) {
      uni.$u.route(pageUrl)
      if (!this.hasLogin) {
        uni.$u.route('/pages/login/social')
      } else if (pageUrl === this.orderPage) {
        uni.$u.route(this.orderPage, {
          status: param
        })
      } else {
        uni.$u.route(pageUrl)
      }
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '您确定要退出登录吗',
        success: res => {
          if (res.confirm) {
            this.$store.dispatch('Logout')
          } else if (res.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-header {
  background-color: #fff;
  @include flex-space-between;
  padding: 30rpx;
  height: 200rpx;

  .user-info {
    @include flex-left;
    align-items: center;

    .info-text {
      margin-left: 20rpx;

      .user-nickname {
        font-size: 30rpx;
        font-weight: 700;
        line-height: 50rpx;
      }

      .user-mobile {
        font-size: 24rpx;
        font-weight: 700;
        color: #939393;
        line-height: 50rpx;
      }
    }
  }

  .user-setting {
    margin-right: 5rpx;
  }
}

.fun-list {
  .fun-item {
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    border-bottom: $custom-border-style;
    .leave-name {
      color: #4988fd;
    }
  }
}
// 退出登录
.logout {
  width: 600rpx;
  position: fixed;
  bottom: 250rpx;
  left: 50%;
  transform: translateX(-50%);
}
</style>
