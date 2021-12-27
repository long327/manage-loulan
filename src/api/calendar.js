import request from '@/utils/request'

export function getCalendarCount() {
    return request({
        url: '/calendar_event',
        method: 'get',
    })
}
export function addCalendar(data) {
    return request({
        url: '/calendar_event/insert',
        method: 'post',
        data
    })
}

export function updateCalendar(data) {
    return request({
        url: '/calendar_event/update',
        method: 'put',
        data
    })
}

export function deleteCalendar(data) {
    return request({
        url: '/calendar_event/delete',
        method: 'delete',
        params: data
    })
}


















