import request from '@/utils/request'

export function pushContent(data) {
  return request({
    url: '/push/pushcontent',
    method: 'post',
    data
  })
}


export function pushContentSubmit(data) {
  return request({
    url: '/push/submit',
    method: 'post',
    data
  })
}

export function pushTopic(data) {
  return request({
    url: '/push/pushtopic',
    method: 'post',
    data
  })
}

export function queryPushContent(data) {
  return request({
    url: '/push/pushcontents',
    method: 'post',
    data 
  })
}

export function queryTopicPageViews(data) {
  return request({
    url: '/push/querytopicpageviews',
    method: 'post',
    data 
  })
}

//querypushtopic
export function queryPushTopic(data) {
  return request({
    url: '/push/querypushtopic',
    method: 'post',
    data 
  })
}

//querypushcontents
export function queryPushContents(data) {
  return request({
    url: '/push/querypushcontents',
    method: 'post',
    data 
  })
}

export function deletePushContent(data) {
  return request({
    url: '/push/deletepushcontent',
    method: 'post',
    data 
  })
}

export function deletePushTopic(data) {
  return request({
    url: '/push/deletepushtopic',
    method: 'post',
    data 
  })
}


export function uploadPush(data) {
  return request({
    url: `${process.env.VUE_APP_BASE_API}/resource/upload`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data 
  })
}

// export function getUserPushCountToday() {
//   return request({
//     url: '/push/userPushCountToday',
//     method: 'get'
//   })
// }

export function getUserPushCount(params) {
  return request({
    url: '/user_push_report/push_count',
    method: 'get',
    params
  })
}

// export function getUserTodayTotalSocialCount() {
//   return request({
//     url: '/push/userTodayTotalSocialCount',
//     method: 'get'
//   })
// }
export function getUserTotalSocialCount(params) {
  return request({
    url: '/user_push_report/push_interactions',
    method: 'get',
    params
  })
}

export function getSocialAccountTodayTotalSocialCount(data) {
  return request({
    url: '/push/socialAccountTodayTotalSocialCount',
    method: 'post',
    data
  })
}

export function getSocialAccountPushCount(data) {
  return request({
    url: '/push/socialAccountPushCount',
    method: 'post',
    data
  })
}

export function querypushcontentsocialcount(data) {
  return request({
    url: '/push/querypushcontentsocialcount',
    method: 'post',
    data
  })
}

export function getByUrl(data) {
  return request({
    url: '/networkResource/getData',
    method: 'get',
    params: {pl: data.pl, type: data.type, article_id: data.article_id}
  })
}

export function getFansCount(data) {
  return request({
    url: '/oauthUserFans/getFansCount',
    method: 'post',
    params: {startTime: data.startTime, endTime: data.endTime}
  })
}


export function getTeamUser(id) {
  return request({
    url: '/team/getListByUserId/' + id,
    method: 'post'
  })
}


export function getMemberUser(data) {
  return request({
    url: '/member/getOauthUserList',
    method: 'post',
    data
  })
}


/***
 * 临时替换全球排行榜
 * **/
export function getNews() {
  return request({
    url: '/hot_news/get_imp_news',
    method: 'get'
  })
}



