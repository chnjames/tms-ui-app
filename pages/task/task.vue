<template>
  <view class="container">
    <u-sticky bgColor="#fff" :offset-top="offsetTop" customNavHeight="60rpx">
      <u-tabs itemStyle="width: 150rpx;height: 60rpx" :list="tabList" @change="bindTab"></u-tabs>
    </u-sticky>
    <!-- 我的任务 -->
    <view class="task">
      <view v-for="(item, index) in mineTaskList" :key="index" @click="bindTask(item)">
        <view class="task-item">
          <view>{{ item.name }}</view>
          <view>{{ item.task }}</view>
          <view>{{ item.time }} {{ item.progress }}</view>
        </view>
      </view>
    </view>
    <!-- 查看更多 -->
    <u-loadmore :status="status" :load-text="loadText" :marginBottom="80" @loadmore="bindLoadMore" />
    <!-- 快速创建 -->
    <view class="add-img" @click="bindAdd">
      <u-icon name="plus" color="#FFFFFF" size="56rpx"></u-icon>
    </view>
    <!-- 扫码 -->
    <view class="scan-img" @click="bindScan">
      <u-icon name="scan" color="#FFFFFF" size="56rpx"></u-icon>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      offsetTop: 0,
      addImg: require('../../static/images/icons/add.png'),
      outgoingImg: require('../../static/images/icons/outgoing.png'),
      tabList: [{
        name: '进行中'
      }, {
        name: '已逾期',
        badge: {
          value: 6
        }
      }, {
        name: '已完成'
      }, {
        name: '我关注',
        badge: {
          value: 1
        }
      }],
      status: 'loadmore',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
      pageNo: 1,
      pageSize: 10,
      mineTaskList: [{
        name: '紧急 华为贴标机设备',
        task: '收款任务：首付款30%，20000元',
        time: '10月3日截止',
        progress: '30%'
      }, {
        name: '紧急 华为贴标机设备',
        task: '收款任务：首付款30%，20000元',
        time: '10月3日截止',
        progress: '30%'
      }, {
        name: '紧急 华为贴标机设备',
        task: '收款任务：首付款30%，20000元',
        time: '10月3日截止',
        progress: '30%'
      }, {
        name: '紧急 华为贴标机设备',
        task: '收款任务：首付款30%，20000元',
        time: '10月3日截止',
        progress: '30%'
      }, {
        name: '紧急 华为贴标机设备',
        task: '收款任务：首付款30%，20000元',
        time: '10月3日截止',
        progress: '30%'
      }, {
        name: '紧急 华为贴标机设备',
        task: '收款任务：首付款30%，20000元',
        time: '10月3日截止',
        progress: '30%'
      }, {
        name: '紧急 华为贴标机设备',
        task: '收款任务：首付款30%，20000元',
        time: '10月3日截止',
        progress: '30%'
      }, {
        name: '紧急 华为贴标机设备',
        task: '收款任务：首付款30%，20000元',
        time: '10月3日截止',
        progress: '30%'
      }, {
        name: '紧急 华为贴标机设备',
        task: '收款任务：首付款30%，20000元',
        time: '10月3日截止',
        progress: '30%'
      }, {
        name: '紧急 华为贴标机设备',
        task: '收款任务：首付款30%，20000元',
        time: '10月3日截止',
        progress: '30%'
      }]
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: (e) => {
        console.log(e);
        // // #ifdef MP-WEIXIN
        // let custom = wx.getMenuButtonBoundingClientRect();
        // const height = custom.bottom + custom.top - e.statusBarHeight + 48;
        // console.log(height);
        // // #endif
        // const height = e.statusBarHeight + 48;
        // console.log('height', height)
      },
    });
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
      console.log('this.mineTaskList', this.mineTaskList);
      if (this.pageNo >= 3) this.status = 'nomore';
      else this.status = 'loading';
    }, 2000)
  },
  methods: {
    // 切换导航栏目
    bindTab(item) {
      console.log(item);
    },
    // 任务详情
    bindTask(item) {
      console.log('item', item);
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
}

.add-img,
.scan-img {
  width: 80rpx;
  height: 80rpx;
  background-color: #4988fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-img {
  position: fixed;
  bottom: 200rpx;
  left: 30rpx;
}

.scan-img {
  position: fixed;
  bottom: 200rpx;
  right: 30rpx;
}

// 任务列表
.task {
  padding: 20rpx;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}

.task-item {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 0 10rpx #eee;
}
</style>
