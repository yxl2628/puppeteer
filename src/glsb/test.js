/**
 * 测试主程序
 */
const puppeteer = require('puppeteer')
const util = require('../util')
const init = require('./init')
const single = require('./single')

const test = (async (options, obj, times, quic) => {
  const result = []
  const avgTime = {
    domTime: 0,
    holeTime: 0,
    totalTime: 0
  }
  util.log(`【${obj.name}(${quic})】打开浏览器`)
  let browser = await puppeteer.launch(options).catch((e) => {
    util.log(`测试【${obj.name}(${quic})】发生错误，原因：打开浏览器失败`, 'red', e)
    browser.close()
    return test(options, obj, times, quic)
  })
  // 打开新页面,进行登录操作
  if (quic) {
    try {
      await browser.newPage()
    } catch (e) { }
  }
  const page = await browser.newPage()
  init(page, obj, quic)
  util.log(`【${obj.name}(${quic})】为了保证时间一致，统一等待一段时间`)
  // 浏览器等待时间
  await page.waitFor(600000)
  try {
    util.log(`==============【${obj.name}(${quic})】开始进行测试==============`, 'yellow')
    util.log('测试说明：先进入欢迎页，然后在跳转到待测试页面，这样能够有效的测试用户常规行为（即保留浏览器缓存），以保证测试结果的准确。', 'gray')
    // 循环打开测试页面
    for (let j = 0; j < times; j++) {
      single(j, page, obj, quic).then(res => {
        avgTime.domTime = avgTime.domTime + res.domTime
        avgTime.holeTime = avgTime.holeTime + res.holeTime
        avgTime.totalTime = avgTime.totalTime + res.totalTime
        result.push(res.data)
      })
      await page.waitFor(20000)
    }
    let timeoutCount = 0
    for (let c = 1; c < result.length; c++) {
      if (result[c][5] === 0) {
        timeoutCount++;
      }
    }
    const realTimes = times - timeoutCount
    result.push([
      '平均值',
      obj.name + '(' + quic + ')',
      obj.url,
      util.toDecimal((avgTime.domTime / realTimes) / 1000),
      util.toDecimal((avgTime.holeTime / realTimes) / 1000),
      util.toDecimal((avgTime.totalTime / realTimes) / 1000),
    ])
    result.push([
      '超时',
      obj.name + '(' + quic + ')',
      obj.url,
      `个数：${timeoutCount}`,
      `次数：${times}`,
      `百分比：${util.toDecimal(timeoutCount / times) * 100}%`,
    ])
    util.log(`==============【${obj.name}(${quic})】测试执行完成==============`, 'yellow')
  } catch (e) {
    util.log(`测试【${obj.name}(${quic})】发生错误，原因：`, 'red', e)
  }

  return result
})

module.exports = test