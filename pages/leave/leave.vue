<template>
  <view class="container">
    <view class="agent">
      <u--text color="#aaaaaa" text="请指定代理人"></u--text>
      <u-gap height="20rpx"></u-gap>
      <u--input class="agent-input" readonly color="#666666" placeholder="请指定代理人" shape="circle" prefixIcon="account-fill"
        clearable></u--input>
    </view>
    <u-index-list :index-list="indexList" activeColor="#0079fe" inactiveColor="#999999">
      <template v-for="(item, index) in itemArr">
        <!-- #ifdef APP-NVUE -->
        <u-index-anchor :text="indexList[index]"></u-index-anchor>
        <!-- #endif -->
        <u-index-item>
          <!-- #ifndef APP-NVUE -->
          <u-index-anchor :text="indexList[index]"></u-index-anchor>
          <!-- #endif -->
          <view class="list-cell" v-for="(cell, idx) in item" :key="idx">
            <u-avatar size="40" src="https://img.yzcdn.cn/vant/cat.jpeg"></u-avatar>
            <view class="list-cell-name">
              <u--text size="26rpx" color="#cccccc" :text="cell"></u--text>
              <u--text size="18rpx" color="#cccccc" text="Amy"></u--text>
            </view>
          </view>
        </u-index-item>
      </template>
    </u-index-list>
    <u-button class="cancel" color="#214579" shape="circle" text="取消休假"></u-button>
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
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 16rpx 30rpx;
  border-bottom: 1rpx solid #f2f2f2;
  overflow: hidden;
  color: #cccccc;
  background-color: #fff;

  &-name {
    margin-left: 30rpx;
  }

  &:last-child {
    margin-bottom: 200rpx;
  }
}

.cancel {
  position: fixed;
  bottom: 100rpx;
  width: 200rpx;
  left: 50%;
  transform: translateX(-50%);
}

.agent {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background-color: $custom-bg-color;
  z-index: 10;

  &-input {
    background-color: #FFFFFF;
  }
}
</style>
