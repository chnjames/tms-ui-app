<template>
  <view class="container">
    <u--text text="采购单号"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="PN">
      <u-cell class="PN-name" :border="false" isLink arrow-direction="down" @click="bindPN">
        <view class="title" slot="title">
          <text>PN202303948853</text>
        </view>
      </u-cell>
      <u-icon name="scan" color="#2979ff" size="28" @click="bindScan"></u-icon>
    </view>
    <u-gap height="20rpx"></u-gap>
    <!-- 收货任务 -->
    <view class="task">
      <view v-for="(item, index) in mineTaskList" :key="index" @click="bindTask(item)">
        <view class="task-item">
          <view>
            <view>{{ item.task }}</view>
            <u-gap height="20rpx"></u-gap>
            <view>数量：{{ item.quantity }}</view>
          </view>
          <u-button plain type="primary" text="收货"></u-button>
        </view>
      </view>
    </view>
    <u-button class="receive" text="确 定" type="primary" shape="circle" @click="bindReceive"></u-button>
    <!-- PN号选择器 -->
    <u-picker :show="PNShow" :columns="PNColumns" @cancel="bindClose" @close="bindClose" @confirm="confirmPN"></u-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      PNShow: false, // 操作人选择器
      PNColumns: [
        ['PN202303948853', 'PN202303948850', 'PN202303948859']
      ],
      mineTaskList: [{
        task: 'M38574359346 汽油加注机滤芯',
        quantity: 1
      }, {
        task: 'M38574359346 汽油加注机滤芯',
        quantity: 1
      }, {
        task: 'M38574359346 汽油加注机滤芯',
        quantity: 1
      }, {
        task: 'M38574359346 汽油加注机滤芯',
        quantity: 1
      }, {
        task: 'M38574359346 汽油加注机滤芯',
        quantity: 1
      }, {
        task: 'M38574359346 汽油加注机滤芯',
        quantity: 1
      }, {
        task: 'M38574359346 汽油加注机滤芯',
        quantity: 1
      }, {
        task: 'M38574359346 汽油加注机滤芯',
        quantity: 1
      }, {
        task: 'M38574359346 汽油加注机滤芯',
        quantity: 1
      }, {
        task: 'M38574359346 汽油加注机滤芯',
        quantity: 1
      }]
    };
  },
  methods: {
    // 选择操作人
    bindPN() {
      this.PNShow = true
    },
    // 确认操作人
    confirmPN(e) {
      console.log('confirm', e)
      this.PNShow = false
    },
    // 关闭选择器
    bindClose() {
      this.PNShow = false
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;

  .PN {
    @include flex-space-between;
  }

  .PN-name {
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

.receive {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 200rpx;
  width: 200rpx;
}
</style>
