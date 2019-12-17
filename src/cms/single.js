/*
 * @Author: yangxl 
 * @Date: 2019-12-17 14:05:18 
 * @Last Modified by: yangxl
 * @Last Modified time: 2019-12-17 15:13:40
 */

const path = require('path')
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
    util.log(`${obj.name}-round${index} begin test`)
    start = new Date().getTime()
    await page.goto(obj.url + obj.main, { timeout: 0 })
    frame = page.frames().find(frame => frame.name() === 'contentFrame')
    await frame.waitForSelector('.ant-pagination-total-text', {
      timeout: 30000
    })
    end = new Date().getTime()
    let timeData = JSON.parse(await frame.evaluate(
      () => JSON.stringify(window.performance.timing)
    ))
    temp = dataHandler(timeData)
    const totalTime = end - start
    result = {
      data: [
        index,
        obj.name + '(' + obj.quic + ')',
        obj.url,
        util.toDecimal(temp.domTime / 1000),
        util.toDecimal(temp.holeTime / 1000),
        util.toDecimal(totalTime / 1000),
      ],
      domTime: temp.domTime,
      holeTime: temp.domTime,
      totalTime,
    }
    util.log(`${obj.name}-round${index} test complete, timing: ${totalTime}`)
    // await page.screenshot({ path: path.resolve(__dirname, `../result/${obj.name}-round${index}.png`) })
    await page.waitFor(2000)
  } catch (e) {
    util.log(`test [${obj.name}] has error, because: `, 'aquamarine', e)
    util.log(`[${obj.name}]round ${index} test done，result：timeout`, 'aquamarine')
    result = {
      data: [
        index,
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
    return result
  }
  return result
}

module.exports = single