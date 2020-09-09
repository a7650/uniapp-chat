export function sendMessage(messageInstance) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() < 0.5 ? resolve() : reject()
        }, 500)
    })
}
