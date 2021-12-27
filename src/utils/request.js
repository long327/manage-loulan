import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Code from '@/utils/code'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  crossDomain: true,
  timeout: 300000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['cri-token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.succ || res.code === 20000 ) {
      // 如果后台返回的json显示成功，pass
      return res
    } else {
      if (res.code === Code.UNAUTHEN || res.code === Code.SESSION_TIMOUT) {
        //  处理登录相关的错误
        // Message({
        //   message: '登录超时，请重新登录',
        //   type: 'error',
        //   duration: 2 * 1000
        // })
        store.dispatch('user/logout').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
        return Promise.reject(res)
      } else if (res.code === Code.LOGIN_FAIL || res.code === Code.CUSTOM_FAIL) {
        //不做默认处理，由调用者自己处理错误信息
        return Promise.reject(res)
      }
      else if (res.msg) {
        //  其它错误弹出错误信息
        Message({ message: res.msg , type: 'error', duration: 5000 })
        return Promise.reject(reg.msg)
      }
      else {
        if(res.indexOf("UnknownSessionException") !=-1) {
          return Promise.reject("提前退出，导致找不到session")
        }
        return Promise.reject(res)
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
