<template>
  <view class="container">
    <u--text size="28rpx" color="#214579" :text="taskInfo.projectName"></u--text>
    <u-gap height="20rpx"></u-gap>
    <!-- 执行任务项 -->
    <view class="question">
      <u--text size="28rpx" color="#214579" :text="currentQuestion.name"></u--text>
      <u-gap height="40rpx"></u-gap>
      <u--image :showLoading="true" width="100%" :src="currentQuestion.url"></u--image>
      <u-gap height="40rpx"></u-gap>
      <u--text color="#214579" text="任务名称"></u--text>
      <u-gap height="20rpx"></u-gap>
      <u--text size="28rpx" color="#666666" :text="currentQuestion.task"></u--text>
      <u-gap height="200rpx"></u-gap>
      <u-row justify="space-around">
        <u-col span="3" justify="center">
          <u-button v-show="currentQuestion.userAnswer !== true" icon="close"
            :type="currentQuestion.userAnswer === false ? 'warning' : 'info'"
            :iconColor="currentQuestion.userAnswer === false ? '#FFFFFF' : '#909399'" shape="circle"
            @click="chooseAnswer(false)"></u-button>
        </u-col>
        <u-col span="3" justify="center">
          <u-button color="#214579" text="拍照提交" shape="circle" v-if="!hasUnansweredQuestions"
            @click="submitAnswers"></u-button>
        </u-col>
        <u-col span="3" justify="center">
          <u-button v-show="currentQuestion.userAnswer !== false" icon="checkmark"
            :type="currentQuestion.userAnswer ? 'success' : 'info'"
            :iconColor="currentQuestion.userAnswer ? '#FFFFFF' : '#909399'" shape="circle"
            @click="chooseAnswer(true)"></u-button>
        </u-col>
      </u-row>
      <u-gap height="200rpx"></u-gap>
      <view class="fixed">
        <u-row justify="space-around">
          <u-col span="3" justify="center">
            <u--text :show="currentIndex > 0" block align="center" color="#214579" text="上一项"
              @click="previousQuestion"></u--text>
          </u-col>
          <u-col span="3" justify="center">
            <u--text block align="center" type="info" :text="`${currentIndex + 1} / ${questions.length}`"></u--text>
          </u-col>
          <u-col span="3" justify="center">
            <u--text :show="currentIndex < questions.length - 1" block align="center" color="#214579" text="下一项"
              @click="nextQuestion"></u--text>
          </u-col>
        </u-row>
      </view>
    </view>
  </view>
</template>

<script>
import {getTaskDetail, getTemplate, uploadTaskFile, missionTask} from "@/api/task";
export default {
  data() {
    return {
      taskId: '',
      deviceId: '',
      templateId: '',
      projectId: '',
      taskInfo: {},
      questions: [],
      currentIndex: 0
    };
  },
  computed: {
    projectList() {
      return this.$store.getters.projectList
    },
    currentQuestion() {
      return this.questions[this.currentIndex] || {};
    },
    hasUnansweredQuestions() {
      return this.questions.some(question => question.userAnswer === null);
    }
  },
  onLoad(options) {
    const {taskId, deviceId, templateId, projectId} = options;
    this.taskId = taskId;
    this.deviceId = deviceId;
    this.templateId = templateId;
    this.projectId = projectId;
    this.getTaskDetail(this.taskId);
  },
  methods: {
    // 获取任务详情
    getTaskDetail(taskId) {
      getTaskDetail({taskId}).then(res => {
        const {data} = res;
        data.projectName = this.projectList.find(item => item.id === data.projectId)?.name || ''
        this.getTemplateDetail(data.extra.templateId)
        this.taskInfo = data;
      })
    },
    // 模板详情
    getTemplateDetail(id) {
      getTemplate({id}).then(res => {
        const {data} = res;
        const formattedQuestions = data.extras;
        this.questions = formattedQuestions.reduce((questions, item) => {
          const { name, url, tasks } = item;
          const formattedTasks = tasks.map(task => ({name, task, url, userAnswer: null}));
          return questions.concat(formattedTasks);
        }, []);
      })
    },
    chooseAnswer(answer) {
      this.currentQuestion.userAnswer = answer;
      if (answer) {
        this.nextQuestion();
      } else {
        uni.navigateTo({
          url: `/pages/quickDeviceTask/quickDeviceTask?deviceId=${this.deviceId}&projectId=${this.projectId}`
        });
      }
    },
    previousQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
      }
    },
    // 提交
    submitAnswers() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          this.uploadTaskFile(res.tempFiles[0])
        }
      });
    },
    // 上传附件
    uploadTaskFile(file) {
      uni.showLoading({
        title: '上传中'
      });
      uploadTaskFile({filePath: file.path, formData: {taskId: this.taskId}}).then(res => {
        this.bindReceive();
      }).finally(() => {
        uni.hideLoading();
      })
    },
    // 完成任务
    bindReceive() {
      missionTask({taskId: this.taskId}).then(() => {
        uni.$u.toast('任务完成')
        setTimeout(() => {
          uni.navigateBack({
            delta: 2
          });
        }, 300)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;

  .fixed {
    position: fixed;
    bottom: calc(var(--window-bottom) + 50rpx);
    left: 0;
    right: 0;
  }
}
</style>
