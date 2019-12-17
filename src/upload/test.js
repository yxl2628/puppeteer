/**
 * 测试主程序
 */
const puppeteer = require('puppeteer')
const util = require('../util')
const single = require('./single')

const test = (async (options, obj, round) => {
  const result = []
  util.log(`[${obj.name}]open browser`)
  let browser = await puppeteer.launch(options).catch((e) => {
    util.log(`[${obj.name}] has error, because：open the browser error`, 'red', e)
    browser.close()
    return test(options, obj, round)
  })
  try {
    util.log(`==============[${obj.name}]begin test round ${round}==============`, 'yellow')
    // 打开测试页面
    await single(round, browser, obj).then(res => {
      result.push(res.data)
    })
    util.log(`==============[${obj.name}]test round ${round} done==============`, 'yellow')
  } catch (e) {
    util.log(`[${obj.name}] has error, because:`, 'red', e)
  }
  browser.close()
  return result
})

module.exports = test