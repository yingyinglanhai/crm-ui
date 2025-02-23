import request from '@/utils/request'

// 查询流程实例列表
export function listProcinst(query) {
  return request({
    url: '/oa/procinst/list',
    method: 'get',
    params: query
  })
}

// 查询流程实例详细
export function getProcinst(id) {
  return request({
    url: '/oa/procinst/' + id,
    method: 'get'
  })
}

// 新增流程实例
export function addProcinst(data) {
  return request({
    url: '/oa/procinst',
    method: 'post',
    data: data
  })
}

// 修改流程实例
export function updateProcinst(data) {
  return request({
    url: '/oa/procinst',
    method: 'put',
    data: data
  })
}

// 删除流程实例
export function delProcinst(id) {
  return request({
    url: '/oa/procinst/' + id,
    method: 'delete'
  })
}
