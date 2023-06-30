<template>
  <view class="container">
    <u-gap height="80rpx"></u-gap>
    <view class="auth-header">
      <u--image :showLoading="true" mode="widthFix" :src="logoImg" width="400rpx"></u--image>
    </view>
    <view class="auth-box">
      <u-gap height="80rpx"></u-gap>
      <!-- 登录表单 -->
      <u--form labelPosition="left" :model="formData" ref="form">

        <u-form-item labelWidth="60" borderBottom ref="item-tenant">
          <u--input v-model="tenantId" prefixIconStyle="color:#cccccc" clearable placeholder="请填写租户名称"
                    prefixIcon="grid-fill" border="none" @blur="bindTenantId"></u--input>
        </u-form-item>

        <u-gap height="40rpx"></u-gap>

        <u-form-item labelWidth="60" borderBottom ref="item-mobile">
          <u--input v-model="formData.username" prefixIconStyle="color:#cccccc" clearable placeholder="请填写用户名"
            prefixIcon="account-fill" border="none"></u--input>
        </u-form-item>

        <u-gap height="40rpx"></u-gap>

        <u-form-item v-if="currentModeIndex === 0" labelWidth="60" borderBottom ref="item-password">
          <u-input :type="inputType" prefixIconStyle="color:#cccccc" maxlength="16" v-model="formData.password"
            prefixIcon="lock-fill" placeholder="请填写密码" border="none">
            <template slot="suffix">
              <u-icon v-if="inputType === 'password'" size="20" color="#cccccc" name="eye-fill"
                @click="inputType = 'text'"></u-icon>
              <u-icon v-if="inputType === 'text'" size="20" color="#cccccc" name="eye-off"
                @click="inputType = 'password'"></u-icon>
            </template>
          </u-input>
        </u-form-item>

        <u-form-item v-else label="验证码" prop="code" labelWidth="60" borderBottom>
          <u--input type="number" maxlength="4" v-model="formData.code" border="none" placeholder="请填写验证码"></u--input>
          <u-button slot="right" @tap="getCode" :text="codeTips" type="success" size="mini"
            :disabled="codeDisabled"></u-button>
          <u-code ref="uCode" @change="codeChange" seconds="60" @start="codeDisabled = true"
            @end="codeDisabled = false"></u-code>
        </u-form-item>

        <u-gap height="100rpx"></u-gap>

        <view class="btn-group">
          <u-button class="auth-btn" color="#214579" @click="handleSubmit">登 录</u-button>
        </view>
      </u--form>
    </view>
    <!-- 忘记密码 -->
    <view class="auth-footer">
      <u--text color="#214579" @click="bindForgot" align="center" text="忘记密码"></u--text>
    </view>
  </view>
</template>

<script>
  import {
    sendSmsCode
  } from '../../api/auth'

  export default {
    data() {
      return {
        tenantId: '', // 租户名称
        logoImg: require("../../static/images/icons/logo.png"),
        currentModeIndex: 0,
        loginModeList: ['密码登录', '验证码登录'],
        inputType: 'password',
        codeDisabled: false,
        codeTips: '',
        formData: {
          username: '',
          mobile: '',
          password: '',
          code: ''
        },
        rules: {
          // username 不能为空
          username: {
            type: 'string',
            required: true,
            message: '请填写用户名',
            trigger: ['blur', 'change']
          },
          // password 不能为空
          password: {
            type: 'string',
            required: true,
            message: '请填写密码',
            trigger: ['blur', 'change']
          },
          code: {
            type: 'integer',
            len: 4,
            required: true,
            message: '请填写4位验证码',
            trigger: ['blur', 'change']
          }
        }
      }
    },
    onLoad() {},
    onReady() {
      // 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      // 获取租户编号
      bindTenantId(value) {
        this.$store.dispatch('ObtainTenantId', value)
      },
      handleModeChange(index) {
        if (index !== this.currentModeIndex) {
          this.currentModeIndex = index
          this.$refs.form.clearValidate()
        }
      },
      codeChange(text) {
        this.codeTips = text
      },
      getCode() {
        const mobile = this.formData.mobile
        if (!mobile) {
          uni.$u.toast('请填写手机号')
        } else if (!uni.$u.test.mobile(mobile)) {
          uni.$u.toast('手机号格式不正确')
        } else if (this.$refs.uCode.canGetCode) {
          // 模拟向后端请求验证码
          uni.showLoading({
            title: '正在获取验证码'
          })

          //scene:1登陆获取验证码场景
          sendSmsCode({
            mobile: mobile,
            scene: 1
          }).then(res => {
            //console.log(res)
            uni.hideLoading()
            uni.$u.toast('验证码已发送')
            // 通知验证码组件内部开始倒计时
            this.$refs.uCode.start()
          })
        } else {
          uni.$u.toast('倒计时结束后再发送')
        }
      },
      handleSubmit() {
        this.$refs.form.validate().then(res => {
          this.mobileLogin(this.formData)
          // uni.login({
          //   provider: 'weixin',
          //   success: res => {
          //     let data = this.formData
          //     data.socialType = 34 //WECHAT_MINI_APP 先指定固定值
          //     data.socialCode = res.code
          //     data.socialState = Math.random() // 该参数没有实际意义暂时传随机数
          //     this.mobileLogin(data)
          //   },
          //   fail: res => {
          //     console.log(this.formData)
          //     this.mobileLogin(this.formData)
          //   }
          // })
        })
      },
      mobileLogin(data) {
        this.$store.dispatch('Login', {
          type: this.currentModeIndex,
          data: data
        }).then(res => {
          uni.$u.toast('登录成功')
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }, 300)
        })
      },
      // 忘记密码
      bindForgot() {
        uni.navigateTo({
          url: '/pages/forgot/forgot'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .auth-header {
    @include flex-center;
  }

  .auth-box {
    @include flex-center(column);

    .mode-section {
      width: 600rpx;

      .subsection {
        height: 60rpx;
      }
    }

    .btn-group {
      width: 600rpx;

      .auth-btn {
        height: 80rpx;
        font-size: 32rpx;
      }
    }
  }

  // 忘记密码
  .auth-footer {
    position: fixed;
    bottom: 80rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;
  }
</style>
