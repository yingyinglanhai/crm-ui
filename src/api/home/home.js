import request from '@/utils/request'


// 获取数量
export function getItemCountData(query) {
    return request({
        url: '/home/getItemCountData',
        method: 'get'
    })
}

export function queryLastUpdateList(){
    return request({
        url: '/home/queryLastUpdateList',
        method: 'get'
    })
}
