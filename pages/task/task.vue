<template>
  <view class="container">
    <view class="sticky">
      <u-tabs itemStyle="width: 140rpx;height: 90rpx" lineColor="#214579" activeStyle="color: #214579"
              inactiveStyle="color: #666666" :list="tabList" keyName="label" @change="bindTab"></u-tabs>
    </view>
    <!-- 我的任务 -->
    <view class="task">
      <view v-for="(item, index) in mineTaskList" :key="index" @click="bindTask(item)">
        <view class="task-item">
          <u--text size="28rpx" color="#666666" :text="`${item.urgentType} ${item.projectName}`"></u--text>
          <u-gap height="10rpx"></u-gap>
          <u--text size="28rpx" color="#666666" :text="item.taskName"></u--text>
          <u-gap height="20rpx"></u-gap>
          <view class="task-item-start">
            <view class="task-item-time">{{ item.time }}</view>
            <view class="task-item-progress">{{ item.progress }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 查看更多 -->
    <u-loadmore :status="status" :load-text="loadText" :marginBottom="80" @loadmore="bindLoadMore"/>
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
      taskInfo: {
        pageNo: 1,
        pageSize: 10,
        tab: 0
      },
      projectList: [],
      tabList: getDictDatas(DICT_TYPE.APP_MY_TASK_TAB),
      status: 'loadmore',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      mineTaskList: []
    }
  },
  async created() {
    uni.getSystemInfo({
      success: (e) => {
        this.offsetTop = e.statusBarHeight;
      },
    });
    await this.getProjectSimpleList();
    await this.getMyTaskPage();
  },
  onReachBottom() {
    if (this.pageNo >= 3) return;
    this.status = 'loading';
    this.pageNo = ++this.pageNo;
    setTimeout(() => {
      for (let i = 1; i <= 10; i++) {
        this.mineTaskList.push({
          name: '紧急 华为贴标机设备' + i,
          task: '收款任务：首付款30%，20000元',
          time: '10月3日截止',
          progress: '30%'
        });
      }
      if (this.pageNo >= 3) this.status = 'nomore';
      else this.status = 'loading';
    }, 2000)
  },
  methods: {
    // 获取我的任务列表
    getMyTaskPage() {
      getMyTaskPage(this.taskInfo).then(res => {
        const {list} = res.data;
        this.mineTaskList = list?.map(item => ({
          ...item,
          urgentType: item?.urgent === 1 ? '紧急' : '',
          projectName: this.projectList.find(pro => pro?.id === item?.projectId)?.name || '',
          task: item?.taskName,
          time: timestampToTime(item?.endTime, 'MM月dd日截止'),
          progress: item?.rate + '%'
        })) || [];
      })
    },
    // 获取项目精简信息列表
    // 获取项目列表
    getProjectSimpleList() {
      getProjectSimpleList().then(res => {
        this.projectList = res.data || [];
      })
    },
    // 切换导航栏目
    bindTab(item) {
      console.log(item.value);
      this.taskInfo.tab = item.value;
      this.getMyTaskPage();
    },
    // 任务详情
    bindTask(item) {
      console.log('item', item);
      const {type} = item;
      switch (type) {
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
        // 更换备件任务(命名简写)
        case 3:
          uni.navigateTo({
            url: '/pages/replaceTaskDetail/replaceTaskDetail'
          });
          break;
        // 物料盘点任务
        case 4:
          uni.navigateTo({
            url: '/pages/inventoryTaskDetail/inventoryTaskDetail'
          });
          break;
        // 出库任务
        case 5:
          uni.navigateTo({
            url: '/pages/outboundTaskDetail/outboundTaskDetail'
          });
          break;
      }
    },
    // 加载更多
    bindLoadMore() {
      this.status = 'loading';
      this.pageNo = ++this.pageNo;
      setTimeout(() => {
        for (let i = 1; i <= 10; i++) {
          this.mineTaskList.push({
            name: '紧急 华为贴标机设备' + i,
            task: '收款任务：首付款30%，20000元',
            time: '10月3日截止',
            progress: '30%'
          });
        }
        if (this.pageNo >= 3) this.status = 'nomore';
        else this.status = 'loading';
      }, 2000)
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
