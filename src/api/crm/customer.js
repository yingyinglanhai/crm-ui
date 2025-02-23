import request from '@/utils/request'

// 查询公海客户列表
export function listCustomer(query) {
  return request({
    url: '/crm/customer/list',
    method: 'get',
    params: query
  })
}
// 查询全部客户
export function listAllCustomer(query) {
    return request({
        url: '/crm/customer/listAll',
        method: 'get',
        params: query
    })
}

// 查询客户详情
export function getCustomer(id) {
  return request({
    url: '/crm/customer/'+id,
    method: 'get'
  })
}

// 新增客户
export function addCustomer(data) {
  return request({
    url: '/crm/customer',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateCustomer(data) {
  return request({
    url: '/crm/customer',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delCustomer(id) {
  return request({
    url: '/crm/customer/'+ id,
    method: 'delete'
  })
}

// 认领客户
export function claimCustomer(data) {
  return request({
    url: '/crm/customer/claim',
    method: 'put',
    data: data
  })
}
