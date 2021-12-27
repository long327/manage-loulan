export default {

  /** 成功 */
  SUCC: 1,

  /** 失败 */
  FAIL: -1,

  /** 未登录 */
  UNAUTHEN: 401,

  /** 未授权，拒绝访问 */
  UNAUTHZ: 403,

  /** 登陆失败 */
  LOGIN_FAIL: 4000,

  /** 其它需要页面自己处理的错误 */
  CUSTOM_FAIL: 5000,

  /** session超时退出了登录 */
  SESSION_TIMOUT: 4011,

  /** 服务端异常 */
  SERVER_ERR: 500

}

