import request from '@/utils/request'

// 查询自定义单列表
export function querySysCommunicateBook(data) {
    return request({
        url: '/oa/communicateBook/querySysCommunicateBook',
        method: 'get',
        params: data
    })
}


// 查询个人通讯录列表
export function listCommunicateBook(query) {
    return request({
        url: '/oa/communicateBook/list',
        method: 'get',
        params: query
    })
}

export function listHomeBook(query) {
    return request({
        url: '/oa/communicateBook/listHomeBook',
        method: 'get',
        params: query
    })
}

// 查询个人通讯录详细
export function getCommunicateBook(id) {
    return request({
        url: '/oa/communicateBook/' + id,
        method: 'get'
    })
}

// 新增个人通讯录
export function addCommunicateBook(data) {
    return request({
        url: '/oa/communicateBook',
        method: 'post',
        data: data
    })
}

// 修改个人通讯录
export function updateCommunicateBook(data) {
    return request({
        url: '/oa/communicateBook',
        method: 'put',
        data: data
    })
}

// 删除个人通讯录
export function delCommunicateBook(id) {
    return request({
        url: '/oa/communicateBook/' + id,
        method: 'delete'
    })
}
