import request from '@/utils/request'

// 获取所有统计
export function getAllStat(){
  return request({
    url: '/crm/compStat/allStat',
    method: 'get',
  })  
}

// 统计线索分布
export function getClueDistribe() {
  return request({
    url: '/crm/compStat/clueDistribe',
    method: 'get',
  })
}

// 获取最近一年的统计
export function getLastYearStat() {
  return request({
      url: '/crm/compStat/lastYearStat/',
      method: 'get'
  })
}