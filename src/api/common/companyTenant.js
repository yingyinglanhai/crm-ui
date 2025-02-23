import request from '@/utils/request'

// 查询公司管理-租户列表
export function listCompanyTenant(query) {
  return request({
    url: '/tenant/companyTenant/list',
    method: 'get',
    params: query
  })
}

// 查询公司管理-租户详细
export function getCompanyTenant(id) {
  return request({
    url: '/tenant/companyTenant/' + id,
    method: 'get'
  })
}

// 获取我的公司信息
export function getMyCompanyTenant() {
    return request({
        url: '/tenant/companyTenant/getMyCompanyTenant',
        method: 'get'
    })
}

// 新增公司管理-租户
export function addCompanyTenant(data) {
  return request({
    url: '/tenant/companyTenant',
    method: 'post',
    data: data
  })
}

// 修改公司管理-租户
export function updateCompanyTenant(data) {
  return request({
    url: '/tenant/companyTenant',
    method: 'put',
    data: data
  })
}

// 删除公司管理-租户
export function delCompanyTenant(id) {
  return request({
    url: '/tenant/companyTenant/' + id,
    method: 'delete'
  })
}

//初始化企业
export function initCompany(data){
    return request({
        url: '/tenant/companyTenant/initCompany/',
        method: 'put',
        data: data
    })
}
