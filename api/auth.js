//请求工具参考https://ext.dcloud.net.cn/plugin?id=392
const { http } = uni.$u

//使用手机 + 密码登录
export const passwordLogin = data => http.post('/member/auth/login', data)
//发送手机验证码
export const sendSmsCode = data => http.post('/member/auth/send-sms-code', data)
//使用手机 + 验证码登录
export const smsLogin = data => http.post('/member/auth/sms-login', data)
//微信小程序的一键登录
export const weixinMiniAppLogin = data => http.post('/member/auth/weixin-mini-app-login', data)
// 账号密码登录
export const authLogin = data => http.post('/system/auth/login', data)
// 退出登录
export const logout = data => http.post('/system/auth/logout', data)
//刷新令牌
export const authRefreshToken = refreshToken => http.post(`/system/auth/refresh-token?refreshToken=${refreshToken}`)
// 获得租户编号
export const getTenantCode = name => http.get('/system/tenant/get-id-by-name?name=' + name)
// 上传附件
export const uploadFile = params => http.upload('/operations/task/file/upload', {
  filePath: params.filePath,
  name: 'file',
  header: {'Content-Type': 'multipart/form-data'}
})
