import request from '@/utils/request'

// 查询回款计划列表
export function listBackmoneyPlan(query) {
  return request({
    url: '/crm/backmoneyPlan/list',
    method: 'get',
    params: query
  })
}

// 查询指定一个合同的回款计划列表
export function listBackmoneyPlanByContractId(id) {
  return request({
      url: '/crm/backmoneyPlan/listByContractId/'+id,
      method: 'get'
  })
}

// 查询回款计划详细
export function getBackmoneyPlan(backmoneyPlanId) {
  return request({
    url: '/crm/backmoneyPlan/' + backmoneyPlanId,
    method: 'get'
  })
}

// 新增回款计划
export function addBackmoneyPlan(data) {
  return request({
    url: '/crm/backmoneyPlan',
    method: 'post',
    data: data
  })
}

// 修改回款计划
export function updateBackmoneyPlan(data) {
  return request({
    url: '/crm/backmoneyPlan',
    method: 'put',
    data: data
  })
}

// 删除回款计划
export function delBackmoneyPlan(backmoneyPlanId) {
  return request({
    url: '/crm/backmoneyPlan/' + backmoneyPlanId,
    method: 'delete'
  })
}
