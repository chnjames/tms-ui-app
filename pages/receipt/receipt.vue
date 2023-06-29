<template>
  <view class="container">
    <u--text color="#aaaaaa" text="库位编码"></u--text>
    <u-gap height="coding"></u-gap>
    <view class="coding">
      <u-cell class="coding-name" :border="false" isLink arrow-direction="down" @click="bindCoding">
        <view class="title" slot="title">
          <text>{{ pnCode }}</text>
        </view>
      </u-cell>
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="80rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料编码"></u--text>
    <u-gap height="20rpx"></u-gap>
    <view class="coding">
      <!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
      <!-- #ifndef APP-NVUE -->
      <u-input readonly class="coding-name" color="#214579" fontSize="28rpx" placeholder="请扫描物料条码"
               border="bottom"
               v-model="materialBaseInfo.code" @change="bindMaterial">
        <!-- #endif -->
        <!-- #ifdef APP-NVUE -->
        <u--input readonly class="coding-name" color="#214579" fontSize="28rpx" placeholder="请扫描物料条码"
                  border="bottom" v-model="materialBaseInfo.code"
                  @change="bindMaterial">
          <!-- #endif -->
          <template slot="suffix">
            <u-icon name="search" color="#214579" size="24"></u-icon>
          </template>
          <!-- #ifndef APP-NVUE -->
      </u-input>
      <!-- #endif -->
      <!-- #ifdef APP-NVUE -->
      </u--input>
      <!-- #endif -->
      <u-icon name="scan" color="#214579" size="36" @click="bindScan"></u-icon>
    </view>
    <u-gap height="40rpx"></u-gap>
    <view class="quantity">
      <u--text color="#aaaaaa" text="物料数量"></u--text>
      <u-number-box v-model="materialBaseInfo.quantity" :min="1" @change="bindQuantity"></u-number-box>
    </view>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料名称"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#666666" :text="materialBaseInfo.name"></u--text>
    <u-gap height="40rpx"></u-gap>
    <u--text color="#aaaaaa" text="物料规格"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#666666" :text="materialBaseInfo.specs"></u--text>
    <u-button class="receive" text="确 定" color="#214579" shape="circle" @click="bindInStorage"></u-button>
  </view>
</template>

<script>
import {getStockList, putInStorage} from '../../api/stock'
import {getMaterialBaseData} from '../../api/warehouse'

export default {
  data() {
    return {
      quantity: 1,
      materialCode: '',
      treeData: [],
      inboundInfo: {
        materialId: '',
        storeAreaId: '', // 库区ID 对应parentId
        location: '', // 库位码
        qty: ''
      },
      // 物料基础数据
      materialBaseInfo: {
        code: '',
        id: '',
        name: '',
        specs: '',
        quantity: 1
      }
    };
  },
  created() {
    this.getStockList()
    this.getMaterialBaseData()
  },
  methods: {
    // 获取所有库位及其父集列表
    getStockList() {
      getStockList().then(res => {
        console.log(res)
      })
    },
    // 获取物料基础数据
    getMaterialBaseData() {
      getMaterialBaseData({id: 3}).then(res => {
        console.log(res)
        this.materialBaseInfo = res.data
        this.inboundInfo = {
          materialId: 3,
          storeAreaId: 17,
          location: '1-1-1',
          qty: 10
        }
      })
    },
    // 扫码
    bindScan() {
      uni.scanCode({
        success: (res) => {
          console.log(res)
        }
      });
    },
    // 入库
    bindInStorage() {
      putInStorage(this.inboundInfo).then(res => {
        uni.$u.toast('入库成功')
        // 返回上一页
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      }).catch(err => {
        uni.$u.toast(err.msg)
      })
    },
    // 库位编码
    bindCoding(e) {
      this.PNShow = true
      console.log('当前值为: ' + e)
    },
    // 物料数量
    bindQuantity(e) {
      console.log('当前值为: ' + e.value)
    },
    // 物料编码
    bindMaterial(e) {
      console.log('当前值为: ' + e)
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  .quantity,
  .coding {
    @include flex-space-between;
  }
}

.coding-name {
  flex: 1;
  background-color: #ffffff;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.receive {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 200rpx;
  width: 200rpx;
}
</style>
