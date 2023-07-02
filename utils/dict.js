/**
 *
 * 数据字典工具类
 */
import store from '@/store'

export const DICT_TYPE = {
  // ========== TASK 模块 ==========
  APP_MY_TASK_TAB: 'app_my_task_tab', // 我的任务状态
  OPERATIONS_TASK_TYPE: 'operations_task_type' // 首页公共任务
}

/**
 * 获取 dictType 对应的数据字典数组
 *
 * @param dictType 数据类型
 * @returns {*|Array} 数据字典数组
 */
export function getDictDatas(dictType) {
  return store.getters.dictData[dictType] || []
}
