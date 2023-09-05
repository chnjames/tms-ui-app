<template>
  <view class="container">
    <view @click="bindInventory(item)" :class="['inventory-item', item.status ? 'active' : '']"
          v-for="(item, index) in indexList" :key="index">{{ item.storeDesc }}</view>
    <u-button v-if="isTab" :disabled="isReceive" class="receive" text="完成任务" color="#214579" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
import {getLocationList} from "@/api/stock";
import {getTaskDetail, missionTask} from "@/api/task";
export default {
  data() {
    return {
      indexList: [],
      taskId: '',
      tabType: ''
    };
  },
  onLoad(options) {
    const {taskId, tab} = options;
    this.taskId = taskId;
    this.tabType = tab;
    this.getTaskDetail(this.taskId);
  },
  computed: {
    isReceive() {
      return this.indexList.some(item => !item.status)
    },
    isTab() {
      return this.tabType !== '2' && this.tabType !== '3'
    }
  },
  methods: {
    // 获取任务详情
    getTaskDetail(taskId) {
      getTaskDetail({taskId}).then(res => {
        const {data} = res;
        const {areaId} = data.extra
        this.getLocationList(areaId)
      })
    },
    // 库位列表
    getLocationList(areaId) {
      getLocationList({areaId}).then(res => {
        console.log(res)
        const {data} = res
        data.map(item => {
          item.storeDesc = `${item.storeName} ${item.areaName} ${item.location}`
          item.status = false
        })
        this.indexList = data
      })
    },
    // 物料盘点任务Item
    bindInventory(item) {
      const {areaId, storeId, storeDesc, location} = item;
      item.status = true;
      uni.navigateTo({
        url: `/pages/inventoryTask/inventoryTask?areaId=${areaId}&storeId=${storeId}&location=${location}&storeDesc=${storeDesc}`
      })
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

  .receive {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 200rpx;
    width: 200rpx;
  }

  .inventory-item {
    margin: 12rpx 0;
    border-radius: 30rpx;
    background-color: #FFFFFF;
    padding: 16rpx;
    color: $custom-content-color;
    font-size: 26rpx;

    &.active {
      color: $custom-text-sub-color;
      // 背景透明或者移除背景
      background-color: transparent;
    }
  }
}
</style>
