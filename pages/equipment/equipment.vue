<template>
  <view class="container">
    <view class="coding">
      <u--input class="coding-name" v-model="deviceDesc" readonly border="bottom" color="#214579" fontSize="28rpx" placeholder="请选择或扫描设备编码"></u--input>
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="80rpx"></u-gap>
    <view v-if="deviceId">
      <u--text color="#aaaaaa" text="所在位置"></u--text>
      <u-gap height="20rpx"></u-gap>
      <u--text size="28rpx" color="#666666" :text="deviceLocation"></u--text>
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
                <!--<view class="task-abnormal-desc">{{ item.description }}</view>-->
              </view>
            </view>
            <u-album :urls="item.imgList" singleMode="scaleToFill" multipleSize="60" singleSize="60" :maxCount="2" :rowCount="2"></u-album>
          </view>
        </view>
      </view>
      <view class="task" v-show="currentIndex === 1">
        <view v-for="(item, index) in docList" :key="index">
          <view class="task-item-doc" @click="bindDocument(item.url)">
            <view class="doc-name">{{ item.suffixName }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {getDeviceDetail, getDeviceSimpleList} from "../../api/device";
import {getTaskPage} from "../../api/task";
import {getProjectDocList} from "../../api/project";
import {timestampToTime} from "../../utils/utils";
export default {
  data() {
    return {
      deviceId: '',
      deviceDesc: '',
      deviceLocation: '',
      taskInfo: {
        pageNo: 1,
        pageSize: 10,
        projectId: ''
      },
      docInfo: {
        pageNo: 1,
        pageSize: 10,
        projectId: ''
      },
      currentIndex: 0,
      tabList: [{
        name: '设备履历'
      }, {
        name: '设备文档'
      }],
      mineTaskList: [],
      docList: []
    };
  },
  onLoad() {
    this.getDeviceSimpleList()
  },
  methods: {
    // 获取设备信息
    getDeviceDetail(deviceId) {
      getDeviceDetail({deviceId}).then(res => {
        const {data} = res
        this.deviceDesc = `${data.code}/${data.name}`
        this.deviceLocation = data.location
        this.taskInfo.projectId = data.projectId
        this.docInfo.projectId = data.projectId
        this.getTaskPage()
        this.getProjectDocList()
      })
    },
    // 获取设备精简列表
    getDeviceSimpleList() {
      getDeviceSimpleList().then(res => {
        console.log(res)
      })
    },
    // 获取设备履历
    getTaskPage() {
      getTaskPage(this.taskInfo).then(res => {
        const {list} = res.data
        this.mineTaskList = list?.map(item => ({
          task: item.name,
          time: timestampToTime(item.createTime),
          imgList: item.attachments
        })) || [];
      })
    },
    // 获取设备文档
    getProjectDocList() {
      getProjectDocList(this.docInfo).then(res => {
        console.log(res)
        const {list} = res.data
        this.docList = list?.map(item => ({
          url: item.url,
          suffixName: `${item.name}.${item.type}`
        })) || [];
      })
    },
    // 扫码
    bindScan() {
      this.deviceId = 19
      this.getDeviceDetail(19)
      uni.scanCode({
        success: (res) => {
          console.log(res)
        }
      });
    },
    // tab切换
    bindTab({name, index}) {
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
          })
        }
      })
    }
  }
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
