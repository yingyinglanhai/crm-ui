import request from '@/utils/request'

// 获取流程图
export function getFlowImgByInsId(insId){
    return request({
        url: '/oa/flowImg/getFlowImgByInsId?insId='+insId,
        method: 'post'
    })
}

export function getDefImgByInsId(insId){
    return request({
        url: '/oa/flowImg/getDefImgByInsId?insId='+insId,
        method: 'post'
    })
}




//获取流程图
export function getDefImgByBusinessId(data){
    return request({
        url: '/oa/flowImg/getDefImgByBusinessId',
        method: 'post',
        data: data
    })
}
