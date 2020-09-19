import request from './config'

const messageList = []

export function sendMessage(messageInstance) {
    return new Promise((resolve, reject) => {
        messageList.push({
            ...messageInstance,
            senderId: Math.random() < 0.5 ? messageInstance.senderId : String(Math.random()).substr(2),
            id: String(Math.random()).substr(2)
        })
        setTimeout(() => {
            Math.random() < 0.5 ? resolve() : reject()
        }, 500)
    })
}
let n = 5
export function loadMessage(form) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                messageList: messageList.map(item => {
                    item.id = String(Math.random()).substr(2)
                    return { ...item }
                }),
                hasMore: n-- > 0
            })
        }, 500)
    })
}
