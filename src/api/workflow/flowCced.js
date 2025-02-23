import request from '@/utils/request'

// 查询抄送我的列表
export function listFlowCced(query) {
  return request({
    url: '/oa/flowCced/list',
    method: 'get',
    params: query
  })
}


// 查询抄送我的列表
export function listToMe(query) {
    return request({
        url: '/oa/flowCced/listToMe',
        method: 'get',
        params: query
    })
}


// 查询抄送我的详细
export function getFlowCced(id) {
  return request({
    url: '/oa/flowCced/' + id,
    method: 'get'
  })
}

// 新增抄送我的
export function addFlowCced(data) {
  return request({
    url: '/oa/flowCced',
    method: 'post',
    data: data
  })
}

// 修改抄送我的
export function updateFlowCced(data) {
  return request({
    url: '/oa/flowCced',
    method: 'put',
    data: data
  })
}

// 删除抄送我的
export function delFlowCced(id) {
  return request({
    url: '/oa/flowCced/' + id,
    method: 'delete'
  })
}


// 计算抄送数量
export function countCced(query){
    return request({
        url: '/oa/flowCced/countCced',
        method: 'get',
        params: query
    })
}
