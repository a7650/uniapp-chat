/*
 * @Author: zhang zhipeng
 * @Date: 2020-06-17 18:49:38
 * @Last Modified by: zhang zhipeng
 * @Last Modified time: 2020-06-17 20:01:23
 */

export default class FormData {
    constructor(obj) {
        this.result = ''
        if (obj) {
            for (const name of Object.keys(obj)) {
                const value = obj[name]
                this.append(name, value)
            }
        }
    }
    append(name, value) {
        this.result +=
            '\r\n--XXX' +
            '\r\nContent-Disposition: form-data; name=\"' + name + '\"' +
            '\r\n' +
            '\r\n' + value
    }
    get data() {
        return this.result + '\r\n--XXX--'
    }
}
