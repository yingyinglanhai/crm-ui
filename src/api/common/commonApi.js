// 查询未读信息数量
import request from "@/utils/request";

export function getChatNotReadMessageCount(){
    return request({
        url: '/im/chatMessage/getChatNotReadMessageCount',
        method: 'get'
    })
}
