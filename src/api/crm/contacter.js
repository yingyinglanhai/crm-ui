import request from '@/utils/request'

// 查询客户联系人列表
export function listContacter(query) {
  return request({
    url: '/crm/contacter/list',
    method: 'get',
    params: query
  })
}
// 查询指定一个客户的联系人
export function listContacterByCustomerId(id) {
    return request({
        url: '/crm/contacter/listByCustomerId/'+id,
        method: 'get'
    })
}

// 查询客户联系人详情
export function getContacter(id) {
  return request({
    url: '/crm/contacter/'+id,
    method: 'get'
  })
}

// 新增客户联系人
export function addContacter(data) {
  return request({
    url: '/crm/contacter',
    method: 'post',
    data: data
  })
}

// 修改客户联系人
export function updateContacter(data) {
  return request({
    url: '/crm/contacter',
    method: 'put',
    data: data
  })
}

// 删除客户联系人
export function delContacter(id) {
  return request({
    url: '/crm/contacter/'+ id,
    method: 'delete'
  })
}
