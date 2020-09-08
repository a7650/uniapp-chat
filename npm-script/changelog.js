/*
 * @Author: zhang zhipeng
 * @Date: 2020-02-01 22:04:25
 * @Last Modified by: zhang zhipeng
 * @Last Modified time: 2020-02-21 23:31:24
 *
 * 该文件使用conventional-changelog自动生成changelog.md文件，
 * 每次commit需要遵循angular的commit规范，以保证能被程序识别
 */

const conventionalChangelog = require('conventional-changelog')
const fs = require('fs')

const writerStream = fs.createWriteStream('changelog.md') // 创建一个写入流，到./changelog.md文件

conventionalChangelog({
    preset: 'angular'
}).pipe(writerStream)
