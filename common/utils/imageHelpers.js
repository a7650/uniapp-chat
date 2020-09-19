import Vue from 'vue'

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
    static getImageInfo(src) {
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src,
                success(res) {
                    resolve(res)
                },
                fail(err) {
                    reject(err)
                }
            })
        })
    }
}
