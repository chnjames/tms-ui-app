<template>
  <view class="container">
    <u--text color="#aaaaaa" text="物料编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <u--input class="coding-name" v-model="materialDesc" readonly border="bottom" color="#214579" fontSize="28rpx" placeholder="请扫描库位编码"></u--input>
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view v-if="outboundList.length > 0">
      <u--text color="#aaaaaa" text="物料规格"></u--text>
      <u-gap height="20rpx"></u-gap>
      <u--text size="28rpx" color="#666666" :text="materialSpecs"></u--text>
      <u-gap height="40rpx"></u-gap>
      <u--text color="#aaaaaa" text="物料位置"></u--text>
      <u-gap height="20rpx"></u-gap>
      <view v-for="item in outboundList" :key="item.id">
        <view class="layout">
          <u--text size="28rpx" color="#666666" :text="item.storeDesc"></u--text>
          <u--text size="28rpx" color="#666666" align="right" :text="'库存：' + item.stockQty"></u--text>
        </view>
        <u-gap height="40rpx"></u-gap>
        <view class="layout">
          <u--text color="#aaaaaa" text="出库数量"></u--text>
          <u-number-box v-model="item.qty" :min="1" :max="item.stockQty"></u-number-box>
        </view>
        <u-gap height="60rpx"></u-gap>
      </view>
      <u-button class="receive" text="出 库" color="#214579" shape="circle" @click="bindOutBound"></u-button>
    </view>
  </view>
</template>

<script>
  import {getMaterialBaseData} from "../../api/warehouse";
  import {getStockPage, outOfStorage} from "../../api/stock";

  export default {
    data() {
      return {
        materialDesc: '',
        materialSpecs: '',
        outboundList: []
      };
    },
    methods: {
      // 获取物料基础数据
      getMaterialBaseData(id) {
        getMaterialBaseData({id}).then(res => {
          const {data} = res
          this.materialDesc = `${data.code}/${data.category} ${data.name}`
          this.materialSpecs = data.specs
        }).catch(err => {
          uni.$u.toast(err.msg)
        })
      },
      // 扫码库位编码
      bindScan() {
        this.getMaterialBaseData(3)
        this.getStockPage(3)
        uni.scanCode({
          success: (res) => {
            console.log(res)
          }
        });
      },
      // 获取库存列表
      getStockPage(materialId) {
        getStockPage({materialId}).then(res => {
          const {data} = res
          this.outboundList = data?.map(item => ({
            materialId: item.materialId,
            storeDesc: `${item.storeName} ${item.storeAreaName} ${item.location}`,
            storeAreaId: item.storeAreaId,
            location: item.location,
            stockQty: item.qty,
            qty: 1
          })) || [];
        }).catch(err => {
          uni.$u.toast(err.msg)
        })
      },
      // 出库
      bindOutBound() {
        outOfStorage(this.outboundList).then(res => {
          uni.$u.toast('出库成功')
          setTimeout(() => {
            uni.navigateBack()
          }, 1000)
        }).catch(err => {
          uni.$u.toast(err.msg)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    padding: 20rpx;

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

    .layout {
      @include flex-space-between;
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
