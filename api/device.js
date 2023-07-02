//请求工具参考https://ext.dcloud.net.cn/plugin?id=392
const { http } = uni.$u

// 获取设备信息
export const getDeviceDetail = params => http.get('/config/device/detail', { params })
// 获取设备及其父集精简列表
export const getDeviceSimpleList = params => http.get('/config/device/list-with-parent-simple', params)
