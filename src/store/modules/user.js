import { login, logout, getInfo, updateAvatar, isAlive } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: '',
    email: '',
    name: '',
    nick: '',
    avatar: '',
    roles: [],
    perms: [],
    pushed: 0,
    interaction: 0
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_NICK: (state, nick) => {
    state.nick = nick
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  },
  SET_INTERACTION: (state, interaction) => {
    state.interaction = interaction
  },
  SET_PUSHED: (state, pushed) => {
    state.pushed = pushed
  },

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(res => {
        reject(res)
      })
    })
  },

  //oauth login
  oauthLogin({ commit }, token) {
    return new Promise((resolve, reject) => {
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
    })
  },
  
  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { id, name, email, nick, avatar, roles, perms } = response

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ID', id)
        commit('SET_NAME', name)
        commit('SET_EMAIL', email)
        commit('SET_NICK', nick)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        commit('SET_PERMS', perms)
        dispatch('oauth/resetUsers', null, { root: true })
        .then(res=>{
          resolve({ userInfo: response })
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateInfo({ commit, state, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      const { name, nick, avatar } = userInfo
      commit('SET_NAME', name)
      commit('SET_NICK', nick)
      commit('SET_AVATAR', avatar)
      resolve(userInfo)
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        dispatch('oauth/clearUsers', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // update user avatar
  updateAvatar({ commit }, url) {
    return new Promise((resolve, reject) => {
      updateAvatar(url).then(response => {
        commit("SET_AVATAR", url)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  isAlive({ commit }) {
    return new Promise((resolve, reject) => {
      isAlive().then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updatePushed({ commit }, pushed) {
    commit('SET_PUSHED', pushed)
  },
  updateInteraction({ commit }, interaction) {
    commit('SET_INTERACTION', interaction)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

