<template>
  <view class="container">
    <view class="inventory">原材料仓 01号库位 01排23层03列</view>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料清单"></u--text>
    <view class="card" v-for="(item, index) in inventoryList" :key="index">
      <view class="layout">
        <u--text :text="item.name"></u--text>
        <u-number-box v-model="item.quantity" :min="1"></u-number-box>
      </view>
      <u--text color="#aaaaaa" text="物料规格"></u--text>
      <u--text :text="item.spec"></u--text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inventoryList: [{
        name: 'M38574359346/汽油加注机滤芯',
        quantity: 6,
        spec: '三相四线制 380V鼓式电机'
      }, {
        name: 'M38574359346/汽油加注机滤芯',
        quantity: 6,
        spec: '三相四线制 380V鼓式电机'
      }]
    };
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  .inventory {
    margin: 12rpx 0;
    border-radius: 30rpx;
    padding: 16rpx;
    color: $custom-text-sub-color;
    background-color: #e7e6e6;
    font-size: 26rpx;
  }
}
</style>
