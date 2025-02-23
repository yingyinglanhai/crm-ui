import request from '@/utils/request'

// 查询公海客户列表
export function listMyCustomer(query) {
  return request({
    url: '/crm/myCustomer/list',
    method: 'get',
    params: query
  })
}
// 查询全部客户
export function listMyCustomerAll() {
    return request({
        url: '/crm/myCustomer/listAll',
        method: 'get'
    })
}

// 查询客户详情
export function getMyCustomer(id) {
  return request({
    url: '/crm/myCustomer/'+id,
    method: 'get'
  })
}

// 新增客户
export function addMyCustomer(data) {
  return request({
    url: '/crm/myCustomer',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateMyCustomer(data) {
  return request({
    url: '/crm/myCustomer',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delMyCustomer(id) {
  return request({
    url: '/crm/myCustomer/'+ id,
    method: 'delete'
  })
}

// 认领客户
export function returnMyCustomer(data) {
  return request({
    url: '/crm/myCustomer/return',
    method: 'put',
    data: data
  })
}
