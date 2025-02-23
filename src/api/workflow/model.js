import request from '@/utils/request'

// 查询流程图列表
export function listModel(query) {
  return request({
    url: '/oa/model/list',
    method: 'get',
    params: query
  })
}

// 查询流程图详细
export function getModel(id) {
  return request({
    url: '/oa/model/' + id,
    method: 'get'
  })
}

// 新增流程图
export function addModel(data) {
  return request({
    url: '/oa/model/create',
    method: 'post',
    params: data
  })
}

// 修改流程图
export function updateModel(data) {
  return request({
    url: '/oa/model',
    method: 'put',
    data: data
  })
}

// 删除流程图
export function delModel(id) {
  return request({
    url: '/oa/model/' + id,
    method: 'delete'
  })
}


// 删除流程图
export function deploy(id) {
    return request({
        url: '/oa/model/deploy/' + id,
        method: 'post'
    })
}


