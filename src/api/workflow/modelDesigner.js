import request from '@/utils/request'


// 查询自定义单列表
export function getModelDetail(modelId) {
    return request({
        url: '/oa/model/getModelDetail',
        method: 'post',
        params: {"modelId":modelId}
    })
}
export function getModelDetailByKey(key) {
    return request({
        url: '/oa/model/getModelDetailByKey',
        method: 'post',
        params: {"key":key}
    })
}

// 保存更新流程图
export function saveModel(modelId,data) {
    return request({
        url: '/oa/model/save/'+modelId,
        data: data,
        method: 'post'
    })
}

export function getModelDesignerUserList(username) {
    return request({
        url: '/oa/model/getModelDesignerUserList',
        method: 'post',
        params: {"username":username}
    })
}
export function getModelDesignerPostList(username) {
    return request({
        url: '/oa/model/getModelDesignerPostList',
        method: 'post',
        params: {"username":username}
    })
}


