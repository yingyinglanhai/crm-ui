import request from '@/utils/request'

// 查询流程定义列表
export function listDefinition(query) {
  return request({
    url: '/oa/definition/list',
    method: 'get',
    params: query
  })
}

// 查询流程定义详细
export function getDefinition(id) {
  return request({
    url: '/oa/definition/' + id,
    method: 'get'
  })
}

// 新增流程定义
export function addDefinition(data) {
  return request({
    url: '/oa/definition',
    method: 'post',
    data: data
  })
}

// 修改流程定义
export function updateDefinition(data) {
  return request({
    url: '/oa/definition',
    method: 'put',
    data: data
  })
}

// 删除流程定义
export function delDefinition(id) {
  return request({
    url: '/oa/definition/' + id,
    method: 'delete'
  })
}

// 定义挂起和激活
export function suspendOrActiveApply(data) {
    return request({
        url: '/oa/definition/suspendOrActiveApply',
        data: data,
        method: 'post'
    })
}

// 获取流程图
export function readResourceImg(pdid,resourceName){
    return request({
        url: '/oa/definition/readResourceImg?pdid='+pdid+"&resourceName="+resourceName,
        method: 'get'
    })
}


// 获取流程图
export function readResourceXml(pdid,resourceName){
    return request({
        url: '/oa/definition/readResourceXml?pdid='+pdid+"&resourceName="+resourceName,
        method: 'post'
    })
}


//流程定义转换为模型
export function convert2Model(processDefinitionId){
    return request({
        url: '/oa/definition/convert2Model?processDefinitionId='+processDefinitionId,
        method: 'post'
    })
}

export function getAllFlowList(){
    return request({
        url: '/oa/definition/getAllFlowList',
        method: 'post'
    })
}
