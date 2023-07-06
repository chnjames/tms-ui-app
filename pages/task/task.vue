<template>
  <view class="container">
    <view class="sticky" bgColor="#F5F5F5">
      <u-tabs itemStyle="width: 140rpx;height: 90rpx" lineColor="#214579" activeStyle="color: #214579"
              inactiveStyle="color: #666666" :list="tabList" keyName="label" @change="bindTab"></u-tabs>
    </view>
    <!-- 我的任务 -->
    <view class="task">
      <u-list @scrolltolower="scrollToLower" height="100%" :preLoadScreen="pageCount * 4">
        <u-list-item v-for="(item, index) in mineTaskList" :key="index">
          <view class="task-item" @click="bindTask(item)">
            <u--text size="28rpx" color="#666666" :text="`${item.urgentType} ${item.projectName}`"></u--text>
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
import {getMyTaskPage} from "../../api/task";
import {timestampToTime} from "../../utils/utils";
import {DICT_TYPE, getDictDatas} from "../../utils/dict";
import {getProjectSimpleList} from "../../api/project";

export default {
  data() {
    return {
      offsetTop: 0,
      pageCount: 1,
      total: 0,
      loadMoreStatus: 'loading',
      taskInfo: {
        pageNo: 1,
        pageSize: 10,
        tab: 0
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
  created() {
    uni.getSystemInfo({
      success: (e) => {
        this.offsetTop = e.statusBarHeight;
      }
    });
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
      console.log('item', item);
      const {taskTypeStr, taskType, taskId} = item;
      console.log(taskTypeStr, taskType, taskId)
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
            url: `/pages/taskDetail/taskDetail?taskId=${taskId}&taskType=${taskType}`
          });
          break;
        // 项目&&生产任务
        case 1:
          uni.navigateTo({
            url: '/pages/taskDetail/taskDetail'
          });
          break;
        // 设备管理任务
        case 2:
          uni.navigateTo({
            url: '/pages/deviceTaskDetail/deviceTaskDetail'
          });
          break;
        // 更换备件任务
        case 'part':
          uni.navigateTo({
            url: '/pages/replaceTaskDetail/replaceTaskDetail'
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
      // 允许从相机和相册扫码
      // uni.scanCode({
      //   autoDecodeCharset: false,
      //   success: function(res) {
      //     console.log('条码类型：' + res.scanType);
      //     console.log('条码内容：' + res.result);
      //   },
      //   fail: function(err) {
      //     console.log('err', err)
      //   }
      // });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  // -webkit-overflow-scrolling: touch;
  // overflow: scroll;
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
  padding: 30rpx;
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
