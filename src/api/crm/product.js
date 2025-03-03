import request from '@/utils/request'

// 查询产品列表
export function listProduct(query) {
  return request({
    url: '/crm/product/list',
    method: 'get',
    params: query
  })
}
// 查询全部产品
export function listProductAll() {
    return request({
        url: '/crm/product/listAll',
        method: 'get'
    })
}

// 查询产品详情
export function getProduct(id) {
  return request({
    url: '/crm/product/'+id,
    method: 'get'
  })
}

// 新增产品
export function addProduct(data) {
  return request({
    url: '/crm/product',
    method: 'post',
    data: data
  })
}

// 修改产品
export function updateProduct(data) {
  return request({
    url: '/crm/product',
    method: 'put',
    data: data
  })
}

// 删除产品
export function delProduct(id) {
  return request({
    url: '/crm/product/'+ id,
    method: 'delete'
  })
}
