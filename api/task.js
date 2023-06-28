//请求工具参考https://ext.dcloud.net.cn/plugin?id=392
const { http } = uni.$u

// 获得公共任务分页
export const getCommonTaskPage = params => http.get('/operations/common/task/page', params)
// 获得公共任务详情
export const getCommonTaskDetail = params => http.get('/operations/common/task/detail', params)
// 忽略公共任务
export const ignoreCommonTask = data => http.post('/operations/common/task/ignore', data)
// 领取公共任务
export const receiveCommonTask = data => http.post('/operations/common/task/pick', data)
