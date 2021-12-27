import request from '@/utils/request'
//查询我的提审主题
export function pushAuditSubmitted(data) {
  return request({
    url: '/pushAudit/querySubmitted',
    method: 'post',
    data
  })
}
//查询我的待审主题
export function pushAuditPendingPushContent(data) {
  return request({
    url: '/pushAudit/queryPendingPushContent',
    method: 'post',
    data
  })
}
//取消审核帖文发布
export function pushAuditcancelPublish(id) {
  return request({
    url: `/pushAudit/cancelPublish/${id}`,
    method: 'delete',
  })
}
//查询单条帖文
export function pushcontentID(id) {
  return request({
    url: `/push/pushcontent/${id}`,
    method: 'get',
  })
}
//修改并提交帖文
export function pushcontentEditSubmit(data) {
  return request({
    url: `/push/pushcontentEditSubmit`,
    method: 'post',
    data
  })
}
//查询待审列表
export function queryPendingPushContent(data) {
  return request({
    url: '/pushAudit/queryPendingPushContent',
    method: 'post',
    data
  })
}

//成员列表
export function getMemberList(data) {
  return request({
    url: '/member/getMemberList',
    method: 'post',
    data
  })
}
//通过
export function pushcheckPass(data) {
  return request({
    url: '/pushContentCheck/checkPass',
    method: 'post',
    data
  })
}
//不通过
export function pushcheckNoPass(data) {
  return request({
    url: '/pushContentCheck/checkNoPass',
    method: 'post',
    data
  })
}
