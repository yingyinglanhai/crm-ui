import request from '@/utils/request'

// 查询省市字典列表
export function listSysArea(query) {
  return request({
    url: '/common/sysArea/list',
    method: 'get',
    params: query
  })
}

// 查询省市字典详细
export function getSysArea(id) {
  return request({
    url: '/common/sysArea/' + id,
    method: 'get'
  })
}

// 新增省市字典
export function addSysArea(data) {
  return request({
    url: '/common/sysArea',
    method: 'post',
    data: data
  })
}

// 修改省市字典
export function updateSysArea(data) {
  return request({
    url: '/common/sysArea',
    method: 'put',
    data: data
  })
}

// 删除省市字典
export function delSysArea(id) {
  return request({
    url: '/common/sysArea/' + id,
    method: 'delete'
  })
}
