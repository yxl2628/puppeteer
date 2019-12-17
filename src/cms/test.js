/*
 * @Author: yangxl 
 * @Date: 2019-12-17 14:05:28 
 * @Last Modified by:   yangxl 
 * @Last Modified time: 2019-12-17 14:05:28 
 */

const puppeteer = require('puppeteer')
const util = require('../util')
const init = require('./init')
const single = require('./single')

const test = (async (options, obj, times) => {
  const result = []
  util.log(`[${obj.name}] open browser`)
  const browser = await puppeteer.launch(options).catch((e) => {
    util.log(`[${obj.name}] has error, because：open the browser error`, 'red', e)
    browser.close()
    return test(options, obj).then(res => {
      result.push(res.data)
    })
  })
  util.log(`[${obj.name}(${obj.quic})] begin test, login first`);
  await init(browser, obj);
  for (let round = 1; round <= times; round++) {
    try {
      util.log(`==============[${obj.name}]begin test round ${round}==============`, 'yellow')
      await single(round, browser, obj).then(res => {
        result.push(res.data)
      })
      util.log(`==============[${obj.name}]test round ${round} done==============`, 'yellow')
    } catch (e) {
      util.log(`[${obj.name}] round ${round} has error, because:`, 'red', e)
    }
  }
  browser.close()
  return result
})

module.exports = test