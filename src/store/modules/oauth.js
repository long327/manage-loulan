import { getAllUsers, getInfo, unbind } from '@/api/oauthUser'

const state = {
  users: []
}

const mutations = {

  RESET_OAUTHUSERS: (state, users) => {
    state.users = users
  },
  ADD_USER: (state, user) => {
    var index = state.users.findIndex(u => u.id === user.id)
    if (index === -1) {
      state.users.push(user)
    }else {
      state.users.splice(index,1,user)
    }
  },
  CLEAR_USERS: (state) => {
    state.users = []
  }
}

const actions = {
  // add oauthuser
  addUser({ commit, dispatch }, userId) {
    return new Promise((resolve, reject) => {
      getInfo(userId).then(res => {
        const user = res.data
        commit('ADD_USER', user)
        resolve(user)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 更新三方用户列表
  resetUsers({ commit }) {
    return new Promise((resolve, reject) => {
      getAllUsers({}).then(response => {
        const { data } = response
        commit('RESET_OAUTHUSERS', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  unbind({ commit, dispatch }, userId) {
    return new Promise((resolve, reject) => {
      unbind(userId).then(response => {
        dispatch('resetUsers')
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  sortUsers({ state }, data) {
    if(state.users && data){
      state.users.forEach(u => {
        u.updated = data[u.id] || 0
      })
      state.users.sort(function(a,b){
        return b.updated - a.updated
      })
    }
  },
  updateInteraction({ state }, data) {
    if(state.users && data){
      var temp = []
      state.users.forEach(u => {
        u.interaction = data[u.id] || 0
      })
      state.users = state.users.map(t=>t)
    }
  },
  clearUsers({ commit,state }) {
    commit('CLEAR_USERS')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

