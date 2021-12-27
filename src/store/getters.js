import oauth from './modules/oauth'

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  name: state => state.user.name,
  email: state => state.user.email,
  nick: state => state.user.nick,
  roles: state => state.user.roles,
  permissions: state => state.user.perms,
  interaction: state => state.user.interaction,
  pushed: state => state.user.pushed,
  permission_routes: state => state.permission.routes,
  oauthUsers: state => state.oauth.users
}
export default getters
