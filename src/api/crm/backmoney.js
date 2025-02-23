import request from '@/utils/request'

// 查询回款列表
export function listBackmoney(query) {
  return request({
    url: '/crm/backmoney/list',
    method: 'get',
    params: query
  })
}

// 查询指定一个合同的回款列表
export function listBackmoneyByContractId(id) {
  return request({
      url: '/crm/backmoney/listByContractId/'+id,
      method: 'get'
  })
}

// 查询回款详细
export function getBackmoney(backmoneyId) {
  return request({
    url: '/crm/backmoney/' + backmoneyId,
    method: 'get'
  })
}

// 新增回款
export function addBackmoney(data) {
  return request({
    url: '/crm/backmoney',
    method: 'post',
    data: data
  })
}

// 修改回款
export function updateBackmoney(data) {
  return request({
    url: '/crm/backmoney',
    method: 'put',
    data: data
  })
}

// 删除回款
export function delBackmoney(backmoneyId) {
  return request({
    url: '/crm/backmoney/' + backmoneyId,
    method: 'delete'
  })
}
