<template>
  <view class="container">
    <view class="fixed">
      <view class="district" blurEffect="light">
        <u-row justify="space-between" gutter="10">
          <u-col span="3" v-for="(item, index) in districtList" :key="index" align="center" textAlign="center"
                 @click="bindDistrict(item)">
            <view class="icon-text">{{ item.iconText }}</view>
            <view class="district-name">{{ item.name }}</view>
          </u-col>
        </u-row>
      </view>
    </view>
    <!-- 金刚区 -->
<!--    <u-sticky zIndex="100" customNavHeight="0">-->
<!--      <view class="sticky">-->
<!--        <view class="district" blurEffect="light">-->
<!--          <u-row justify="space-between" gutter="10">-->
<!--            <u-col span="3" v-for="(item, index) in districtList" :key="index" align="center" textAlign="center"-->
<!--                   @click="bindDistrict(item)">-->
<!--              <view class="icon-text">{{ item.iconText }}</view>-->
<!--              <view class="district-name">{{ item.name }}</view>-->
<!--            </u-col>-->
<!--          </u-row>-->
<!--        </view>-->
<!--      </view>-->
<!--    </u-sticky>-->
    <u-gap height="30rpx"></u-gap>
    <!-- 任务列表 -->
    <view class="task">
      <u-swipe-action>
        <u-list @scrolltolower="scrollToLower" height="100%" :preLoadScreen="pageCount * 4">
          <u-list-item v-for="(item, index) in taskList" :key="index">
            <u-swipe-action-item class="swipe-item" :options="item.options" :name="item.taskId" @click="bindSwiperItem">
              <view class="swipe-action" @click="bindTask(item)">
                <view class="swipe-action__content">
                  <view class="swipe-action__content__text">{{ item.urgentType }} {{ item.projectName }}</view>
                  <u-gap height="10rpx"></u-gap>
                  <view class="swipe-action__content__text">{{ item.taskName }}</view>
                  <u-gap height="16rpx"></u-gap>
                  <view class="swipe-action__content__date">{{ item.date }}</view>
                </view>
              </view>
            </u-swipe-action-item>
          </u-list-item>
          <u-loadmore :status="loadMoreStatus"/>
        </u-list>
      </u-swipe-action>
    </view>
  </view>
</template>

<script>
import {getCommonTaskPage, ignoreCommonTask, receiveCommonTask} from '@/api/task'
import  {timestampToTime} from '@/utils/utils'

export default {
  components: {},
  data() {
    return {
      pageCount: 1,
      total: 0,
      loadMoreStatus: 'loading',
      pageInfo: {
        pageNo: 1,
        pageSize: 10
      },
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
  computed: {
    projectList() {
      return this.$store.getters.projectList
    }
  },
  onShow() {
    this.loadMoreStatus = 'loading';
    this.pageInfo.pageNo = 1;
    this.taskList = [];
    this.getCommonTaskPage()
  },
  onPullDownRefresh() {
    this.loadMoreStatus = 'loading';
    this.pageInfo.pageNo = 1;
    this.taskList = [];
    this.getCommonTaskPage();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom() {
    this.scrollToLower()
  },
  methods: {
    // 获得公共任务分页
    getCommonTaskPage() {
      getCommonTaskPage(this.pageInfo).then(res => {
        const { total, list } = res.data
        this.pageCount = Math.ceil(total / this.pageInfo.pageSize)
        this.total = total
        list.forEach(item => {
          item.date = timestampToTime(item.endTime, 'MM月dd日截止')
          item.projectName = this.projectList.find(pro => pro?.id === item?.projectId)?.name || ''
          // 快速任务和快速设备任务
          if (item.taskType === 50 || item.taskType === 22) {
            item.projectName = `临时任务 ${item.projectName}`;
          }
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
        this.taskList = this.taskList.concat(list)
        if (this.pageInfo.pageNo === this.pageCount || this.total === 0) {
          this.loadMoreStatus = 'nomore'
        } else {
          this.loadMoreStatus = 'loading'
        }
        const totalStr = total > 99 ? '99+' : total.toString()
        if (total === 0) {
          uni.removeTabBarBadge({
            index: 0
          })
          return
        }
        uni.setTabBarBadge({
          index: 0,
          text: totalStr
        })
      })
    },
    scrollToLower() {
      if (this.pageInfo.pageNo < this.pageCount) {
        this.pageInfo.pageNo++
        this.getCommonTaskPage()
      } else {
        this.loadMoreStatus = 'nomore'
      }
    },
    // 忽略任务
    bindIgnoreTask(taskId) {
      ignoreCommonTask({ taskId }).then(() => {
        uni.$u.toast('忽略成功')
        setTimeout(() => {
          this.loadMoreStatus = 'loading';
          this.pageInfo.pageNo = 1;
          this.taskList = [];
          this.getCommonTaskPage()
        }, 300)
      })
    },
    // 领取任务
    bindReceiveTask(taskId) {
      receiveCommonTask({ taskId }).then(() => {
        uni.$u.toast('领取成功')
        setTimeout(() => {
          this.loadMoreStatus = 'loading';
          this.pageInfo.pageNo = 1;
          this.taskList = [];
          this.getCommonTaskPage()
        }, 300)
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
  //height: 100vh;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #F5F5F5;
  padding: 30rpx 30rpx 0;
  -webkit-transition: .3s;
  -moz-transition: .3s;
  -o-transition: .3s;
  transition: .3s;
  -webkit-transform: translate3d(0,0,0);
  -ms-transform: translate3d(0,0,0);
  -o-transform: translate3d(0,0,0);
  transform: translate3d(0,0,0);
}

.sticky {
  padding: 30rpx;
  background-color: #F5F5F5;
}

.task {
  padding: 232rpx 30rpx 120rpx;
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
  margin: 15rpx 0;
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
}
</style>
