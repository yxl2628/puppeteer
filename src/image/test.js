/**
 * 测试主程序
 */
const puppeteer = require('puppeteer')
const util = require('../util')
const single = require('./single')

const test = (async (options, obj, times) => {
  const result = []
  const avgTime = {
    domTime: 0,
    holeTime: 0,
    totalTime: 0
  }
  util.log(`【${obj.name}】打开浏览器`)
  let browser = await puppeteer.launch(options).catch((e) => {
    util.log(`测试【${obj.name}】发生错误，原因：打开浏览器失败`, 'red', e)
    browser.close()
    return test(options, obj, times)
  })
  try {
    util.log(`==============【${obj.name}】开始进行测试==============`, 'yellow')
    // 循环打开测试页面
    for (let j = 0; j < times; j++) {
      await single(j, browser, obj).then(res => {
        avgTime.domTime = avgTime.domTime + res.domTime
        avgTime.holeTime = avgTime.holeTime + res.holeTime
        avgTime.totalTime = avgTime.totalTime + res.totalTime
        result.push(res.data)
      })
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
      obj.name,
      obj.url,
      util.toDecimal((avgTime.domTime / realTimes) / 1000),
      util.toDecimal((avgTime.holeTime / realTimes) / 1000),
      util.toDecimal((avgTime.totalTime / realTimes) / 1000),
    ])
    result.push([
      '超时',
      obj.name,
      obj.url,
      `个数：${timeoutCount}`,
      `次数：${times}`,
      `百分比：${util.toDecimal(timeoutCount / times) * 100}%`,
    ])
    util.log(`==============【${obj.name}】测试执行完成==============`, 'yellow')
  } catch (e) {
    util.log(`测试【${obj.name}】发生错误，原因：`, 'red', e)
  }

  return result
})

module.exports = test