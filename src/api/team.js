import request from '@/utils/request'
//查询列表
export function itemGetList(data) {
    return request({
      url: 'member/getList',
      method: 'post',
      data
    })
  }
 //选择团队
 export function getListByUserId(id) {
    return request({
      url: `team/getListByUserId/${id}`,
      method: 'post',
    })
  }

  //获取权限
  export function getMemberRole() {
    return request({
      url: `member/getMemberRole`,
      method: 'post',
    })
  }

   //获取社交账号
    export function getMyoauthUserList(data) {
        return request({
          url: `member/getMyoauthUserList`,
          method: 'post',
          data
        })
      }
      //list 启用停用
      export function updateMemberStatus(data) {
        return request({
          url: `member/updateMemberStatus`,
          method: 'post',
          data
        })
      }
      //确定修改队名
        export function updateTeam(data) {
            return request({
              url: `team/updateTeam`,
              method: 'post',
              data
            })
          }
    //提交删除用户
    export function deleteMember(data) {
        return request({
          url: `member/deleteMember`,
          method: 'post',
          data
        })
      }
      //修改社交账号
      export function getOauthUserListByMemberId(data) {
        return request({
          url: `member/getOauthUserListByMemberId`,
          method: 'post',
          data
        })
      }
      //修改提交社交账号
      export function updateMemberOathUser(data) {
        return request({
          url: `member/updateMemberOathUser`,
          method: 'post',
          data
        })
      }
      
      //提交修改权限
      export function updateMemberRole(data) {
        return request({
          url: `member/updateMemberRole`,
          method: 'post',
          data
        })
      }
      //再次邀请
      export function againInvitation(data) {
        return request({
          url: `member/againInvitation`,
          method: 'post',
          data
        })
      }
      //邮箱验证
      export function isExist(data) {
        return request({
          url: `member/isExist`,
          method: 'post',
          data
        })
      }
       //邀请用户
      export function addMeber(data) {
        return request({
          url: `member/addMeber`,
          method: 'post',
          data
        })
      }
       //邀请用户
      export function isOffOauthUserBinding(data) {
        return request({
          url: `member/isOffOauthUserBinding`,
          method: 'post',
          data
        })
      }

       //查询当前用户所在组
      export function queryMyteams() {
        return request({
          url: '/team/myteams',
          method: 'get'
        })
      }


    