import request from '@/utils/request'

export function getAllPerms() {
  return request({
    url: '/perm',
    method: 'get',
  })
}

export function addPerm(data) {
  return request({
    url: '/perm',
    method: 'post',
    data
  })
}
export function batchAdd(data) {
  return request({
    url: '/perm/batchInsert',
    method: 'post',
    data
  })
}
export function deletePerm(pid) {
  return request({
    url: `/perm/${pid}`,
    method: 'delete',
  })
}
export function deleteByModel(pid) {
  return request({
    url: `/perm/${pid}/delByModel`,
    method: 'delete'
  })
}


