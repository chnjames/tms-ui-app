//请求工具参考https://ext.dcloud.net.cn/plugin?id=392
const { http } = uni.$u

// 获得所有库位及其父集列表
export const getStockList = params => http.get('/warehouse/stock/location/list-with-parent-simple', {params})
// 入库
export const putInStorage = data => http.post('/warehouse/stock/inbound', data)
// 出库
export const outOfStorage = data => http.post('/warehouse/stock/batch/outbound', data)
// 库存列表
export const getStockPage = params => http.get('/warehouse/stock/list', {params})
// 库位列表
export const getLocationList = params => http.get('/warehouse/stock/location/list', {params})
// 更新库存
export const updateStock = data => http.put('/warehouse/stock/update', data)
// 库位详情
export const getLocationDetail = params => http.get('/warehouse/stock/location/get', {params})
