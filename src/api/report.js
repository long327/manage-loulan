import request from '@/utils/request'

export function getTrendsGlobal() {
    return request({
      url: '/report/trends',
      method: 'get'
    })
  }