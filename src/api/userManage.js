import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function getUsers(page, size, keyword) {
  return request({
    url: '/user',
    method: 'get',
    params: {
      keyword, page, size
    }
  })
}

export function searchUsers(data) {
  return request({
    url: '/user/search',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: `/user/${data.id}/status`,
    method: 'put',
    data: data
  })
}

export function updateAvatar(data) {
  return request({
    url: `/user/${data.id}/avatar`,
    method: 'put',
    data: data
  })
}
