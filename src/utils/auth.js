import Cookies from 'js-cookie'

const TokenKey = 'cri_user_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function handleAuthResult(id,self) {
  if(id === 'inuse') {
    self.$alert('社交号已被占用，请联系系统管理员！')
    return
  }
  if(id.indexOf('err=') === 0) {
    console.log(decodeURI(id))
    self.$message({
      message: "操作失败!",
      type: "error",
    })
    self.showDialog = false
    return
  }
  if(id === 'empty') {
    self.$alert('新增账号失败，请开通facebook主页并授权！')
    self.$store.dispatch('oauth/resetUsers')
    self.showDialog = false
    return 
  }
  if(id === 'refresh') {
    self.$store
    .dispatch('oauth/resetUsers')
    .then(() => {
      self.$message({
        message: "操作成功",
        type: "success",
      })
      self.showDialog = false
    })
    .catch((ex) => {
      self.$message({
        message: "操作失败",
        type: "danger",
      })
      self.showDialog = false
    })
    return
  }
  self.$store
    .dispatch('oauth/addUser', id)
    .then(() => {
      self.$message({
        message: "操作成功",
        type: "success",
      })
      self.showDialog = false
    })
    .catch((ex) => {
      self.$message({
        message: "操作失败",
        type: "danger",
      })
      self.showDialog = false
    })
}
