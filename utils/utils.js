/*
 * @Author: James
 * @description: 工具
 */
import toPinyin from "./toPinyin";

/**
 * 根据拼音首字母筛选排序分组
 * @param {Array} arr 原数组
 * @param {String} key 原数组需要筛选的字段
 * @returns {Array} 返回一个[{name: A,value: []}] 格式的二维数组
 */
export function getGroupByPinyin(arr, key = 'name') {
  if (!arr) return

  // 获取A-Z字母数组
  let keys = [...Array(26).keys()].map((i) => String.fromCharCode(i + 65));

  arr = arr.map((n) => ({
    ...n,
    py: toPinyin.chineseToInitials(
      toPinyin.chineseToPinYin(n[key].substr(0, 1))
    ),
  }));

  let group = [];
  for (const i of keys) {
    // 新数组一级结构，可自行修改
    let item = {
      name: i,
      value: [],
    };
    for (const j of arr) {
      if (j.py === i) {
        item.value.push(j);
      }
    }
    if (item.value.length > 0) {
      item.value.sort((a, b) => a[key].localeCompare(b[key]));
      group.push(item);
    }
  }
  return group;
}

/**
 * 时间戳转换为自定义日期格式 yyyy-MM-dd hh:mm:ss || 年月日时分秒
 * @param {Number} timestamp 时间戳
 * @param {String} fmt 日期格式
 * @returns {String} 返回自定义日期格式
 */
export function timestampToTime(timestamp, fmt = "yyyy-MM-dd hh:mm:ss") {
if (!timestamp) return '';
  let date = new Date(timestamp);
  let ret;
  let opt = {
    "y+": date.getFullYear().toString(), // 年
    "M+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "h+": date.getHours().toString(), // 时
    "m+": date.getMinutes().toString(), // 分
    "s+": date.getSeconds().toString(), // 秒
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
/**
 * 分钟转成小时(x.xxh)
 * @param {Number} minute 分钟
 */
export function formatMinuteToHour(minute) {
  return `${(minute / 60).toFixed(2)}`;
}
