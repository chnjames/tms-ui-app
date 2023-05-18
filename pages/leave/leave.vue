<template>
  <view>
    <view>请指定代理人</view>
    <u--input placeholder="前置图标" prefixIcon="search" clearable></u--input>
    <!--搜索栏-->
    <u-sticky style="top: 0" offset-top="0">
      <view class="search-wrap">
        <u-search placeholder="搜索" disabled height="32" :show-action="false" @click="handleSearchClick"></u-search>
      </view>
    </u-sticky>
    <u-index-list :index-list="indexList">
      <template v-for="(item, index) in itemArr">
        <!-- #ifdef APP-NVUE -->
        <u-index-anchor :text="indexList[index]"></u-index-anchor>
        <!-- #endif -->
        <u-index-item>
          <!-- #ifndef APP-NVUE -->
          <u-index-anchor :text="indexList[index]"></u-index-anchor>
          <!-- #endif -->
          <view class="list-cell" v-for="(cell, idx) in item" :key="idx">
            {{cell}}
          </view>
        </u-index-item>
      </template>
    </u-index-list>
    <u-button class="cancel" type="primary" shape="circle" text="取消休假"></u-button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        indexList: ["A", "B", "C"],
        itemArr: [
          ['列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1',
            '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2',
            '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3'
          ],
          ['列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1',
            '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2',
            '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3'
          ],
          ['列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1',
            '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2',
            '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3', '列表A1', '列表A2', '列表A3'
          ]
        ]
      };
    },
    methods: {
      handleSearchClick(e) {
        uni.$u.route('/pages/search/search')
      },
    }
  }
</script>

<style lang="scss" scoped>
  .list-cell {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 10px 24rpx;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
  }

  .search-wrap {
    background: $custom-bg-color;
    padding: 20rpx;
  }

  .cancel {
    position: fixed;
    bottom: 100rpx;
    width: 200rpx;
    left: 50%;
    transform: translateX(-50%);
  }
</style>