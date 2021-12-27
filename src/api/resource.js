import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/resource/resourceinfos',
    method: 'post',
    data: query
  })
}

export function putPic(data) {
  return request({
    url: '/resource/resourceinfo',
    method: 'put',
    data: data
  })
}

export function deletePics(data) {
  return request({
    url: '/resource/resourceinfo',
    method: 'delete',
    params: data
  })
}



