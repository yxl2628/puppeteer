/*
 * @Author: yangxl
 * @Date: 2019-12-17 14:02:27 
 * @Last Modified by: yangxl
 * @Last Modified time: 2019-12-17 15:14:21
 */
const path = require('path')
const os = require('os')
const test = require('./test')
const list = require('./list')
const output = require('../output')
const util = require('../util')

const times = 50 // Cycles
const headless = true // is header less? ture: no ui start; false: show you the ui

const chromePath = {
  'use': false,
  'win32': '../../chrome-win/chrome.exe',
  'linux': '../../chrome-linux/chrome',
  'darwin': null, // max
}

const main = (async () => {
  const result = []
  // puppeteer download url：https://download-chromium.appspot.com/

  const options = {
    ignoreHTTPSErrors: true, // ignore https error
    headless,
    defaultViewport: {
      width: 1200,
      height: 800
    },
    args: [],
    devtools: !headless // default dev tools
  }
  // if user ex chrome , change the chrome
  if (chromePath.use && chromePath[os.platform()]) {
    options.executablePath = path.resolve(__dirname, chromePath[os.platform()])
  }
  const resultObj = {}
  for (let i = 0; i < list.length; i++) {
    const obj = list[i]
    if (obj.quic) {
      options.args = [
        '--window-size=1760,800',
        '--no-sandbox',  // fixed linux root user start chrome
        '--disable-setuid-sandbox',  // fixed linux root user start chrome
        '--enable-quic',
        '--quic-version=h3-Q043',
        '--origin-to-force-quic-on=' + obj.host,
        `--log-net-log=${path.resolve(__dirname, `../result/${obj.name}-chrome-log.json`)}`
      ]
    } else {
      options.args = [
        '--window-size=1760,800',
        '--no-sandbox',  // fixed linux root user start chrome
        '--disable-setuid-sandbox',  // fixed linux root user start chrome
        '--disable-quic',
        `--log-net-log=${path.resolve(__dirname, `../result/${obj.name}-chrome-log.json`)}`
      ]
    }
    if (!resultObj[obj.name]) {
      resultObj[obj.name] = []
    }
    resultObj[obj.name] = resultObj[obj.name].concat(await test(options, obj, times))
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
      'avg',
      obj.name,
      obj.url,
      util.toDecimal(avgTime.domTime / realTimes),
      util.toDecimal(avgTime.holeTime / realTimes),
      util.toDecimal(avgTime.totalTime / realTimes),
    ])
    resultObj[obj.name].push([
      'timeout',
      obj.name,
      obj.url,
      `number：${timeoutCount}`,
      `times：${times}`,
      `percent：${util.toDecimal(timeoutCount / times) * 100}%`,
    ])
    result.push(resultObj[obj.name])
  }
  output(result) // export xlsx file
})

module.exports = main