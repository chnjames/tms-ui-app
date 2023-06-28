//请求工具参考https://ext.dcloud.net.cn/plugin?id=392
const { http } = uni.$u

//获取用户信息
export const getUserInfo = params => http.get('/system/auth/get-permission-info', params)
//修改用户头像
export const updateAvatar = filePath =>
  http.upload('/member/user/update-avatar', {
    name: 'avatarFile',
    fileType: 'image',
    filePath: filePath
  })
//修改用户昵称
export const updateNickname = params => http.put('/member/user/update-nickname', {}, { params })
// 用户休假设置
export const updateVacation = data => http.post('/system/user/profile/vacation', data)
// 取消休假
export const cancelVacation = data => http.post('/system/user/profile/vacation/cancel', data)
// 获取用户信息
export const getUserProfile = params => http.get('/system/user/profile/get', params)
// 用户列表
export const getUserList = params => http.get('/system/user/list-all-simple', params)
