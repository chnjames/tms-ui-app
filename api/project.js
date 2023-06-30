//请求工具参考https://ext.dcloud.net.cn/plugin?id=392
const { http } = uni.$u

// 获取项目精简信息列表
export const getProjectSimpleList = params => http.get('/operations/project/list-all-simple', params)
// 获取项目文档分页
export const getProjectDocList = params => http.get('/operations/project/document/page', {params})
