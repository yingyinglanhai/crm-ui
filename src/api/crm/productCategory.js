import request from '@/utils/request'

// 查询产品分类列表
export function listProductCategory(query) {
  return request({
    url: '/crm/productCategory/list',
    method: 'get',
    params: query
  })
}
// 查询全部产品分类
export function listProductCategoryAll() {
    return request({
        url: '/crm/productCategory/listAll',
        method: 'get'
    })
}

// 查询产品分类详情
export function getProductCategory(id) {
  return request({
    url: '/crm/productCategory/'+id,
    method: 'get'
  })
}

// 新增产品分类
export function addProductCategory(data) {
  return request({
    url: '/crm/productCategory',
    method: 'post',
    data: data
  })
}

// 修改产品分类
export function updateProductCategory(data) {
  return request({
    url: '/crm/productCategory',
    method: 'put',
    data: data
  })
}

// 删除产品分类
export function delProductCategory(id) {
  return request({
    url: '/crm/productCategory/'+ id,
    method: 'delete'
  })
}
