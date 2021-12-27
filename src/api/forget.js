import request from '@/utils/request'

export function sendEmail(email) {
  return request({
    url: '/forget/email/send',
    method: 'post',
    data: {email: email}
  })
}

export function resetPassword(data) {
  return request({
    url: '/forget/reset',
    method: 'post',
    data
  })
}
