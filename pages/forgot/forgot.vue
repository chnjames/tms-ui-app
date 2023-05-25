<template>
  <view class="container">
    <u-gap height="120rpx"></u-gap>
    <view class="unp-header">
      <u--image :showLoading="true" mode="widthFix" :src="logoImg" width="160px"></u--image>
    </view>

    <view class="unp-box">
      <u--form class="unp-form" labelPosition="left" :model="formData" :rules="rules" ref="form">
        <u-form-item prop="username" borderBottom ref="item-username">
          <u-input type="text" maxlength="20" v-model="formData.username" prefixIconStyle="color:#cccccc" prefixIcon="phone-fill" clearable placeholder="输入手机号" border="none" @change="handleUsernameChange"></u-input>
        </u-form-item>

        <u-gap height="40rpx"></u-gap>

        <u-form-item prop="code" labelWidth="80" borderBottom>
          <u--input type="number" maxlength="6" v-model="formData.code" prefixIconStyle="color:#cccccc" prefixIcon="more-circle-fill" border="none" placeholder="短信验证码"></u--input>
          <u-button slot="right" @tap="getCode" :text="tips" type="success" size="mini" :disabled="codeDisabled"></u-button>
          <u-code ref="uCode" @change="codeChange" seconds="60" @start="codeDisabled = true" @end="codeDisabled = false"></u-code>
        </u-form-item>

        <u-gap height="40rpx"></u-gap>

        <u-form-item prop="password" borderBottom ref="item-password">
          <u-input :type="inputType" maxlength="20" v-model="formData.password" prefixIconStyle="color:#cccccc" prefixIcon="lock-fill" placeholder="输入新的登录密码" border="none" @change="handlePasswordChange">
            <template slot="suffix">
              <u-icon v-if="inputType === 'password'" size="20" color="#cccccc" name="eye-fill" @click="inputType = 'text'"></u-icon>
              <u-icon v-if="inputType === 'text'" size="20" color="#cccccc" name="eye-off" @click="inputType = 'password'"></u-icon>
            </template>
          </u-input>
        </u-form-item>

        <u-gap height="100rpx"></u-gap>

        <u-button class="auth-btn" color="#214579" @click="handleSubmit">确 定</u-button>
      </u--form>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      logoImg: require("../../static/images/icons/logo.png"),
      codeDisabled: false,
      tips: '',
      inputType: 'password',
      formData: {
        username: '',
        code: '',
        password: ''
      },
      rules: {
        username: {
          type: 'string',
          max: 20,
          required: true,
          message: '请输入您的账号',
          trigger: ['blur', 'change']
        },
        code: {
          type: 'number',
          max: 6,
          required: true,
          message: '请输入验证码',
          trigger: ['blur', 'change']
        },
        password: {
          type: 'string',
          max: 20,
          required: true,
          message: '请输入您的新密码',
          trigger: ['blur', 'change']
        }
      }
    }
  },
  onLoad() {},
  methods: {
    handleUsernameChange(e) {
      let str = uni.$u.trim(e, 'all')
      this.$nextTick(() => {
        this.formData.username = str
      })
    },
    handlePasswordChange(e) {
      let str = uni.$u.trim(e, 'all')
      this.$nextTick(() => {
        this.formData.password = str
      })
    },
    codeChange(text) {
      this.tips = text
    },
    getCode() {
      if (this.$refs.uCode.canGetCode) {
        // 模拟向后端请求验证码
        uni.showLoading({
          title: '正在获取验证码'
        })
        setTimeout(() => {
          uni.hideLoading()
          // 这里此提示会被this.start()方法中的提示覆盖
          uni.$u.toast('验证码已发送')
          // 通知验证码组件内部开始倒计时
          this.$refs.uCode.start()
        }, 2000)
      } else {
        uni.$u.toast('倒计时结束后再发送')
      }
    },
    handleSubmit() {
      this.$refs.form
        .validate()
        .then(res => {
          uni.$u.toast('点击了重置密码')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.unp-header {
  @include flex-center;
}

.unp-box {
  @include flex-center(column);
  .unp-form {
    width: 560rpx;
  }
}
</style>
