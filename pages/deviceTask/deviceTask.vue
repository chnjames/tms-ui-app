<template>
  <view class="container">
    <view class="device-top">
      <u-cell class="device-name" :border="false" isLink arrow-direction="down" @click="bindDevice">
        <view class="title" slot="title">
          <text>M38574359346 / 汽油加注机</text>
        </view>
      </u-cell>
      <u-icon name="scan" color="#2979ff" size="28" @click="bindScan"></u-icon>
    </view>
    <u-gap height="20rpx"></u-gap>
    <u--textarea v-model="deviceInfo.description" placeholder="请输入快速上报问题描述" count height="200rpx"
      :maxlength="300"></u--textarea>
    <u-gap height="20rpx"></u-gap>
    <u-cell-group class="user">
      <u-cell icon="account-fill">
        <view slot="title" @click="bindAccount">
          <text class="title">陈逸飞</text>
        </view>
      </u-cell>
      <u-cell icon="share-fill">
        <view slot="title">
          <text class="attention">陈逸飞</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill">
        <view slot="title" @click="bindCalendar">
          <text class="title">2022/11/13</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-gap height="20rpx"></u-gap>
    <!-- 附件列表 -->
    <view class="file-list" v-if="fileList.length > 0">
      <view class="file-item" v-for="(item, index) in fileList" :key="index">
        <view class="file-src">
          <u--image :showLoading="true" shape="circle" :src="item.url" width="100rpx"
            height="100rpx"></u--image>
          <view class="file-name">{{ item.name }}</view>
        </view>
        <u-icon name="close" size="24" @click="bindDelFile(item, index)"></u-icon>
      </view>
    </view>
    <u-row class="btn-group" gutter="20rpx" justify="space-around">
      <u-col span="3">
        <u-button text="立即创建" type="primary" shape="circle" @click="bindCreate"></u-button>
      </u-col>
      <u-col span="3">
        <u-button text="添加附件" color="#909399" shape="circle" @click="bindPhoto"></u-button>
      </u-col>
    </u-row>
    <!-- 设备选择器 -->
    <u-picker :show="deviceShow" ref="deviceRef" :columns="deviceColumns" @confirm="confirmDevice" @cancel="bindClose"
      @close="bindClose" @change="bindDeviceChange"></u-picker>
    <!-- 日期选择器 -->
    <u-calendar :show="calendarShow" @confirm="confirmCalendar" @cancel="bindClose" @close="bindClose"></u-calendar>
    <!-- 操作人选择器 -->
    <u-picker :show="accountShow" :columns="accountColumns" @cancel="bindClose" @close="bindClose"
      @confirm="confirmAccount"></u-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      deviceShow: false, // 设备选择器
      calendarShow: false, // 日期选择器
      accountShow: false, // 操作人选择器
      accountColumns: [
        ['操作人1', '操作人2', '操作人3']
      ],
      deviceColumns: [
        ['深圳2#工厂', '深圳1#工厂'],
        ['M01293844/汽油加注设备', 'M92938485/1#玻璃涂胶设备']
      ],
      deviceColumnData: [
        ['M01293844/汽油加注设备', 'M92938485/1#玻璃涂胶设备']
        ['M01293844/汽设备', 'M92938485/1#玻璃']
      ],
      deviceInfo: {
        name: '',
        description: ''
      },
      fileList: [{
        name: '附件1232.ipg',
        url: 'https://cdn.uviewui.com/uview/album/1.jpg'
      }, {
        name: '附件1232.ipg',
        url: 'https://cdn.uviewui.com/uview/album/1.jpg'
      }]
    }
  },
  methods: {
    // 扫码
    bindScan() {
      uni.scanCode({
        success: (res) => {
          console.log(res);
        }
      });
    },
    // 打开设备选择器
    bindDevice() {
      this.deviceShow = true
    },
    // 改变设备
    bindDeviceChange(e) {
      const { columnIndex, value, values, index, picker = this.$refs.deviceRef } = e
      if (columnIndex === 0) {
        picker.setColumnValues(1, this.deviceColumnData[index])
      } else {
        console.log(values)
      }
    },
    // 确认设备
    confirmDevice(e) {
      console.log('confirm', e)
      this.deviceShow = false
    },
    // 选择操作人
    bindAccount() {
      this.accountShow = true
    },
    // 确认操作人
    confirmAccount(e) {
      console.log('confirm', e)
      this.accountShow = false
    },
    // 选择日期
    bindCalendar() {
      this.calendarShow = true
    },
    // 确认日期
    confirmCalendar(e) {
      console.log('confirm', e)
      this.calendarShow = false
    },
    // 关闭选择器
    bindClose() {
      this.deviceShow = false
      this.calendarShow = false
      this.accountShow = false
    },
    // 删除附件
    bindDelFile(item, index) {
      console.log(item, index);
      this.fileList.splice(index, 1)
    },
    // 立即创建
    bindCreate() {
      this.$refs.uToast.show({
        type: 'success',
        message: "创建成功",
        complete() {
          uni.navigateBack()
        }
      })
    },
    // 添加附件
    bindPhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          console.log(res);
        }
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;

  .user {
    background-color: #FFFFFF;

    .title {
      color: #2979ff;
      font-size: 26rpx;
      margin-right: 10rpx;
    }

    .attention {
      font-size: 26rpx;
      margin-right: 10rpx;
    }
  }
  .device-top {
    @include flex-space-between;
  }
  .device-name {
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

  .btn-group {
    position: fixed;
    bottom: 200rpx;
    right: 0;
    left: 0;
  }
}

// 单个附件-卡片样式
.file-src {
  display: flex;
  align-items: center;
}

.file-name {
  font-size: 24rpx;
  color: #303133;
  margin-left: 20rpx;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background-color: #FFFFFF;
  border-radius: 10rpx;
  margin-bottom: 20rpx;

  .u-icon {
    margin-left: 20rpx;
  }
}</style>
