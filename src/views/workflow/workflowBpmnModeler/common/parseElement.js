export function commonParse(element) {
  const result = {
    ...element.businessObject,
    ...element.businessObject.$attrs
  }
  return formatJsonKeyValue(result)
}

export function formatJsonKeyValue(result) {
  // 移除flowable前缀，格式化数组
  for (const key in result) {
    if (key.indexOf('flowable:') === 0) {
      const newKey = key.replace('flowable:', '')
      result[newKey] = result[key]
      delete result[key]
    }
  }
  result = documentationParse(result)
  return result
}

export function documentationParse(obj) {
  if ('documentation' in obj) {
    let str = ''
    obj.documentation.forEach(item => {
      str += item.text
    })
    obj.documentation = str
  }
  return obj
}

export function conditionExpressionParse(obj) {
  if ('conditionExpression' in obj) {
    obj.conditionExpression = obj.conditionExpression.body
  }
  return obj
}

export function userTaskParse(obj) {
    let vars = "";
  for (const key in obj) {
      //是否启用流程变量
      if(key === 'useVars') {
          let useVars = obj[key] == '1' ? true : false;
          obj.useVars = useVars;
      }
      //用户类型
      if (key === 'candidateUsers') {
          obj.userType = 'candidateUsers'
          obj[key] = obj[key]?.split(',') || []
          vars = obj.candidateUsers;
      } else if (key === 'candidateGroups') {
          obj.userType = 'candidateGroups'
          obj[key] = obj[key]?.split(',') || []
          vars = obj.candidateGroups;
      } else if (key === 'assignee') {
          obj.userType = 'assignee'
          vars = obj.assignee;
      }

  }
    //如果启用了流程变量
    if(obj.useVars == true){
        obj.vars = vars;
    }
  return obj
}
