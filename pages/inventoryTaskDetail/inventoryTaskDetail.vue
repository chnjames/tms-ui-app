<template>
  <view class="container">
    <u-list @scrolltolower="scrolltolower">
      <view @click="bindInventory(item)" class="inventory-item" :class="item.status === '1' ? 'active': ''" v-for="(item, index) in indexList" :key="index">{{ item.name }}</view>
    </u-list>
    <u-button class="receive" text="完成任务" color="#214579" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      indexList: []
    };
  },
  onLoad() {
    this.loadmore()
  },
  methods: {
    // 物料盘点任务Item
    bindInventory(item) {
      console.log(item);
      uni.navigateTo({
        url: '/pages/inventoryTask/inventoryTask'
      })
    },
    scrolltolower() {
      this.loadmore()
    },
    loadmore() {
      for (let i = 0; i < 30; i++) {
        this.indexList.push({
          name: '原材料仓 01号库区 010101',
          id: `10${this.indexList.length}`,
          status: `${i % 2 === 0 ? 1 : 0}`
        })
      }
      console.log(this.indexList);
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
