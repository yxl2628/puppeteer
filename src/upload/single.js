/**
 * 单页面测试主程序
 */
const path = require('path')
const dataHandler = require('../dataHandler')
const util = require('../util')

const single = async (index, browser, obj) => {
  let temp = {}
  let result = null
  let start = 0
  let end = 0
  const page = (await browser.pages())[0]
  await page.waitFor(2000)
  try {
    page.setCacheEnabled(false)
    await page.goto(obj.url, { timeout: 0 })
    let timeData = JSON.parse(await page.evaluate(
      () => JSON.stringify(window.performance.timing)
    ))
    temp = dataHandler(timeData)
    const uploadElement = await page.$("input[type=file]")
    start = new Date().getTime()
    util.log(`[${obj.name}]begin upload`)
    const parent = path.resolve(__dirname, '../../data')
    await uploadElement.uploadFile(
      path.resolve(parent, 'test1.docx'), 
      path.resolve(parent, 'test2.docx'), 
      path.resolve(parent, 'test3.docx'), 
      path.resolve(parent, 'test4.docx'), 
      path.resolve(parent, 'test5.docx'), 
      // path.resolve(parent, 'test1.ts'), 
      // path.resolve(parent, 'test2.ts'), 
      // path.resolve(parent, 'test3.ts'), 
      // path.resolve(parent, 'test4.ts'), 
      // path.resolve(parent, 'test5.ts')
    )
    await page.waitForSelector('.done', {
      timeout: 0,
      visible: true
    })
    end = new Date().getTime()
    util.log(`[${obj.name}]upload done`)
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
    await page.screenshot({ path: path.resolve(__dirname, `../result/${obj.name}-round${index + 1}.png`) })
    await page.waitFor(2000)
  } catch (e) {
    util.log(`test [${obj.name}] has error, because: `, 'red', e)
    util.log(`[${obj.name}]round ${index + 1} test done，result：timeout`, 'aquamarine')
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
    return result
  }
  return result
}

module.exports = single