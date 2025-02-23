import request from '@/utils/request'

// 查询公海客户列表
export function listChance(query) {
  return request({
    url: '/crm/chance/list',
    method: 'get',
    params: query
  })
}
// 查询全部客户
export function listChanceAll() {
    return request({
        url: '/crm/chance/listAll',
        method: 'get'
    })
}

// 查询客户详情
export function getChance(id) {
  return request({
    url: '/crm/chance/'+id,
    method: 'get'
  })
}

// 新增客户
export function addChance(data) {
  return request({
    url: '/crm/chance',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateChance(data) {
  return request({
    url: '/crm/chance',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delChance(id) {
  return request({
    url: '/crm/chance/'+ id,
    method: 'delete'
  })
}
