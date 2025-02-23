import request from '@/utils/request'

// 查询公海客户列表
export function listMyClue(query) {
  return request({
    url: '/crm/myClue/list',
    method: 'get',
    params: query
  })
}
// 查询全部客户
export function listMyClueAll() {
    return request({
        url: '/crm/myClue/listAll',
        method: 'get'
    })
}

// 查询客户详情
export function getMyClue(id) {
  return request({
    url: '/crm/myClue/'+id,
    method: 'get'
  })
}

// 新增客户
export function addMyClue(data) {
  return request({
    url: '/crm/myClue',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateMyClue(data) {
  return request({
    url: '/crm/myClue',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delMyClue(id) {
  return request({
    url: '/crm/myClue/'+ id,
    method: 'delete'
  })
}

// 退回公海
export function returnMyClue(data) {
  return request({
    url: '/crm/myClue/return',
    method: 'put',
    data: data
  })
}

// 线索转化为客户
export function convertToCustomer(data) {
  return request({
    url: '/crm/myClue/convert',
    method: 'put',
    data: data
  })
}
