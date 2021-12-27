import request from '@/utils/request'
export function register(data) {
    return request({
      url: '/register/register',
      method: 'post',
      data
    })
  }
  export function sendEmail(email) {
    return request({
      url: '/register/email/send',
      method: 'post',
      data: {email: email}
    })
  }