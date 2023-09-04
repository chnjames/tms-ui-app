<template>
  <view class="container">
    <view class="fixed">
      <u-tabs itemStyle="width: 140rpx;height: 90rpx;position: relative" :scrollable="false" lineColor="#214579" activeStyle="color: #214579"
              inactiveStyle="color: #666666" :list="tabList" keyName="label" @change="bindTab"></u-tabs>
    </view>
    <!-- 我的任务 -->
    <view class="task">
      <u-list @scrolltolower="scrollToLower" height="100%" :preLoadScreen="pageCount * 4">
        <u-list-item v-for="(item, index) in mineTaskList" :key="index">
          <view class="task-item" @click="bindTask(item)">
            <u--text size="28rpx" bold color="#666666" :text="`${item.urgentType} ${item.projectName}`"></u--text>
            <u-gap height="10rpx"></u-gap>
            <u--text size="28rpx" color="#666666" :text="item.taskName"></u--text>
            <u-gap height="20rpx"></u-gap>
            <view class="task-item-start">
              <view class="task-item-time">{{ item.time }}</view>
              <view class="task-item-progress">{{ item.progress }}</view>
            </view>
          </view>
        </u-list-item>
        <u-loadmore :status="loadMoreStatus"/>
      </u-list>
    </view>
    <!-- 快速创建 -->
    <view class="add-img" @click="bindAdd">
      <u-icon name="plus" bold color="#FFFFFF" size="40rpx"></u-icon>
    </view>
    <!-- 扫码 -->
    <view class="scan-img" @click="bindScan">
      <u-icon name="scan" bold color="#FFFFFF" size="50rpx"></u-icon>
    </view>
  </view>
</template>

<script>
import {getMyTaskPage, getMyTaskQty} from "@/api/task";
import {timestampToTime} from "@/utils/utils";
import {DICT_TYPE, getDictDatas} from "@/utils/dict";

export default {
  data() {
    return {
      pageCount: 1,
      total: 0,
      loadMoreStatus: 'loading',
      taskInfo: {
        pageNo: 1,
        pageSize: 10,
        tab: '0'
      },
      tabList: getDictDatas(DICT_TYPE.APP_MY_TASK_TAB),
      taskTypeList: getDictDatas(DICT_TYPE.OPERATIONS_TASK_TYPE),
      mineTaskList: []
    }
  },
  computed: {
    projectList() {
      return this.$store.getters.projectList
    }
  },
  onLoad() {
    this.getMyTaskQty();
  },
  onShow() {
    this.loadMoreStatus = 'loading';
    this.taskInfo.pageNo = 1;
    this.mineTaskList = [];
    this.getMyTaskPage();
  },
  onPullDownRefresh() {
    this.loadMoreStatus = 'loading';
    this.taskInfo.pageNo = 1;
    this.mineTaskList = [];
    this.getMyTaskPage();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom() {
    this.scrollToLower()
  },
  methods: {
    // 获取我的任务列表
    getMyTaskPage() {
      getMyTaskPage(this.taskInfo).then(res => {
        const { total, list } = res.data
        this.pageCount = Math.ceil(total / this.taskInfo.pageSize)
        this.total = total
        const qty = total > 99 ? '99+' : total
        for (let i = 0; i < this.tabList.length; i++) {
          if (this.taskInfo.tab === i.toString()) {
            this.tabList[i].badge.value = qty;
            break;
          }
        }
        list.forEach(item => {
          item.taskTypeStr = this.taskTypeList.find(task => parseInt(task?.value) === item?.taskType)?.cssClass || ''
          item.urgentType = item?.urgent === 1 ? '紧急' : ''
          item.projectName = this.projectList.find(pro => pro?.id === item?.projectId)?.name || ''
          item.task = item?.taskName
          item.time = timestampToTime(item?.endTime, 'MM月dd日截止')
          item.progress = item?.rate + '%'
        })
        this.mineTaskList = this.mineTaskList.concat(list);
        if (this.taskInfo.pageNo === this.pageCount || this.total === 0) {
          this.loadMoreStatus = 'nomore'
        } else {
          this.loadMoreStatus = 'loading'
        }
      })
    },
    // 获取我的任务数量
    getMyTaskQty() {
      getMyTaskQty().then(res => {
        const { data } = res
        const { runningTaskQty = 0, timeoutTaskQty = 0, completedTaskQty = 0, myFollowTaskQty = 0 } = data
        this.tabList.forEach(tab => {
          switch (tab.value) {
            case '0':
              const runningQty = runningTaskQty > 99 ? '99+' : runningTaskQty
              tab.badge = {value: runningQty}
              break;
            case '1':
              const timeoutQty = timeoutTaskQty > 99 ? '99+' : timeoutTaskQty
              tab.badge = {value: timeoutQty}
              break;
            case '2':
              const completedQty = completedTaskQty > 99 ? '99+' : completedTaskQty
              tab.badge = {value: completedQty}
              break;
            case '3':
              const myFollowQty = myFollowTaskQty > 99 ? '99+' : myFollowTaskQty
              tab.badge = {value: myFollowQty}
              break;
          }
        })
      })
    },
    scrollToLower() {
      if (this.taskInfo.pageNo < this.pageCount) {
        this.taskInfo.pageNo++
        this.getMyTaskPage()
      } else {
        this.loadMoreStatus = 'nomore'
      }
    },
    // 切换导航栏目
    bindTab(item) {
      this.taskInfo.tab = item.value;
      this.loadMoreStatus = 'loading';
      this.taskInfo.pageNo = 1;
      this.mineTaskList = [];
      this.getMyTaskPage();
    },
    // 任务详情
    bindTask(item) {
      const {taskTypeStr, taskId} = item;
      const {tab} = this.taskInfo;
      if (tab === '2' || tab === '3') return;
      switch (taskTypeStr) {
        // 设备快速&&快速&&采购&&回款任务
        case 'simple':
          uni.navigateTo({
            url: `/pages/ordinaryTaskDetail/ordinaryTaskDetail?taskId=${taskId}`
          });
          break;
        // 项目&&生产任务
        case 'project':
        case 'produce':
          uni.navigateTo({
            url: `/pages/taskDetail/taskDetail?taskId=${taskId}&taskType=${taskTypeStr}`
          });
          break;
        // 设备管理任务
        case 'check':
          uni.navigateTo({
            url: `/pages/deviceTaskDetail/deviceTaskDetail?taskId=${taskId}`
          });
          break;
        // 更换备件任务
        case 'part':
          uni.navigateTo({
            url: `/pages/replaceTaskDetail/replaceTaskDetail?taskId=${taskId}`
          });
          break;
        // 物料盘点任务
        case 'stocktaking':
          uni.navigateTo({
            url: `/pages/inventoryTaskDetail/inventoryTaskDetail?taskId=${taskId}`
          });
          break;
        // 出库任务
        case 'outbound':
          uni.navigateTo({
            url: `/pages/outboundTask/outboundTask?taskId=${taskId}`
          });
          break;
      }
    },
    // 快速创建普通任务
    bindAdd() {
      uni.navigateTo({
        url: '/pages/commonTask/commonTask'
      });
    },
    // 快速创建设备任务
    bindScan() {
      uni.navigateTo({
        url: '/pages/deviceTask/deviceTask'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  // -webkit-overflow-scrolling: touch;
  // overflow: scroll;
  .fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background-color: #F5F5F5;
    height: 90rpx;

    /deep/ .u-badge {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
    }
  }
  .sticky {
    position: sticky;
    top: 0;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
}

.add-img,
.scan-img {
  width: 70rpx;
  height: 70rpx;
  background-color: $custom-content-color;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-img {
  position: fixed;
  bottom: calc(var(--window-bottom) + 100rpx);
  left: 30rpx;
}

.scan-img {
  position: fixed;
  bottom: calc(var(--window-bottom) + 100rpx);
  right: 30rpx;
}

// 任务列表
.task {
  padding: 110rpx 30rpx 120rpx;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}

.task-item {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 0 10rpx #eee;

  &-start {
    @include flex-left;
  }

  &-time {
    font-size: 24rpx;
    color: #666666;
    margin-right: 60rpx;
  }

  &-progress {
    font-size: 24rpx;
    color: #108ee9;
  }
}
</style>
