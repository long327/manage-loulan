import request from '@/utils/request'

export function getUsers(data) {
  return request({
    url: '/oauthUser/search',
    method: 'post',
    data
  })
}
export function getAllUsers() {
  return request({
    url: '/oauthUser/all',
    method: 'get'
  })
}
export function getInfo(id) {
  return request({
    url: '/oauthUser/' + id,
    method: 'get'
  })
}

export function unbind(id) {
  return request({
    url: '/oauthUser/unbind/' + id,
    method: 'delete'
  })
}

export function getActiveUsers() {
  return request({
    url: '/oauthUser/activeUsers',
    method: 'get',
  })
}


export function postActivity(data) {
  return request({
    url: '/oauthUser/activity',
    method: 'post',
    data
  })
}




