import request from '@/utils/request'

// 查询历史任务列表
export function listActHiTaskInst(query) {
  return request({
    url: '/oa/actHiTaskInst/list',
    method: 'get',
    params: query
  })
}

// 查询历史任务详细
export function getActHiTaskInst(id) {
  return request({
    url: '/oa/actHiTaskInst/' + id,
    method: 'get'
  })
}

// 新增历史任务
export function addActHiTaskInst(data) {
  return request({
    url: '/oa/actHiTaskInst',
    method: 'post',
    data: data
  })
}

// 修改历史任务
export function updateActHiTaskInst(data) {
  return request({
    url: '/oa/actHiTaskInst',
    method: 'put',
    data: data
  })
}

// 删除历史任务
export function delActHiTaskInst(id) {
  return request({
    url: '/oa/actHiTaskInst/' + id,
    method: 'delete'
  })
}


export function getTaskCishuReport(query) {
    return request({
        url: '/oa/actHiTaskInst/getTaskCishuReport',
        method: 'get',
        params: query
    })
}
