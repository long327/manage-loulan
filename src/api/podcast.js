import request from '@/utils/request'

export function getLanguages() {
    return request({
        url: '/channel/languages',
        method: 'get'
    })
}


export function addChannel(data) {
    return request({
        url: '/channel/insert',
        method: 'post',
        data 
    })
}


export function addChannelItem(data) {
    return request({
        url: '/channel_item/insert',
        method: 'post',
        data 
    })
}


export function queryChannel(data) {
    return request({
        url: '/channel/search',
        method: 'post',
        data 
    })
}


export function queryChannelItem(data) {
    return request({
        url: '/channel_item/search',
        method: 'post',
        data
    })
}


export function getPodcast(data) {
    return request({
        url: '/podcast_setting',
        method: 'get'
    })
}


export function setPodcast(data) {
    return request({
        url: '/podcast_setting/update',
        method: 'post',
        data
    })
}


export function updatePodcast(data) {
    return request({
        url: '/channel/update',
        method: 'put',
        data
    })
}

export function deletePodcast(data) {
    return request({
        url: '/channel/delete',
        method: 'delete',
        params: data
    })
}


//审核
export function getAuditList(data) {
    return request({
        url: '/channel/auditList',
        method: 'post',
        data
    })
}
export function channelApply(data) {
    return request({
        url: '/channel/apply',
        method: 'post',
        data
    })
}
export function channelAudit(data) {
    return request({
        url: '/channel/audit',
        method: 'put',
        data
    })
}

export function getSingle(data) {
    return request({
        url: '/channel/single',
        method: 'post',
        data
    })
}
