/*
 * @Author: zhang zhipeng
 * @Date: 2020-02-10 10:38:22
 * @Last Modified by: zhang zhipeng
 * @Last Modified time: 2020-02-10 15:05:21
 * 父子组件无法传递RegExp
 * 正则表达式要用数组的形式，然后用new RegExp(...regs)
 */

export const regs = {
  ID: ['(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)'], // 身份证
  phoneNum: ['^1\\d{10}$'], // 手机号
  email: ['^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$'] // 邮箱
}
