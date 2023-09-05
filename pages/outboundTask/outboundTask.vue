<template>
  <view class="container">
    <view class="card" v-for="(item, index) in taskList" :key="index">
      <view>
        <u--text color="#214579" size="26rpx" :text="`${item.materialCode} ${item.materialName}`"></u--text>
        <u-gap height="10rpx"></u-gap>
        <u--text color="#779dbd" size="26rpx" :text="`数量：${item.qty}`"></u--text>
      </view>
      <view class="btn" v-if="item.status === 1" @click="bindOutbound(item)">出 库</view>
    </view>
    <!-- 完成任务 -->
    <u-button v-if="isTab" class="receive" :disabled="isAllOutbound" text="完成任务" color="#214579" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
import {getTaskDetail, getBomDemandList} from "@/api/task";
import {missionTask} from "@/api/task";
export default {
  data() {
    return {
      taskId: '',
      taskList: [],
      tabType: ''
    };
  },
  computed: {
    isAllOutbound() {
      return this.taskList.map(item => item.status !== 1).includes(false);
    },
    isTab() {
      return this.tabType !== '2' && this.tabType !== '3'
    }
  },
  onLoad(options) {
    const {taskId, tab} = options;
    this.taskId = taskId;
    this.tabType = tab;
  },
  onShow() {
    this.getTaskDetail(this.taskId);
  },
  methods: {
    // 获取任务详情
    getTaskDetail(taskId) {
      getTaskDetail({taskId}).then(res => {
        const {data} = res;
        const {bomIds} = data.extra;
        const bomIdsStr = bomIds.join(',');
        this.getBomDemandList(bomIdsStr);
      })
    },
    // 获取BOM需求列表
    getBomDemandList(bomIds) {
      getBomDemandList({bomIds}).then(res => {
        const {data} = res;
        this.taskList = data;
      })
    },
    bindOutbound(item) {
      const {materialId, qty, id} = item;
      uni.navigateTo({
        url: `/pages/outboundMaterial/outboundMaterial?materialId=${materialId}&qty=${qty}&id=${id}`
      });
    },
    // 完成任务
    bindReceive() {
      missionTask({taskId: this.taskId}).then(() => {
        uni.$u.toast('任务完成')
        setTimeout(() => {
          uni.navigateBack()
        }, 300)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  .card {
    background-color: #fff;
    border-radius: 10rpx;
    color: $custom-content-color;
    font-size: 26rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    @include flex-space-between;

    .btn {
      width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      background-color: #d9d9d9;
      color: $custom-content-color;
      border-radius: 5rpx;
    }
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
