import request from '@/utils/request'

// 查询我的待办列表
export function listMyTask(query) {
  return request({
    url: '/oa/myTask/list',
    method: 'get',
    params: query
  })
}

// 查询我的待办详细
export function getMyTask(taskid) {
    return request({
        url: '/oa/myTask/' + taskid,
        method: 'get'
    })
}

// 查询审批历史
export function getHisByInsId(insId) {
    return request({
        url: '/oa/myTask/getHisByInsId/'+insId,
        method: 'get'
    })
}
export function getHisByBusinessId(data) {
    return request({
        url: '/oa/myTask/getHisByBusinessId',
        method: 'post',
        data:data
    })
}

// 查询我的待办任务
export function todoTaskList(data) {
    return request({
        url: '/oa/myTask/todoTaskList',
        method: 'get',
        params: data
    })
}
// 查询我的已办任务列表
export function  haveDoneTaskList(data){
    return request({
        url: '/oa/myTask/haveDoneTaskList',
        method: 'get',
        params: data
    })
}


export function commitTask(task){
    return request({
        url: '/oa/myTask/commitTask',
        method: 'post',
        data: task
    })
}

export function rejectTask(task){
    return request({
        url: '/oa/myTask/rejectTask',
        method: 'post',
        data: task
    })
}

