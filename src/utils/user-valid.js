
import { validUsername, validEmail, validPhone, validPassword } from "@/utils/validate"

  const validateNick = (rule, value, callback) => {
    if(!rule.required && !value){
        callback()
        return
    }
    if ( value && value.length >=4 && value.length <=20) {
      callback()
    } else {
      callback(new Error('昵称为4到20个字符'))
    }
  }
  const validateRealname = (rule, value, callback) => {
    if(!rule.required && !value){
        callback()
        return
    }
    if ( value && value.length >=2 && value.length <=20) {
      callback()
    } else {
      callback(new Error('姓名为2到20个字符'))
    }
  }
  const validateEmail = (rule, value, callback) => {
    if(!rule.required && !value){
      callback()
      return
    }
    if (!validEmail(value)) {
      callback(new Error('请输入正确的email'))
    } else {
      callback()
    }
  }
  const validatePhone = (rule, value, callback) => {
    if(!rule.required && !value){
      callback()
      return
    }
    if (validPhone(value)) {
      callback()
    } else {
      callback(new Error('手机号为11位数字'))
    }
  }
  const validateCompany = (rule, value, callback) => {
    if(!rule.required && !value){
      callback()
      return
    }
    if ( value && value.length >=5 && value.length <=20) {
      callback()
    } else {
      callback(new Error('姓名为5到20个字符'))
    }
  }
  const validateUsername = (rule, value, callback) => {
    if(!rule.required && !value){
      callback()
      return
    }
    if (!validUsername(value)) {
      callback(new Error('请输入您的电子邮箱!'))
      // callback(new Error('用户名应为5-20个字符，合法字符为字母、数字、及"-、_、@、."'))
    } else {
      callback()
    }
  }
  const validatePassword = (rule, value, callback) => {
    if(!rule.required && !value){
      callback()
      return
    }
    if (!validPassword(value)) {
      callback(new Error('必须包含数字、大写字母和小写字母，8-20个字符!'))
    } else {
      callback()
    }
  }
  
  const userInfoRules = {
    nick: [
      { required: false, trigger: ['blur','change'], validator: validateNick }
    ],
    realname: [
      { required: false, trigger: ['blur','change'], validator: validateRealname  }
    ],
    email: [
      {
        required: false,
        trigger: ['blur','change'],
        validator: validateEmail
      }
    ],
    phone: [
      {
        required: false,
        trigger: ['blur','change'],
        validator: validatePhone
      }
    ],
    company: [
      { required: false, trigger: ['blur','change'], validator: validateCompany }
    ]
  }
  
export default {
    validateUsername,
    validatePassword,
    validateNick,
    validateRealname,
    validateEmail,
    validatePhone,
    validateCompany,
    userInfoRules
}