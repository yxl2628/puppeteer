/**
 * 测试前参数初始化设置
 */
const test = require('./test')
const list = require('./list')
const output = require('../output')
const dayjs = require('dayjs')

const times = 1000  // 单个页面循环次数
const headless = false // 是否启用无头模式， true，不会出现浏览器，后台静默执行脚本，设置为false后会自动弹浏览器执行脚本

const main = (async (quic) => {
  const result = []
  const today = dayjs().format('MM-DD-HH-mm')
  const options = {
    ignoreHTTPSErrors: true, // 忽略https错误
    headless, 
    defaultViewport: {
      width: 1200,
      height: 1080
    },
    args: [
      '--window-size=1760,1080',
      quic ? '--enable-quic' : '--disable-quic',
      `--log-net-log=/Users/root/Downloads/glsb-${quic}-${today}.json`
    ],
    devtools: !headless // 默认打开开发者工具
  }
  for (let i = 0; i < list.length; i++) {
    result.push(await test(options, list[i], times, quic))
  }
  output(result, `glsb-${quic}`) // 导出为xlsx文件
})

module.exports = main