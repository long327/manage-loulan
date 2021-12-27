import request from '@/utils/request'

export function getStatisticsByPlatform(data) {
    return request({
        url: '/data/userWorkloadStatisticsByPlatform',
        method: 'post',
        data
    })
}

export function getStatisticsBySocialAccount(data) {
    return request({
        url: '/data/userWorkloadStatisticsBySocialAccount',
        method: 'post',
        data
    })
}

export function getStatisticsByDate(data) {
    return request({
        url: '/data/userWorkloadStatisticsByDate',
        method: 'post',
        data
    })
}
