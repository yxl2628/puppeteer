/**
 * 测试前参数初始化设置
 */
const path = require('path')
const os = require('os')
const test = require('./test')
const list = require('./list')
const output = require('../output')
const util = require('../util')

const times = 5  // 单个页面循环次数
const headless = true // 是否启用无头模式， true，不会出现浏览器，后台静默执行脚本，设置为false后会自动弹浏览器执行脚本
const wait = 30 * 1000 // 等待时间，默认是30s

const chromePath = {
  'win32': '../../chrome-win/chrome.exe',
  'linux': '../../chrome-linux/chrome',
  'darwin': null, // 苹果系统暂时不启用外部浏览器
}

const main = (async () => {
  const result = []
  // puppeteer下载地址：https://download-chromium.appspot.com/

  const options = {
    ignoreHTTPSErrors: true, // 忽略https错误
    headless,
    defaultViewport: {
      width: 1200,
      height: 800
    },
    args: [],
    devtools: !headless // 默认打开开发者工具
  }
  // 如果是windows或者linux，那么启用外部浏览器
  if (chromePath[os.platform()]) {
    options.executablePath = path.resolve(__dirname, chromePath[os.platform()])
  }
  const resultObj = {}
  for (let round = 0; round < times; round++) {
    for (let i = 0; i < list.length; i++) {
      const obj = list[i]
      if (round === 0) {
        resultObj[obj.name] = []
      }
      if (obj.quic) {
        options.args = [
          '--window-size=1760,800',
          '--no-sandbox',  // fixed linux root user start chrome
          '--disable-setuid-sandbox',  // fixed linux root user start chrome
          '--enable-quic',
          '--quic-version=h3-Q043',
          '--origin-to-force-quic-on=' + obj.host,
          `--log-net-log=${path.resolve(__dirname, `../result/${obj.name}-chrome-log-${round}.json`)}`
        ]
      } else {
        options.args = [
          '--window-size=1760,800',
          '--no-sandbox',  // fixed linux root user start chrome
          '--disable-setuid-sandbox',  // fixed linux root user start chrome
          '--disable-quic',
          `--log-net-log=${path.resolve(__dirname, `../result/${obj.name}-chrome-log-${round}.json`)}`
        ]
      }
      resultObj[obj.name] = resultObj[obj.name].concat(await test(options, obj, round))
    }
    if (round != times - 1) {
      // 每轮结束后，等待时长
      util.log(`================ wait ${wait / 1000}s for next test round ================`, 'slateblue')
      await sleep(wait)
    }
  }
  for (let i = 0; i < list.length; i++) {
    const obj = list[i]
    const avgTime = {
      domTime: 0,
      holeTime: 0,
      totalTime: 0
    }
    let timeoutCount = 0
    for (let c = 0; c < resultObj[obj.name].length; c++) {
      const item = resultObj[obj.name][c]
      avgTime.domTime = avgTime.domTime + item[3]
      avgTime.holeTime = avgTime.holeTime + item[4]
      avgTime.totalTime = avgTime.totalTime + item[5]
      if (item[5] === 0) {
        timeoutCount++;
      }
    }
    const realTimes = times - timeoutCount
    resultObj[obj.name].push([
      '平均值',
      obj.name,
      obj.url,
      util.toDecimal(avgTime.domTime / realTimes),
      util.toDecimal(avgTime.holeTime / realTimes),
      util.toDecimal(avgTime.totalTime / realTimes),
    ])
    resultObj[obj.name].push([
      '超时',
      obj.name,
      obj.url,
      `个数：${timeoutCount}`,
      `次数：${times}`,
      `百分比：${util.toDecimal(timeoutCount / times) * 100}%`,
    ])
    result.push(resultObj[obj.name])
  }
  output(result) // 导出为xlsx文件
})

const sleep = async (time = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  })
}

module.exports = main