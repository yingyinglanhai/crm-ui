import request from '@/utils/request'

// 查询商机跟进列表
export function listChanceFollow(query) {
  return request({
    url: '/crm/chanceFollow/list',
    method: 'get',
    params: query
  })
}
// 查询指定一个商机的跟进列表
export function listChanceFollowByChanceId(id) {
    return request({
        url: '/crm/chanceFollow/listByChanceId/'+id,
        method: 'get'
    })
}

// 查询商机跟进详情
export function getChanceFollow(id) {
  return request({
    url: '/crm/chanceFollow/'+id,
    method: 'get'
  })
}

// 新增商机跟进数据
export function addChanceFollow(data) {
  return request({
    url: '/crm/chanceFollow',
    method: 'post',
    data: data
  })
}

// 修改商机跟进信息
export function updateChanceFollow(data) {
  return request({
    url: '/crm/chanceFollow',
    method: 'put',
    data: data
  })
}

// 删除客户联系人
export function delChanceFollow(id) {
  return request({
    url: '/crm/chanceFollow/'+ id,
    method: 'delete'
  })
}
