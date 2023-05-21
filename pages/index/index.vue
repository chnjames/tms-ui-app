<template>
  <view class="container">
    <!-- 金刚区 -->
    <view class="district" blurEffect="light">
      <u-row justify="space-between" gutter="10">
        <u-col span="3" v-for="(item, index) in districtList" :key="index" align="center" textAlign="center" @click="bindDistrict(item)">
          <u--image :src="item.icon" width="80rpx" height="80rpx"></u--image>
          <u--text margin="20rpx 20rpx 0" size="24rpx" align="center" :text="item.name"></u--text>
        </u-col>
      </u-row>
    </view>
    <!-- 任务列表 -->
    <u-swipe-action>
      <u-swipe-action-item class="swipe-item" :options="item.options" v-for="(item, index) in taskList" :name="item.id"
        :key="index" @click="bindSwiperItem">
        <view class="swipe-action" @click="bindTask(item, index)">
          <view class="swipe-action__content">
            <view class="swipe-action__content__text">{{ item.name }}</view>
            <view class="swipe-action__content__text">{{ item.type }}</view>
            <view class="swipe-action__content__text">{{ item.date }}</view>
          </view>
        </view>
      </u-swipe-action-item>
    </u-swipe-action>

    <u-gap height="20px"></u-gap>

  </view>
</template>

<script>
import {
  getBannerData,
  getNoticeData
} from '../../api/index'

export default {
  components: {},
  data() {
    return {
      districtList: [{
        name: '到货验收',
        icon: require("../../static/images/icons/acceptance.png"),
        url: '/pages/acceptance/acceptance'
      }, {
        name: '入库操作',
        icon: require("../../static/images/icons/receipt.png"),
        url: '/pages/receipt/receipt'
      }, {
        name: '扫码出库',
        icon: require("../../static/images/icons/outgoing.png"),
        url: '/pages/outgoing/outgoing'
      }, {
        name: '设备信息',
        icon: require("../../static/images/icons/equipment.png"),
        url: '/pages/equipment/equipment'
      }],
      taskList: [{
        id: 1,
        name: '0237458 加注机设备',
        type: '备件更换',
        date: '10月3日截止',
        options: [{
          text: '立即领取',
          style: {
            backgroundColor: '#2979ff'
          }
        }, {
          text: '忽略',
          style: {
            backgroundColor: '#fa3534'
          }
        }]
      }, {
        id: 2,
        name: '0237458 加注机设备',
        type: '备件更换',
        date: '10月3日截止',
        options: [{
          text: '立即领取',
          style: {
            backgroundColor: '#2979ff'
          }
        }, {
          text: '忽略',
          style: {
            backgroundColor: '#fa3534'
          }
        }]
      }, {
        id: 3,
        name: '0237458 加注机设备',
        type: '备件更换',
        date: '10月3日截止',
        options: [{
          text: '立即领取',
          style: {
            backgroundColor: '#2979ff'
          }
        }, {
          text: '忽略',
          style: {
            backgroundColor: '#fa3534'
          }
        }]
      }, {
        id: 4,
        name: '0237458 加注机设备',
        type: '备件更换',
        date: '10月3日截止',
        options: [{
          text: '立即领取',
          style: {
            backgroundColor: '#2979ff'
          }
        }, {
          text: '忽略',
          style: {
            backgroundColor: '#fa3534'
          }
        }]
      }]
    }
  },
  onLoad() {
    this.loadBannerData()
    // this.loadNoticeData()
  },
  methods: {
    loadBannerData() {
      getBannerData().then(res => {
        this.bannerList = res.data
      })
    },
    loadNoticeData() {
      getNoticeData().then(res => {
        this.noticeList = res.data
      })
    },
    // 金刚区
    bindDistrict(item) {
      const { url } = item
      uni.navigateTo({
        url
      })
    },
    // 任务操作
    bindSwiperItem({ name, index }) {
      console.log(`name${name}`, `index${index}`)
    },
    // 领取任务
    bindTask(item, index) {
      console.log(item, index)
      const { id, type } = item
      // uni.navigateTo({
      //   url: `/pages/receiveTask/receiveTask?id=${id}&type=${type}`
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.district {
  border-radius: 20rpx;
  // margin: 0 32rpx 32rpx;
  padding: 40rpx;
  text-align: center;
  background-color: #FFFFFF;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, .1);
}

.swipe-item {
  margin: 20rpx 0;
  border-radius: 10rpx;
  overflow: hidden;
  background-color: #FFFFFF;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, .1);
}

.swipe-action {
  &__content {
    padding: 25rpx 0;
    background-color: #FFFFFF;
    z-index: 20;

    &__text {
      font-size: 30rpx;
      color: $u-main-color;
      padding-left: 32rpx;
    }
  }
}
</style>
