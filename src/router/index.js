import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/login/bind',
    component: () => import('@/views/login/bind'),
    hidden: true
  },
  {
    path: '/oauth-login-redirect',
    component: () => import('@/views/oauth-login-redirect'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/register/step2',
    component: () => import('@/views/register/step2'),
    hidden: true
  },
  {
    path: '/register/actived',
    component: () => import('@/views/register/actived'),
    hidden: true
  },
  {
    path: '/register/missed',
    component: () => import('@/views/register/missed'),
    hidden: true
  },
  {
    path: '/forget/index',
    component: () => import('@/views/forget/index'),
    hidden: true
  },
  {
    path: '/forget/reset',
    component: () => import('@/views/forget/reset'),
    hidden: true
  },
  {
    path: '/forget/missed',
    component: () => import('@/views/forget/missed'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },
  {
    path: '/push',
    component: Layout,
    redirect: '/push/index',
    name: 'pusher',
    meta: { title: '????????????', icon: 'el-icon-s-promotion', perms: 'article:add' },
    children: [
      {
        path: 'index',
        name: 'pindex',
        component: () => import('@/views/push/index'),
        meta: { title: '????????????', icon: 'guide', perms: 'article:add' }
      }
    ]
  },
  {
    path: '/pushlist',
    component: Layout,
    redirect: '/pushlist/index',
    name: 'pushlist',
    meta: { title: '????????????', icon: 'el-icon-search', perms: 'article:list' },
    children: [
      {
        path: 'index',
        name: 'plindex',
        component: () => import('@/views/pushlist/index'),
        meta: { title: '????????????', icon: 'search', perms: 'article:list' }
      }
    ]
  },
  {
    path: '/postreview',
    component: Layout,
    // redirect: "/postreview/user_manage",
    name: 'postreview',
    meta: { title: '????????????', icon: 'el-icon-document', perms: 'article:list' },
    children: [
      {
        path: 'reviewer',
        name: 'reviewer',
        component: () => import('@/views/examine/reviewers'),
        meta: { title: '????????????????????????',  perms: 'article:list', icon: 'remind' }
      },
      {
        path: 'submitter',
        name: 'submitter',
        component: () => import('@/views/examine/submitter'),
        meta: { title: '????????????????????????',  perms: 'article:list', icon: 'remind' }
      },
    ]
  },
  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/index',
    name: 'resource',
    meta: { title: '????????????', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'index',
        name: 'resourcelist',
        component: () => import('@/views/resource/index'),
        meta: { title: '????????????', icon: 'list' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/index',
    name: 'statistics',
    meta: { title: '????????????', icon: 'el-icon-data-analysis' },
    children: [
      {
        path: 'index',
        name: 'myStatistics',
        component: () => import('@/views/statistics/index'),
        meta: { title: '????????????', icon: 'el-icon-data-analysis' }
      }
    ]
  },
  {
    path: '/podcast',
    component: Layout,
    redirect: '/podcast/index',
    name: 'mypodcast',
    meta: { title: '????????????', icon: 'podcast-list', perms: 'podcast:list' },
    children: [
      {
        path: 'index',
        name: 'mypodcastlist',
        component: () => import('@/views/podcast/index'),
        meta: { title: '????????????', icon: 'podcast-list', perms: 'podcast:list' }
      },
      {
        path: 'channel',
        name: 'mypodcastchannel',
        component: () => import('@/views/podcast/channel'),
        meta: { title: '????????????', icon: 'examine-podcast-list', perms: 'podcast:list' },
        hidden: true,
      }
    ]
  },
  {
    path: '/examinepodcast',
    component: Layout,
    redirect: '/examine-podcast/index',
    name: 'examinePodcast',
    meta: { title: '????????????', icon: 'podcast-list', perms: 'podcast:audit' },
    children: [
      {
        path: 'index',
        name: 'examinePodcast',
        component: () => import('@/views//examine-podcast/index'),
        meta: { title: '????????????', icon: 'examine-podcast-list', perms: 'podcast:audit' }
      }
    ]
  },
  // {
  //   path: '/podcast/channel',
  //   component: Layout,
  //   redirect: '/podcast/channel',
  //   // name: 'mypodcastchannel',
  //   children: [
  //     {
  //       path: 'channel',
  //       name: 'mypodcastchannel',
  //       component: () => import('@/views/podcast/channel'),
  //       meta: { title: '????????????', icon: '/examine-podcast-list' }
  //     }
  //   ]
  // },
  {
    path: '/myaccounts',
    component: Layout,
    redirect: '/myaccounts/index',
    name: 'myaccounts',
    meta: { title: '??????????????????', icon: 'el-icon-s-user' },
    children: [
      {
        path: 'index',
        name: 'myaccountsList',
        component: () => import('@/views/my-accounts/index'),
        meta: { title: '??????????????????', icon: 'user' }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: "/sys/user_manage",
    name: 'sys',
    meta: { title: '????????????', icon: 'el-icon-setting', perms: 'user:list' },
    children: [
      {
        path: 'user_manage',
        name: 'user_manage',
        component: () => import('@/views/user/index'),
        meta: { title: '????????????',  perms: 'user:list' }
      },
      {
        path: 'role_manage',
        name: 'role_manage',
        component: () => import('@/views/role/index'),
        meta: { title: '????????????',  perms: 'role:list' }
      },
      {
        path: 'permission_manage',
        name: 'permission_manage',
        component: () => import('@/views/permission/index'),
        meta: { title: '????????????',  perms: 'permission:list' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    name: 'profile',
    meta: { title: '????????????', icon: 'el-icon-s-user' },
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'profileIndex',
        component: () => import('@/views/profile/index'),
        meta: { title: '????????????', icon: 'user' }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/center',
    name: 'message',
    meta: { title: '????????????', icon: 'el-icon-s-promotion', perms: 'article:add' },
    children: [{
      path: 'center',
      name: 'center',
      component: () => import('@/views/message/index'),
      // meta: { title: 'Message', icon: 'account' }
    }]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/team',
    name: 'account',
    meta: { title: '????????????', icon: 'el-icon-s-promotion', perms: 'article:add' },
    children: [{
      path: 'team',
      name: 'team',
      component: () => import('@/views/team/index'),
      // meta: { title: 'team', icon: 'account' }
    }]
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/auth-redirect'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
