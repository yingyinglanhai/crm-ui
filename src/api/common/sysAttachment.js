import request from '@/utils/request'

// 查询附件中心列表
export function listSysAttachment(query) {
  return request({
    url: '/common/sysAttachment/list',
    method: 'get',
    params: query
  })
}

// 单据中的附件信息
export function formAttachmentlist(query) {
    return request({
        url: '/common/sysAttachment/formAttachmentlist',
        method: 'get',
        params: query
    })
}

// 查询附件中心详细
export function getSysAttachment(id) {
  return request({
    url: '/common/sysAttachment/' + id,
    method: 'get'
  })
}

// 新增附件中心
export function addSysAttachment(data) {
  return request({
    url: '/common/sysAttachment',
    method: 'post',
    data: data
  })
}

// 修改附件中心
export function updateSysAttachment(data) {
  return request({
    url: '/common/sysAttachment',
    method: 'put',
    data: data
  })
}

// 删除附件中心
export function delSysAttachment(id) {
  return request({
    url: '/common/sysAttachment/' + id,
    method: 'delete'
  })
}


// 附件数量
export function countSysAttachement(query){
    return request({
        url: '/common/sysAttachment/countSysAttachement',
        method: 'get',
        params: query
    })
}
