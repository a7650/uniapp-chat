import Vue from 'vue'

// 头像占用二维码的比例（头像宽/二维码宽）
export const AVATAR_SCALE_IN_QRCODE = 0.45

let imgCount = 0

export default class ImgHelpers {
    // 保存图片
    static saveImage(imagePath) {
        if (!imagePath) {
            return
        }
        Vue.prototype.$showLoading('正在保存')
        wx.saveImageToPhotosAlbum({
            filePath: imagePath,
            success: (res) => {
                Vue.prototype.$hideLoading()
                Vue.prototype.$toast('保存成功', 1500, 'success')
            },
            fail: (res) => {
                Vue.prototype.$hideLoading()
                if (res.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                    wx.showModal({
                        title: '您需要授予相册权限',
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting()
                            }
                        }
                    })
                }
            }
        })
    }
    // 预览图片
    static previewImage(list, index = 0) {
        if (typeof list === 'string') {
            list = [list]
        }
        uni.previewImage({
            urls: list,
            current: index
        })
    }
    // arrayBuffer转本地路径
    static arrayBufferToPath(buffer) {
        const fsm = wx.getFileSystemManager()
        return new Promise((resolve, reject) => {
            const FILE_BASE_NAME = `buffer_to_path_${imgCount++}`
            const filePath = wx.env.USER_DATA_PATH + '/' + FILE_BASE_NAME + '.jpg'
            const clearHandler = () => {
                fsm.unlink({
                    filePath
                })
            }
            wx.getSavedFileList({ // 获取文件列表
                success(res) {
                    res.fileList.forEach((val) => {
                        // 删除存储的垃圾数据
                        wx.removeSavedFile({
                            filePath: val.filePath
                        })
                    })
                    fsm.writeFile({
                        filePath,
                        data: buffer,
                        encoding: 'binary',
                        success() {
                            console.log('success', filePath)
                            resolve({ clearHandler, filePath })
                        },
                        fail() {
                            reject()
                        }
                    })
                }
            })
        })
    }

    /**
     * 计算头像的位置和大小
     * 位置是相对于二维码的位置，以二维码的左上角为顶点
     */
    static getAvatarPosition(qrCodeSize) {
        const width = qrCodeSize.width * AVATAR_SCALE_IN_QRCODE
        const height = qrCodeSize.height * AVATAR_SCALE_IN_QRCODE
        const top = (qrCodeSize.height - height) / 2
        const left = (qrCodeSize.width - width) / 2
        return { width, height, top, left }
    }
}
