<template>
  <view class="container">
    <u--text color="#aaaaaa" text="物料编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <u-cell class="coding-name" :border="false" isLink arrow-direction="down" @click="bindMaterial">
        <view class="title" slot="title">
          <text v-if="!materialDesc" class="placeholder">请选择或扫描物料编码</text>
          <text v-else>{{materialDesc}}</text>
        </view>
      </u-cell>
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view v-if="outboundList.length > 0">
      <u--text color="#aaaaaa" text="物料名称"></u--text>
      <u-gap height="20rpx"></u-gap>
      <u--text size="28rpx" color="#666666" :text="materialName"></u--text>
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
          <u-number-box v-model="item.qty" :min="0" :max="item.stockQty"></u-number-box>
        </view>
        <u-gap height="60rpx"></u-gap>
      </view>
      <u-button class="receive" text="出 库" color="#214579" shape="circle" @click="bindOutBound"></u-button>
    </view>
    <!--物料选择器 -->
    <u-picker :show="materialShow" :columns="materialColumns"
              :defaultIndex="materialIndex" keyName="name"
              confirmColor="#214579" @cancel="bindClose"
              @close="bindClose" @confirm="confirmMaterial"></u-picker>
  </view>
</template>

<script>
  import {getMaterialBaseData} from "@/api/warehouse";
  import {getStockPage, outOfStorage} from "@/api/stock";

  export default {
    data() {
      return {
        materialDesc: '',
        materialSpecs: '',
        materialName: '',
        materialShow: false,
        outboundList: [],
        materialIndex: [0], // 物料选择器索引
        materialColumns: [] // 物料选择器列
      };
    },
    onLoad() {
      this.materialColumns = [this.materialList || []]
    },
    computed: {
      materialList() {
        return this.$store.getters.materialList
      }
    },
    methods: {
      // 获取物料基础数据
      getMaterialBaseData(id) {
        getMaterialBaseData({id}).then(res => {
          const {data} = res
          this.materialDesc = `${data.code}`
          this.materialName = data.name
          this.materialSpecs = data.specs
        })
      },
      // 扫码库位编码
      bindScan() {
        uni.scanCode({
          success: (res) => {
            const {result} = res
            const id = parseInt(result)
            this.getMaterialBaseData(id)
            this.getStockPage(id)
          }
        });
      },
      // 打开物料选择
      bindMaterial() {
        this.materialShow = true
      },
      // 确认物料
      confirmMaterial(e) {
        const [item] = e.value
        this.getMaterialBaseData(item.id)
        this.getStockPage(item.id)
        this.materialShow = false
      },
      // 关闭选择器
      bindClose() {
        this.materialShow = false
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
            qty: 0
          })) || [];
        })
      },
      // 出库
      bindOutBound() {
        // 校验出库数量
        const isPass = this.outboundList.every(item => item.qty > 0 && item.qty <= item.stockQty)
        if (!isPass) {
          uni.$u.toast('出库数量不正确')
          return
        }
        outOfStorage(this.outboundList).then(res => {
          uni.$u.toast('出库成功')
          // setTimeout(() => {
          //   uni.navigateBack()
          // }, 1000)
          // 刷新当前页面
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
        color: $custom-content-color;
        font-size: 24rpx;
      }
    }

    .placeholder {
      color: #aaaaaa;
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
