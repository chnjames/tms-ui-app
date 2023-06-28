<template>
  <view class="container">
    <u--text color="#333333" bold :text="taskDetail.projectName"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text color="#666666" size="14" :text="taskDetail.taskName"></u--text>
    <u-read-more toggle closeText="展开" color="#214579" textIndent="0" :shadowStyle="shadowStyle" :showHeight="200">
      <u--text color="#666666" size="14" :text="taskDetail.taskName"></u--text>
    </u-read-more>
    <u-gap height="160rpx"></u-gap>
    <u-cell-group class="user" :border="false">
      <u-cell icon="share-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text>{{taskDetail.followersStr}}</text> 关注
        </view>
      </u-cell>
      <u-cell icon="calendar-fill" :border="false" iconStyle="color: #aaaaaa;">
        <view slot="title" class="title">
          <text>{{taskDetail.date}}</text> 前截止
        </view>
      </u-cell>
    </u-cell-group>
    <u-button class="receive" text="领取任务" color="#214579" shape="circle" @click="bindReceive"></u-button>
  </view>
</template>

<script>
import { getCommonTaskDetail, receiveCommonTask } from '../../api/task'
import {getProjectSimpleList} from '../../api/project'
import { mapGetters } from 'vuex'
import {timestampToTime} from '../../utils/utils'
export default {
  data() {
    return {
      taskId: '',
      projectList: [],
      taskDetail: {},
      shadowStyle: {
        // #ifndef APP-NVUE
        backgroundImage: "linear-gradient(-180deg, rgba(245, 245, 245, 0) 0%, #F5F5F5 80%)",
        // #endif
        // #ifdef APP-NVUE
        // nvue上不支持设置复杂的backgroundImage属性
        backgroundImage: "linear-gradient(to top, #F5F5F5, rgba(245, 245, 245, 0.5))",
        // #endif
        paddingTop: "100px",
        marginTop: "-100px"
      }
    };
  },
  computed: {
    ...mapGetters(['userList'])
  },
  async created() {
    await this.$store.dispatch('GetUserList')
    const {taskId} = this.$route.query;
    await this.getProjectSimpleList();
    this.taskId = taskId;
    this.getCommonTaskDetail(taskId);
  },
  methods: {
    // 获取任务详情
    getCommonTaskDetail(taskId) {
      getCommonTaskDetail(taskId).then(res => {
        const taskDetail = res.data || {};
        taskDetail.date = timestampToTime(taskDetail.endTime, 'yyyy-MM-dd');
        taskDetail.followersStr = taskDetail.followers.map(item => {
          return this.userList.find(user => user.id === item).nickname
        }).join('、');
        taskDetail.projectName = this.projectList.find(item => item.id === taskDetail.projectId)?.name || '';
        console.log(taskDetail)
        this.taskDetail = taskDetail;
      })
    },
    // 获取项目列表
    getProjectSimpleList() {
      getProjectSimpleList().then(res => {
        this.projectList = res.data || [];
      })
    },
    // 领取任务
    bindReceive() {
      console.log('领取任务');
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;

  .user {
    .title {
      color: $custom-text-assist-color;
      font-size: 24rpx;

      text {
        margin-right: 20rpx;
      }
    }
  }

  .receive {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 200rpx;
    width: 200rpx;
  }
}

/deep/ .u-cell__body {
  padding: 10rpx 0;
}
</style>
