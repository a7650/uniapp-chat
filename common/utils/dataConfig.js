/*
 * @Author: zhang zhipeng
 * @Date: 2020-02-01 17:26:51
 * @Last Modified by: zhang zhipeng
 * @Last Modified time: 2020-08-25 10:44:55
 */

export const ENV = 'test' // 当前环境 test/production

export const APPID = ''

function arrayToMap(arr) {
    return arr.reduce((pre, cur) => {
        pre[cur.value] = cur.label
        return pre
    }, {})
}

function genFilter(dataSource) {
    return (value = '') => (dataSource[value] || value || '')
}

// 订单状态
export const orderStatus = [{
        label: '已创建',
        value: 'CREATED'
    },
    {
        label: '提交前',
        value: 'PRE_SUBMIT'
    },
    {
        label: '供应商在提交时处理',
        value: 'VENDOR_PROCESSING_ON_SUBMIT'
    },
    {
        label: '供应商在提交时处理失败',
        value: 'VENDOR_PROCESSED_ON_SUBMIT_FAILED'
    },
    {
        label: '等待付款',
        value: 'WAITING_PAY'
    },
    {
        label: '已付款',
        value: 'PAID'
    },
    {
        label: '已发货',
        value: 'DELIVERED'
    },
    {
        label: '已取消',
        value: 'CANCEL'
    },
    {
        label: '已签收',
        value: 'RECEIVED'
    },
    {
        label: '已签收',
        value: 'CONFIRM_COMMISSION'
    }
]

export const orderStatusMap = arrayToMap(orderStatus)

export const orderStatusFilter = genFilter(orderStatusMap)

// 抵用券状态
export const couponStatus = [{
        label: '已领取',
        value: 'ACCEPTED'
    },
    {
        label: '已使用',
        value: 'LOCKED'
    },
    {
        label: '已使用',
        value: 'USED'
    }
]

export const couponStatusMap = arrayToMap(couponStatus)

export const couponStatusFilter = genFilter(couponStatusMap)
