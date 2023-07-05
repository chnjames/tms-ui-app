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
    <!--库位选择器-->
    <u-picker :show="materialShow" ref="materialRef" keyName="name" :columns="materialColumns" confirmColor="#214579" @confirm="confirmMaterial" @cancel="bindClose"
              @close="bindClose" @change="bindMaterialChange"></u-picker>
  </view>
</template>

<script>
  import {getMaterialBaseData} from "../../api/warehouse";
  import {getStockPage, outOfStorage, getStockList} from "../../api/stock";
  import {handleTree} from "../../utils/tree";

  export default {
    data() {
      return {
        materialDesc: '',
        materialSpecs: '',
        materialShow: false,
        outboundList: [],
        materialArr: [],
        materialIndex: [0, 0, 0],
        materialColumns: [[],[],[]],
      };
    },
    onLoad() {
      this.getStockList()
    },
    methods: {
      // 获取所有库位及其父集列表
      getStockList() {
        getStockList().then(res => {
          this.materialArr = handleTree(res.data)
          this.materialArr.forEach((item) => {
            this.materialColumns[0].push({ ...item });
          });
          if (this.materialArr[0]?.children?.length > 0) {
            this.materialArr[0].children.forEach((item) => {
              this.materialColumns[1].push({ ...item });
            });
            if (this.materialArr[0].children[0]?.children?.length > 0) {
              this.materialArr[0].children[0].children.forEach((item) => {
                this.materialColumns[2].push({ ...item });
              });
            } else {
              this.materialColumns[2] = [];
            }
          } else {
            this.materialColumns[1] = [];
            this.materialColumns[2] = [];
          }
        })
      },
      // 获取物料基础数据
      getMaterialBaseData(id) {
        getMaterialBaseData({id}).then(res => {
          const {data} = res
          this.materialDesc = `${data.code}/${data.category} ${data.name}`
          this.materialSpecs = data.specs
        })
      },
      // 扫码库位编码
      bindScan() {
        this.getMaterialBaseData(13)
        this.getStockPage(13)
        uni.scanCode({
          success: (res) => {
            console.log(res)
          }
        });
      },
      // 打开物料选择
      bindMaterial() {
        this.materialShow = true
      },
      // 改变物料
      bindMaterialChange(e) {
        console.log(e)
        const {columnIndex, index, picker = this.$refs.materialRef} = e
        console.log(columnIndex, index, picker)
        // 根据列的索引值，判断当前改变的是哪一列，然后改变对应的列数据
        if (columnIndex === 0) {
          this.materialColumns[1] = this.materialArr[index]?.children || []
          picker.setColumnValues(1, this.materialColumns[1])
          this.materialColumns[2] = this.materialArr[index]?.children?.[0]?.children || []
          picker.setColumnValues(2, this.materialColumns[2])
        } else if (columnIndex === 1) {
          this.materialColumns[2] = this.materialArr[this.materialIndex[0]]?.children[index]?.children || []
          picker.setColumnValues(2, this.materialColumns[2])
        }
      },
      // 确认物料
      confirmMaterial(e) {
        const [arr1, arr2, arr3] = e.value
        console.log(e.value)
        if (!arr1?.id || !arr2?.id || !arr3?.id) {
          uni.$u.toast('请选择设备')
          return
        }
        // this.taskInfo.deviceName = `${arr3.name}`
        // this.taskInfo.deviceId = arr3.id
        this.getMaterialBaseData(arr3.id)
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
            qty: 1
          })) || [];
        })
      },
      // 出库
      bindOutBound() {
        outOfStorage(this.outboundList).then(res => {
          uni.$u.toast('出库成功')
          setTimeout(() => {
            uni.navigateBack()
          }, 1000)
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
