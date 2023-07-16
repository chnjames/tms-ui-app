<template>
  <view class="container">
    <u--text color="#aaaaaa" text="采购单号"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="PN">
      <u-cell class="PN-name" :border="false" isLink arrow-direction="down" @click="bindPN">
        <view class="title" slot="title">
          <text v-if="!pnCode" class="placeholder">请选择或扫描采购单号</text>
          <text v-else>{{pnCode}}</text>
        </view>
      </u-cell>
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="20rpx"></u-gap>
    <!-- 收货任务 -->
    <view class="task" v-if="acceptanceList.length > 0">
      <view v-for="(item, index) in acceptanceList" :key="index">
        <view class="task-item">
          <view>
            <view>{{ item.materialCode }} {{ item.materialName}}</view>
            <u-gap height="20rpx"></u-gap>
            <view>数量：{{ item.qty }}</view>
          </view>
          <u-button v-if="!item.received" color="#108ee9" text="收货" @click="bindAcceptance(item)"></u-button>
        </view>
      </view>
    </view>
    <u-button v-if="acceptanceList.length > 0" class="receive" text="确 定" color="#214579" shape="circle" @click="bindBack"></u-button>
    <!-- PN号选择器 -->
    <u-picker :show="PNShow" :columns="PNColumns" keyName="pnCode" cancelColor="#aaaaaa" confirmColor="#214579" @cancel="bindClose" @close="bindClose" @confirm="confirmPN"></u-picker>
  </view>
</template>

<script>
import {getAcceptanceList, getAcceptanceDetail, acceptance} from "../../api/warehouse";
export default {
  data() {
    return {
      PNShow: false, // 操作人选择器
      pnCodeList: [],
      PNColumns: [],
      buyingId: '',
      pnCode: '',
      acceptanceList: []
    };
  },
  onLoad() {
    this.getAcceptanceList()
  },
  methods: {
    // 待验收列表
    getAcceptanceList() {
      getAcceptanceList().then(res => {
        this.pnCodeList = res.data || []
        this.PNColumns = [res.data || []]
      })
    },
    // 验收详情
    getAcceptanceDetail(buyingId) {
      getAcceptanceDetail(buyingId).then(res => {
        this.acceptanceList = res.data.items || []
      })
    },
    // 收货提交
    acceptance(itemId) {
      acceptance({
        buyingId: this.buyingId,
        buyingItemId: itemId
      }).then(() => {
        // 验收成功
        uni.$u.toast('验收成功')
        this.getAcceptanceDetail(this.buyingId)
      })
    },
    // 到货验收
    bindAcceptance(item) {
      this.acceptance(item.id)
    },
    // 扫码
    bindScan() {
      uni.scanCode({
        success: (res) => {
          const {result} = res
          const buyingId = parseInt(result)
          this.buyingId = buyingId
          this.pnCode = this.pnCodeList.find(item => item.buyingId === buyingId).pnCode
          this.getAcceptanceDetail(result)
        }
      });
    },
    // 确定返回
    bindBack() {
      uni.navigateBack()
    },
    // 选择采购单号
    bindPN() {
      if (this.PNColumns.length > 0) {
        this.PNShow = true;
      } else {
        uni.$u.toast('暂无采购单号')
      }
    },
    // 确认操作人
    confirmPN({value}) {
      const [firstItem] = value
      this.buyingId = firstItem.buyingId
      this.pnCode = firstItem.pnCode
      this.getAcceptanceDetail(firstItem.buyingId)
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
  padding: 30rpx;

  .PN {
    @include flex-space-between;
  }

  .PN-name {
    flex: 1;
    background-color: #ffffff;
    border-radius: 10rpx;
    margin-right: 20rpx;

    .title {
      color: $custom-content-color;
      font-size: 26rpx;
    }
  }

  .placeholder {
    color: #aaaaaa;
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
  color: $custom-text-sub-color;
  font-size: 26rpx;
  padding: 30rpx;
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
