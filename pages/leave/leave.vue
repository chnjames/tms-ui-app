<template>
  <view class="container">
    <view class="agent">
      <u--text color="#aaaaaa" text="请指定代理人"></u--text>
      <u-gap height="20rpx"></u-gap>
      <u--input class="agent-input" readonly v-model="proxyUserName" color="#666666" placeholder="请指定代理人"
                shape="circle" prefixIcon="account-fill"
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
          <view class="list-cell" v-for="(cell, idx) in item" :key="idx" @click="bindUser(cell)">
            <u-avatar size="40" src="https://img.yzcdn.cn/vant/cat.jpeg"></u-avatar>
            <view class="list-cell-name">
              <u--text size="26rpx" color="#cccccc" :text="cell.nickname"></u--text>
              <!--<u&#45;&#45;text size="18rpx" color="#cccccc" text="Amy"></u&#45;&#45;text>-->
            </view>
          </view>
        </u-index-item>
      </template>
    </u-index-list>
    <u-button class="cancel" color="#214579" shape="circle" text="取消休假" @click="bindCancelProxy"></u-button>
  </view>
</template>

<script>
import {updateVacation, cancelVacation} from "@/api/user";
import {getGroupByPinyin} from "@/utils/utils";

export default {
  data() {
    return {
      indexList: [],
      itemArr: [],
      proxyUserName: ''
    };
  },
  computed: {
    userList() {
      return this.$store.getters.userList
    }
  },
  onLoad(options) {
    const {proxyUserId} = options;
    if (proxyUserId) {
      this.proxyUserName = this.userList.find(item => item.id === parseInt(proxyUserId)).nickname;
    }
    const itemArr = getGroupByPinyin(this.userList, 'nickname').map(item => item.value);
    const indexList = getGroupByPinyin(this.userList, 'nickname').map(item => item.name);
    this.itemArr = itemArr;
    this.indexList = indexList;
  },
  methods: {
    // 选择代理人
    bindUser(item) {
      this.proxyUserName = item.nickname;
      updateVacation({proxyUserId: item.id}).then(res => {
        uni.$u.toast('代理成功')
        this.$store.dispatch('ObtainUserInfo')
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      }).catch(err => {
        console.log(err)
      })
    },
    // 取消代理
    bindCancelProxy() {
      cancelVacation().then(res => {
        // 成功提醒
        uni.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 2000
        })
        this.$store.dispatch('ObtainUserInfo')
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      }).catch(err => {
        console.log(err)
      })
    }
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
}

.cancel {
  position: fixed;
  bottom: 100rpx;
  width: 200rpx;
  left: 50%;
  z-index: 10;
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
