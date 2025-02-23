import request from '@/utils/request'

// 清空所有流程
export function clearAllProcessInstance() {
    return request({
        url: '/oa/processInstance/deleteAllProcessInstance',
        method: 'get'
    })
}

//删除流程实例
export function deleteProcessInstanceById(insId) {
    return request({
        url: '/oa/processInstance/deleteProcessInstanceById?insId='+insId,
        method: 'get'
    })
}


//提交流程
export function submitFlow(data){
    return request({
        url: '/oa/processInstance/submitFlow',
        method: 'post',
        data:data

    })
}

// 取回流程
export function cancleFlow(data){
    return request({
        url: '/oa/processInstance/cancleFlow',
        method: 'post',
        data:data
    })
}
