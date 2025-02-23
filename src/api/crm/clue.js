import request from '@/utils/request'

// 查询线索客户列表
export function listClue(query) {
  return request({
    url: '/crm/clue/list',
    method: 'get',
    params: query
  })
}
// 查询全部客户
export function listClueAll() {
    return request({
        url: '/crm/clue/listAll',
        method: 'get'
    })
}

// 查询客户详情
export function getClue(id) {
  return request({
    url: '/crm/clue/'+id,
    method: 'get'
  })
}

// 新增客户
export function addClue(data) {
  return request({
    url: '/crm/clue',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateClue(data) {
  return request({
    url: '/crm/clue',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delClue(id) {
  return request({
    url: '/crm/clue/'+ id,
    method: 'delete'
  })
}

// 认领客户
export function claimClue(data) {
  return request({
    url: '/crm/clue/claim',
    method: 'put',
    data: data
  })
}
