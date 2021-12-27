import request from '@/utils/request'
import { Object } from 'core-js'

export function getAllRoles() {
  return request({
    url: '/role',
    method: 'get'
  })
}
export function getRoles(query) {
  const params = Object.assign({ page: 1, size: 20, keyword: ''}, query)
  return request({
    url: '/role/search',
    method: 'get',
    params: params
  })
}
export function updateRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data
  })
}
export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function deleteRole(rid) {
  return request({
    url: `/role/${rid}`,
    method: 'delete',
  })
}



