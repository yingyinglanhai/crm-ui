import request from '@/utils/request'

export function getYear() {
    return request({
        url: '/t/enterprise/getYear',
        method: 'post',
    })
}


export function getData() {
    return request({
        url: '/t/enterprise/getData',
        method: 'post',
    })
}


export function getPlaceData() {
    return request({
        url: '/t/enterprise/getPlaceData',
        method: 'post',
    })
}


export function getPTData() {
    return request({
        url: '/t/enterprise/getPTData',
        method: 'post',
    })
}



export function getAuditProjectYear() {
    return request({
        url: '/t/auditProject/getYear',
        method: 'post',
    })
}


export function getAuditProjectCount() {
    return request({
        url: '/t/auditProject/getAuditProjectCount',
        method: 'post',
    })
}



export function getProjectYear() {
    return request({
        url: '/t/project/getYear',
        method: 'post',
    })
}


export function getProjectCount() {
    return request({
        url: '/t/project/getProjectCount',
        method: 'post',
    })
}
