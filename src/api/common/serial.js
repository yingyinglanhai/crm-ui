import request from '@/utils/request'

// 查询编号规则列表
export function listSerial(query) {
  return request({
    url: '/common/serial/list',
    method: 'get',
    params: query
  })
}

// 查询编号规则详细
export function getSerial(id) {
  return request({
    url: '/common/serial/' + id,
    method: 'get'
  })
}

// 新增编号规则
export function addSerial(data) {
  return request({
    url: '/common/serial',
    method: 'post',
    data: data
  })
}

// 修改编号规则
export function updateSerial(data) {
  return request({
    url: '/common/serial',
    method: 'put',
    data: data
  })
}

// 删除编号规则
export function delSerial(id) {
  return request({
    url: '/common/serial/' + id,
    method: 'delete'
  })
}


/***
 * 获取编码规则
 * @param key
 * @returns {*}
 */
export function getSerialByKey(key){
    return request({
        url: '/common/serial/getSerialByKey/'+key,
        method: 'get',
    })
}
