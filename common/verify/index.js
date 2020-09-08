/*
 * @Author: zhang zhipeng
 * @Date: 2020-02-10 10:37:46
 * @Last Modified by: zhang zhipeng
 * @Last Modified time: 2020-07-24 14:42:12
 */

import { regs as verifyRules } from './verifyRules'

class Verify {
    constructor(value) {
        this.value = value
        this.errorMessageStack = []
        this.errorFlag = false
    }
    get errorMessage() {
        return this.errorMessageStack.join('/')
    }
    require(msg) {
        if (!this.value) {
            this.errorMessageStack.unshift(msg)
            this.errorFlag = true
        }
        return this
    }
    test(reg, msg) {
        if (this.value && !reg.test(this.value)) {
            this.errorMessageStack.push(msg)
            this.errorFlag = true
        }
        return this
    }
}

const verifyCollection = {
    phoneNum(value, error) {
        const verifyInstance = new Verify(value).test(...verifyRules.phoneNum, '手机号格式错误')
        if (verifyInstance.errorFlag) {
            error(verifyInstance.errorMessage)
        }
    },
    email(value, error) {
        const verifyInstance = new Verify(value).test(...verifyRules.email, '邮箱格式错误')
        if (verifyInstance.errorFlag) {
            error(verifyInstance.errorMessage)
        }
    }
}

export default verifyName => verifyCollection[verifyName]
