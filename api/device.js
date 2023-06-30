//请求工具参考https://ext.dcloud.net.cn/plugin?id=392
const { http } = uni.$u

// 获取设备信息
export const getDeviceDetail = params => http.get('/config/device/detail', { params })
// 获取设备及其父集精简列表
export const getDeviceSimpleList = params => http.get('/config/device/list-with-parent-simple', params)
// 获得公共任务详情
export const getCommonTaskDetail = taskId => http.get('/operations/common/task/detail?taskId=' + taskId)
// 忽略公共任务
export const ignoreCommonTask = data => http.post('/operations/common/task/ignore', data)
// 领取公共任务
export const receiveCommonTask = data => http.post('/operations/common/task/pick', data)
// 我的任务分页
export const getMyTaskPage = params => http.get('/operations/task/page', { params })
// 入库
export const putInStorage = data => http.post('/warehouse/stock/inbound', data)
// 出库
export const outOfStorage = data => http.post('/warehouse/stock/batch/outbound', data)
// 库存列表
export const getStockPage = params => http.get('/warehouse/stock/list', params)
