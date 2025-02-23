import request from '@/utils/request'

// 查询站内信列表
export function listSysMessage(query) {
  return request({
    url: '/common/sysMessage/list',
    method: 'get',
    params: query
  })
}

//全部设置为已读
export function allMessageRead(){
    return request({
        url: '/common/sysMessage/allMessageRead',
        method: 'post'
    })
}

// 查询站内信详细
export function getSysMessage(id) {
  return request({
    url: '/common/sysMessage/' + id,
    method: 'get'
  })
}

// 新增站内信
export function addSysMessage(data) {
  return request({
    url: '/common/sysMessage',
    method: 'post',
    data: data
  })
}

// 修改站内信
export function updateSysMessage(data) {
  return request({
    url: '/common/sysMessage',
    method: 'put',
    data: data
  })
}

// 阅读
export function readSysMessage(id) {
    return request({
        url: '/common/sysMessage/read/'+id,
        method: 'get'
    })
}


// 删除站内信
export function delSysMessage(id) {
  return request({
    url: '/common/sysMessage/' + id,
    method: 'delete'
  })
}



// 首页顶部消息总数量
export function queryTopBarMessageCount(){
    return request({
        url: '/common/sysMessage/queryTopBarMessageCount',
        method: 'get'
    })
}

// 未完成待办任务数量
export function queryTodoTaskCount(){
    return request({
        url: '/oa/myTask/queryTodoTaskCount',
        method: 'get'
    })
}
