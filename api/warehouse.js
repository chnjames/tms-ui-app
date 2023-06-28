//请求工具参考https://ext.dcloud.net.cn/plugin?id=392
const { http } = uni.$u

// 待验收列表
export const getAcceptanceList = params => http.get('/warehouse/material-buying/wait-received/list', params)
// 待验收详情
export const getAcceptanceDetail = buyingId => http.get('/warehouse/material-buying/wait-received/detail?buyingId=' + buyingId)
// 到货验收
export const acceptance = params => http.post('/warehouse/material-buying/received', params)
