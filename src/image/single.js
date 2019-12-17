/**
 * 单页面测试主程序
 */
const dataHandler = require('../dataHandler')
const util = require('../util')

const single = async (index, browser, obj) => {
  let temp = {}
  let result = null
  let start = 0
  let end = 0
  const page = await browser.newPage()
  await page.waitFor(2000)
  try {
    page.setCacheEnabled(false)
    util.log(`【${obj.name}】进行第${index + 1}次测试`)
    start = new Date().getTime()
    await page.goto(obj.url, {
      timeout: 30000
    })
    end = new Date().getTime()
    let timeData = JSON.parse(await page.evaluate(
      () => JSON.stringify(window.performance.timing)
    ))
    temp = dataHandler(timeData)
    const totalTime = end - start
    result = {
      data: [
        index + 1,
        obj.name,
        obj.url,
        util.toDecimal(temp.domTime / 1000),
        util.toDecimal(temp.holeTime / 1000),
        util.toDecimal(totalTime / 1000),
      ],
      domTime: temp.domTime,
      holeTime: temp.domTime,
      totalTime,
    }
    util.log(`【${obj.name}】第${index + 1}次测试完成，结果：${totalTime} ms`, 'aquamarine')
  } catch (e) {
    util.log(`测试【${obj.name}】发生错误，原因：`, 'red', e)
    util.log(`【${obj.name}】第${index + 1}次测试完成，结果：超时`, 'aquamarine')
    result = {
      data: [
        index + 1,
        obj.name,
        obj.url,
        0,
        0,
        0,
      ],
      domTime: 0,
      holeTime: 0,
      totalTime: 0
    }
    page.close()
    return result
  }
  page.close()
  return result
}

module.exports = single