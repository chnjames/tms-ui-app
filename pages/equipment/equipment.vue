<template>
  <view class="container">
    <view class="coding">
      <u-cell class="coding-name" :border="false" isLink arrow-direction="down" @click="bindDevice">
        <view class="title" slot="title">
          <text>M38574359346 / 汽油加注机</text>
        </view>
      </u-cell>
      <u-icon name="scan" color="#2979ff" size="28" @click="bindScan"></u-icon>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u--text text="所在位置"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" bold text="深圳2工厂 - 总装车间 - 内饰一线"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u-tabs :list="tabList" @click="bindTab"></u-tabs>
    <view class="task">
      <view v-for="(item, index) in mineTaskList" :key="index">
        <view class="task-item">
          <view>
            <view>{{ item.time }}</view>
            <u-gap height="20rpx"></u-gap>
            <view>{{ item.task }} {{ item.description }}</view>
          </view>
          <u-album :urls="item.imgList" singleSize="70" singleMode="aspectFill" :maxCount="2" :rowCount="2"></u-album>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabList: [{
        name: '设备履历'
      }, {
        name: '设备文档'
      }],
      mineTaskList: [{
        time: '2022/11/12 12:00:21',
        task: '日常点检',
        description: '温度异常(60℃)',
        imgList: ['https://img.yzcdn.cn/vant/cat.jpeg', 'https://img.yzcdn.cn/vant/cat.jpeg', 'https://img.yzcdn.cn/vant/cat.jpeg']
      }, {
        time: '2022/11/12 12:00:21',
        task: '日常点检',
        imgList: ['https://img.yzcdn.cn/vant/cat.jpeg', 'https://img.yzcdn.cn/vant/cat.jpeg', 'https://img.yzcdn.cn/vant/cat.jpeg']
      }, {
        time: '2022/11/12 12:00:21',
        task: '日常点检',
        description: '温度异常(60℃)'
      }, {
        time: '2022/11/12 12:00:21',
        task: '日常点检',
        description: '温度异常(60℃)',
        imgList: ['https://img.yzcdn.cn/vant/cat.jpeg']
      }, {
        time: '2022/11/12 12:00:21',
        task: '日常点检',
        description: '温度异常(60℃)',
        imgList: ['https://img.yzcdn.cn/vant/cat.jpeg', 'https://img.yzcdn.cn/vant/cat.jpeg']
      }]
    };
  },
  methods: {
    // tab切换
    bindTab(e) {
      console.log('当前值为: ' + e.name)
    },
    // 文档查看
    bindDocument() {
      uni.downloadFile({
        url: 'http://www.gov.cn/zhengce/pdfFile/2023_PDF.pdf',
        success: function (res) {
          var filePath = res.tempFilePath;
          uni.openDocument({
            filePath: filePath,
            showMenu: true,
            success: function (res) {
              console.log('打开文档成功');
            }
          });
        }
      });

    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.coding {
  @include flex-space-between;
}

.coding-name {
  flex: 1;
  background-color: #ffffff;
  border-radius: 10rpx;
  margin-right: 20rpx;

  .title {
    color: #303133;
    font-size: 24rpx;
    font-weight: bold;
  }
}

// 任务列表
.task {
  // padding: 20rpx;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}

.task-item {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 0 10rpx #eee;

  @include flex-space-between;

  .u-button {
    width: 120rpx;
    height: 60rpx;
    margin: 0;
  }
}
</style>
