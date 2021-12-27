import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function updateAvatar(url) {
  return request({
    url: '/me/updateAvatar',
    method: 'put',
    params: {avatar: url}
  })
}

export function getMyInfo() {
  return request({
    url: '/me/info',
    method: 'get'
  })
}

export function updateMyInfo(data) {
  return request({
    url: '/me/updateInfo',
    method: 'put',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/me/updatePassword',
    method: 'put',
    data
  })
}

export function isAlive() {
  return request({
    url: '/me/alive',
    method: 'get'
  })
}

export function bind(oauthId) {
  return request({
    url: '/me/bind',
    method: 'get',
    params: { oauthId }
  })
}
export function unbind(oauthId) {
  return request({
    url: '/me/unbind',
    method: 'get',
    params: { oauthId }
  })
}

