import request from '@/utils/request'

//notice list
export function getListNotice(data) {
    return request({
        url: '/message/getlist',
        method: 'post',
        data
    })
}

//read notice
export function readNotice(data) {
    return request({
        url: '/message/read',
        method: 'put',
        data
    })
}

//invite notice
export function inviteNotice() {
    return request({
        url: `/message/invite/getlist`,
        method: 'post',
    })
}
export function isAccept(data) {
    return request({
        url: `/member/isAccept`,
        method: 'post',
        data
    })
}

















