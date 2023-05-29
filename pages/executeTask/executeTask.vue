<template>
  <view class="container">
    <u--text size="28rpx" color="#214579" text="M38574359346 / 汽油加注机"></u--text>
    <u-gap height="20rpx"></u-gap>
    <u--text size="28rpx" color="#214579" text="设备点检"></u--text>
    <u-gap height="40rpx"></u-gap>
    <!-- 执行任务项 -->
    <view class="question">
      <u--image :showLoading="true" width="100%" v-if="currentQuestion.image" :src="currentQuestion.image"></u--image>
      <u-gap height="40rpx"></u-gap>
      <u--text color="#214579" text="任务名称"></u--text>
      <u-gap height="20rpx"></u-gap>
      <u--text size="28rpx" color="#666666" :text="currentQuestion.content"></u--text>
      <u-gap height="200rpx"></u-gap>
      <u-row justify="space-around">
        <u-col span="3" justify="center">
          <u-button v-show="currentQuestion.userAnswer !== true" icon="close"
            :type="currentQuestion.userAnswer === false ? 'warning' : 'info'"
            :iconColor="currentQuestion.userAnswer === false ? '#FFFFFF' : '#909399'" shape="circle"
            @click="chooseAnswer(false)"></u-button>
        </u-col>
        <u-col span="3" justify="center">
          <u-button color="#214579" text="提 交" shape="circle" :disabled="hasUnansweredQuestions"
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
export default {
  data() {
    return {
      questions: [
        {
          id: 1,
          content: '用测温枪测试电机表壳的温度。',
          image: 'https://img.yzcdn.cn/vant/cat.jpeg',
          userAnswer: null
        }, {
          id: 2,
          content: '用飞机枪测试电机表壳的温度。',
          image: 'https://img.yzcdn.cn/vant/cat.jpeg',
          userAnswer: null
        }, {
          id: 3,
          content: '问题大炮用测温枪测试电机表壳的温度。2',
          image: 'https://img.yzcdn.cn/vant/cat.jpeg',
          userAnswer: null
        }, {
          id: 4,
          content: '用测火箭温枪测试电机表壳的温度。',
          image: 'https://img.yzcdn.cn/vant/cat.jpeg',
          userAnswer: null
        },
      ],
      currentIndex: 0
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex];
    },
    hasUnansweredQuestions() {
      return this.questions.some(question => question.userAnswer === null);
    }
  },
  methods: {
    chooseAnswer(answer) {
      this.currentQuestion.userAnswer = answer;
      if (answer) {
        this.nextQuestion();
      } else {
        uni.navigateTo({
          url: '/pages/deviceTask/deviceTask'
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
    submitAnswers() {
      const numCorrect = this.questions.filter(question => question.userAnswer === question.answer).length;
      alert(`您的分数是 ${numCorrect}/${this.questions.length}`);
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
