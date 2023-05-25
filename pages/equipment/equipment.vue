<template>
  <view class="container">
    <view class="coding">
      <!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
      <!-- #ifndef APP-NVUE -->
      <u-input class="coding-name" color="#214579" fontSize="28rpx" placeholder="请扫描或输入物料名称" border="bottom"
        v-model="materialCode" @change="bindMaterial">
        <!-- #endif -->
        <!-- #ifdef APP-NVUE -->
        <u--input class="coding-name" color="#214579" fontSize="28rpx" placeholder="请扫描或输入物料名称" border="bottom"
          v-model="materialCode" @change="bindMaterial">
          <!-- #endif -->
          <template slot="suffix">
            <u-icon name="search" color="#214579" size="24"></u-icon>
          </template>
          <!-- #ifndef APP-NVUE -->
      </u-input>
      <!-- #endif -->
      <!-- #ifdef APP-NVUE -->
      </u--input>
      <!-- #endif -->
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="80rpx"></u-gap>
    <u--text color="#aaaaaa" text="所在位置"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#666666" text="深圳2工厂 - 总装车间 - 内饰一线"></u--text>
    <u-gap height="80rpx"></u-gap>
    <u-tabs :list="tabList" @click="bindTab" lineColor="#214579" activeStyle="color: #214579" inactiveStyle="color: #666666"></u-tabs>
    <view class="task" v-show="currentIndex === 0">
      <view v-for="(item, index) in mineTaskList" :key="index">
        <view class="task-item">
          <view>
            <u--text color="#aaaaaa" size="26rpx" :text="item.time"></u--text>
            <u-gap height="20rpx"></u-gap>
            <view class="task-abnormal">
              <view class="task-abnormal-name">{{ item.task }}</view>
              <view class="task-abnormal-desc">{{ item.description }}</view>
            </view>
          </view>
          <u-album :urls="item.imgList" singleMode="scaleToFill" multipleSize="60" singleSize="60" :maxCount="2" :rowCount="2"></u-album>
        </view>
      </view>
    </view>
    <view class="task" v-show="currentIndex === 1">
      <view v-for="(item, index) in docList" :key="index">
        <view class="task-item-doc" @click="bindDocument(item.url)">
          <view class="doc-name">{{ item.name }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      tabList: [{
        name: '设备履历'
      }, {
        name: '设备文档'
      }],
      mineTaskList: [{
        time: '2022/11/12 12:00:21',
        task: '日常点检',
        description: '温度异常(60℃)',
        imgList: ['https://img.yzcdn.cn/vant/cat.jpeg', 'https://img.yzcdn.cn/vant/cat.jpeg',
          'https://img.yzcdn.cn/vant/cat.jpeg'
        ]
      }, {
        time: '2022/11/12 12:00:21',
        task: '日常点检',
        imgList: ['https://img.yzcdn.cn/vant/cat.jpeg', 'https://img.yzcdn.cn/vant/cat.jpeg',
          'https://img.yzcdn.cn/vant/cat.jpeg'
        ]
      }, {
        time: '2022/11/12 12:00:21',
        task: '日常点检',
        description: '温度异常(60℃)',
        imgList: ['https://img.yzcdn.cn/vant/cat.jpeg']
      }, {
        time: '2022/11/12 12:00:21',
        task: '日常点检',
        description: '温度异常(60℃)',
        imgList: ['https://cdn.uviewui.com/uview/album/1.jpg']
      }, {
        time: '2022/11/12 12:00:21',
        task: '日常点检',
        description: '温度异常(60℃)',
        imgList: ['https://img.yzcdn.cn/vant/cat.jpeg', 'https://img.yzcdn.cn/vant/cat.jpeg']
      }],
      docList: [{
        url: 'http://www.gov.cn/zhengce/pdfFile/2023_PDF.pdf',
        name: '加注机设备图纸.pdf'
      }, {
        url: 'http://www.gov.cn/zhengce/pdfFile/2023_PDF.pdf',
        name: '加注机设备图纸.pdf'
      }]
    };
  },
  methods: {
    // tab切换
    bindTab({
      name,
      index
    }) {
      console.log(name, index)
      this.currentIndex = index
    },
    // 文档查看
    bindDocument(url) {
      uni.downloadFile({
        url,
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
  padding: 30rpx;
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
  margin-top: 20rpx;
}

.task-abnormal {
  @include flex-left;
  font-size: 24rpx;

  &-name {
    color: #aaaaaa;
    margin-right: 20rpx;
  }

  &-desc {
    color: #ff3399;
  }
}

.task-item {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 0 10rpx #eee;

  @include flex-space-between;
  &-doc {
    background-color: #e7e6e6;
    border-radius: 10rpx;
    padding: 30rpx;
    font-size: 28rpx;
    color: $custom-text-sub-color;
    margin-bottom: 20rpx;
    box-shadow: 0 0 10rpx #eee;
  }
  .doc-name {
    padding: 16rpx 0;
  }
}

/deep/ .u-album {
  .u-album__row__wrapper {
    uni-image {
      // height: 120rpx !important;
      // width: 120rpx !important;
    }
  }

}
</style>
