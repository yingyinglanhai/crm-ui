import request from '@/utils/request'

// 查询单据类型配置列表
export function listBillType(query) {
  return request({
    url: '/oa/billType/list',
    method: 'get',
    params: query
  })
}
export function listBillTypeAll(query) {
    return request({
        url: '/oa/billType/listAll',
        method: 'get',
        params: query
    })
}

// 查询单据类型配置详细
export function getBillType(id) {
  return request({
    url: '/oa/billType/' + id,
    method: 'get'
  })
}

// 新增单据类型配置
export function addBillType(data) {
  return request({
    url: '/oa/billType',
    method: 'post',
    data: data
  })
}

// 修改单据类型配置
export function updateBillType(data) {
  return request({
    url: '/oa/billType',
    method: 'put',
    data: data
  })
}

// 删除单据类型配置
export function delBillType(id) {
  return request({
    url: '/oa/billType/' + id,
    method: 'delete'
  })
}
