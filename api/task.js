//请求工具参考https://ext.dcloud.net.cn/plugin?id=392
const { http } = uni.$u

// 获得公共任务分页
export const getCommonTaskPage = params => http.get('/operations/common/task/page', {params})
// 获得公共任务详情
export const getCommonTaskDetail = params => http.get('/operations/common/task/detail', {params})
// 忽略公共任务
export const ignoreCommonTask = data => http.post('/operations/common/task/ignore', data)
// 领取公共任务
export const receiveCommonTask = data => http.post('/operations/common/task/pick', data)
// 我的任务分页
export const getMyTaskPage = params => http.get('/operations/task/page', { params })
// 获取任务分页
export const getTaskPage = params => http.get('/operations/project/task/page', {params})
// 创建任务
export const createTask = data => http.post('/operations/task/create', data)
// 我的任务详情
export const getTaskDetail = params => http.get('/operations/task/detail', { params })
// 完成任务
export const missionTask = data => http.post('/operations/task/complete', data)
// 任务记录
export const getTaskRecord = params => http.get('/operations/task/record', { params })
// 任务附件上传
export const uploadTaskFile = params => http.upload('/operations/task/attachment/upload', {
  filePath: params.filePath,
  formData: params.formData,
  name: 'file',
  header: {'Content-Type': 'multipart/form-data'}
})
// 工时登记
export const workTimeRegister = data => http.post('/operations/task/working-minute/register', data)
// 数量登记
export const quantityRegister = data => http.post('/operations/task/quantity/register', data)
// 获取BOM需求列表
export const getBomDemandList = params => http.get('/operations/project-bom/list', { params })
// 任务附件批量创建
export const createTaskAttachment = data => http.post('/operations/task/attachment/batch/create', data)
// 获得模板
export const getTemplate = params => http.get('/operations/template/get', { params })
// 修改责任人
export const updateTaskOwner = data => http.post('/operations/task/blame/change', data)
