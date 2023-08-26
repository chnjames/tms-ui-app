<template>
  <view class="container">
    <view class="user-header">
      <view class="user-info">
        <u-avatar size="80" shape="circle" :src="userInfo.avatar"></u-avatar>
        <view class="info-text">
          <view class="user-nickname">{{ hasLogin ? userInfo.nickname || '' : '匿名用户' }}</view>
          <view class="user-mobile">{{ hasLogin ? userInfo.mobile || '' : '登录' }}</view>
        </view>
      </view>
    </view>

    <u-gap height="10" bgColor="#f3f3f3"></u-gap>

    <u-cell-group class="fun-list">
      <u-cell class="fun-item" icon="integral" title="累计分数" :value="`${userInfo.kpi}分`"></u-cell>
      <u-cell class="fun-item" icon="order" title="本月/累计完成任务总数" :value="`${userInfo.curMonthCompletedTaskQty || 0}/${userInfo.totalCompletedTaskQty || 0}条`"></u-cell>
      <u-cell class="fun-item" icon="hourglass" title="本月/累计工时投入" :value="`${formatMinuteToHour(userInfo.curMonthConsumedWorkMinute || 0)}/${formatMinuteToHour(userInfo.totalConsumedWorkMinute || 0)}h`"></u-cell>
      <u-cell class="fun-item" :border="false" icon="calendar" title="入职日期" :value="`${timestampToTime(userInfo.entryTime, 'yyyy-MM-dd')}`"></u-cell>
      <u-gap height="10" bgColor="#f3f3f3"></u-gap>
      <u-cell class="fun-item" :border="false" icon="edit-pen" title="休假设置" @click="pageRouter" isLink>
        <text slot="value" class="leave-name">{{proxyUserName}}</text>
      </u-cell>
    </u-cell-group>

    <u-button v-if="hasLogin" color="#214579" text="退出账号" class="logout" @click="logout"></u-button>
  </view>
</template>

<script>
import {formatMinuteToHour, timestampToTime} from '@/utils/utils'
export default {
  data() {
    return {
      proxyUserName: ''
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
  onShow() {
    if (this.userInfo.proxyUserId) {
      const proxyUser = this.userList.find(item => item.id === this.userInfo.proxyUserId)
      this.proxyUserName = proxyUser ? proxyUser.nickname : ''
    } else {
      this.proxyUserName = ''
    }
  },
  methods: {
    formatMinuteToHour,
    timestampToTime,
    pageRouter() {
      if (this.userInfo.proxyUserId) {
        uni.navigateTo({
          url: `/pages/leave/leave?proxyUserId=${this.userInfo.proxyUserId}`
        })
      } else {
        uni.navigateTo({
          url: '/pages/leave/leave'
        })
      }
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '您确定要退出登录吗',
        success: res => {
          if (res.confirm) {
            this.$store.dispatch('Logout').then(res => {
              uni.reLaunch({
                url: '/pages/login/mobile'
              })
            })
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
  background-color: #FFFFFF;
  .fun-item {
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    .leave-name {
      color: $custom-content-color;
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
