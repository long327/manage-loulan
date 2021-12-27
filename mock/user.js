
var tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

var users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

var defaultUserInfo = {
  roles: ['editor'],
  introduction: 'I am an editor',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  name: 'Normal Editor'
}

module.exports = [
  // user register
  {
    url: '/auth/register',
    type: 'post',
    response: config => {
      const { username } = config.body
      if(tokens[username]){
        return {
          code: 60205,
          message: '用户名已存在。'
        }
      }
      let userToken = username+"-token"
      let token = {
        token: userToken
      }
      tokens[username] = token;
      users[userToken] = Object.assign({},defaultUserInfo,{name:username})

      return {
        code: 20000,
        data: token
      }
    }
  },
  // user login
  {
    url: '/auth/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: '用户或密码错误。'
        }
      }

      return {
        succ: true,
        code: 200,
        ...token
      }
    }
  },

  // get user info
  {
    url: '/auth/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return { "msg": "操作成功", "nick": null, "code": 200, "succ": true, "roles": ["operator"], "name": "shixue", "avator": null, "oper": "get user info", "perms": ["article:add", "article:update", "article:del", "article:list", "article:info", "sns:user:add", "sns:user:update", "sns:user:del", "sns:user:list", "sns:user:info", "sns:order:add", "sns:order:update", "sns:order:del", "sns:order:list", "sns:order:info"] }
    }
  },

  // user logout
  {
    url: '/auth/logout',
    type: 'post',
    response: _ => {
      return {
        succ: true,
        code: 200,
        data: 'success'
      }
    }
  }
]
