<template>
  <view class="container">
    <!-- 金刚区 -->
    <view class="district" blurEffect="light">
      <u-row justify="space-between" gutter="10">
        <u-col span="3" v-for="(item, index) in districtList" :key="index" align="center" textAlign="center"
          @click="bindDistrict(item)">
          <view class="icon-text">{{ item.iconText }}</view>
          <view class="district-name">{{ item.name }}</view>
        </u-col>
      </u-row>
    </view>
    <u-gap height="40rpx"></u-gap>
    <!-- 任务列表 -->
    <u-swipe-action>
      <u-swipe-action-item class="swipe-item" :options="item.options" v-for="(item, index) in taskList" :name="item.taskId"
        :key="index" @click="bindSwiperItem">
        <view class="swipe-action" @click="bindTask(item)">
          <view class="swipe-action__content">
            <view class="swipe-action__content__text">{{ item.urgentType }} {{ item.taskName }}</view>
            <u-gap height="10rpx"></u-gap>
            <view class="swipe-action__content__text">{{ item.taskType }}</view>
            <u-gap height="16rpx"></u-gap>
            <view class="swipe-action__content__date">{{ item.date }}</view>
          </view>
        </view>
      </u-swipe-action-item>
    </u-swipe-action>
  </view>
</template>

<script>
import {getCommonTaskPage, ignoreCommonTask, receiveCommonTask} from '../../api/task'
import  {timestampToTime} from '../../utils/utils'

export default {
  components: {},
  data() {
    return {
      districtList: [{
        name: '到货验收',
        iconText: '收',
        url: '/pages/acceptance/acceptance'
      }, {
        name: '入库操作',
        iconText: '入',
        url: '/pages/receipt/receipt'
      }, {
        name: '扫码出库',
        iconText: '出',
        url: '/pages/outgoing/outgoing'
      }, {
        name: '设备信息',
        iconText: '查',
        url: '/pages/equipment/equipment'
      }],
      taskList: []
    }
  },
  onShow() {
    this.getCommonTaskPage()
  },
  methods: {
    // 获得公共任务分页
    getCommonTaskPage() {
      getCommonTaskPage().then(res => {
        const { total, list } = res.data
        list.forEach(item => {
          item.date = timestampToTime(item.endTime, 'MM月dd日截止')
          item.urgentType = item.urgent === 1 ? '紧急' : ''
          item.options = [{
            text: '立即领取',
            style: {
              backgroundColor: '#cccccc'
            }
          }, {
            text: '忽略',
            style: {
              backgroundColor: '#f04844'
            }
          }]
        })
        this.taskList = list
        uni.setTabBarBadge({
          index: 0,
          text: total
        })
      })
    },
    // 忽略任务
    bindIgnoreTask(taskId) {
      ignoreCommonTask({ taskId }).then(() => {
        uni.$u.toast('忽略成功')
        this.getCommonTaskPage()
      }).catch(err => {
        uni.$u.toast(err.msg)
      })
    },
    // 领取任务
    bindReceiveTask(taskId) {
      receiveCommonTask({ taskId }).then(() => {
        uni.$u.toast('领取成功')
        this.getCommonTaskPage()
      }).catch(err => {
        uni.$u.toast(err.msg)
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
      if (index === 0) {
        this.bindReceiveTask(name)
      } else {
        this.bindIgnoreTask(name)
      }
    },
    // 领取任务
    bindTask(item) {
      const { taskId } = item
      uni.navigateTo({
        url: `/pages/receiveTask/receiveTask?taskId=${taskId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
}

.district {
  border-radius: 20rpx;
  padding: 40rpx;
  text-align: center;
  background-color: #e7e6e6;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, .1);

  .icon-text {
    font-size: 30rpx;
    color: #666666;
    margin-bottom: 20rpx;
    border: 1rpx solid #666666;
    border-radius: 50%;
    width: 60rpx;
    height: 60rpx;
    background-color: #FFFFFF;
    line-height: 60rpx;
    text-align: center;
  }

  .district-name {
    font-size: 26rpx;
    color: #333333;
  }
}

.swipe-item {
  margin: 20rpx 0;
  border-radius: 10rpx;
  overflow: hidden;
  background-color: #FFFFFF;
}

.swipe-action {
  &__content {
    padding: 20rpx;

    &__text {
      font-size: 28rpx;
      color: $custom-text-sub-color;
    }
    &__date {
      font-size: 24rpx;
      color: $custom-text-danger-color;
    }
  }
}</style>
