/**
 * 单页面测试主程序
 */
const dataHandler = require('../dataHandler')
const util = require('../util')

const single = async (index, page, obj, quic) => {
  let temp = {}
  let result = null
  let start = 0
  let end = 0
  try {
    util.log(`【${obj.name}(${quic})】进行第${index + 1}次测试`)
    await page.goto('about:blank', {
      timeout: 0
    })
    await page.waitFor(1000)
    start = new Date().getTime()
    try {
      await page.goto(obj.url + obj.main, {
        timeout: 0
      })
      await page.waitForSelector('.ant-pagination-item-active', {
        timeout: 5000
      })
    } catch (e) {
      util.log(`【${obj.name}(${quic})】第${index + 1}次测试，发生一次错误，准备重试连接`)
      await page.goto('about:blank', {
        timeout: 0
      })
      await page.goto(obj.url + obj.main, {
        timeout: 0
      })
      await page.waitForSelector('.ant-pagination-item-active', {
        timeout: 5000
      })
    }
    end = new Date().getTime()
    let timeData = JSON.parse(await page.evaluate(
      () => JSON.stringify(window.performance.timing)
    ))
    temp = dataHandler(timeData)
    const totalTime = end - start
    result = {
      data: [
        index + 1,
        obj.name + '(' + quic + ')',
        obj.url,
        util.toDecimal(temp.domTime / 1000),
        util.toDecimal(temp.holeTime / 1000),
        util.toDecimal(totalTime / 1000),
      ],
      domTime: temp.domTime,
      holeTime: temp.domTime,
      totalTime,
    }
    util.log(`【${obj.name}(${quic})】第${index + 1}次测试完成，结果：${totalTime} ms`, 'aquamarine')
  } catch (e) {
    util.log(`测试【${obj.name}(${quic})】发生错误，原因：`, 'red', e)
    util.log(`【${obj.name}(${quic})】第${index + 1}次测试完成，结果：超时`, 'aquamarine')
    result = {
      data: [
        index + 1,
        obj.name + '(' + quic + ')',
        obj.url,
        0,
        0,
        0,
      ],
      domTime: 0,
      holeTime: 0,
      totalTime: 0
    }
    return result
  }
  return result
}

module.exports = single