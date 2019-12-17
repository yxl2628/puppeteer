/*
 * @Author: yangxl
 * @Date: 2019-12-17 14:00:57 
 * @Last Modified by:   yangxl
 * @Last Modified time: 2019-12-17 14:00:57 
 */

const path = require('path')
const dataHandler = require('../dataHandler')
const util = require('../util')

const init = async (browser, obj) => {
  try {
    util.log(`[${obj.name}(${obj.quic})] open login page`)
    const page = (await browser.pages())[0]
    await page.waitFor(2000)
    await page.goto(obj.url + obj.login, {
      timeout: 0
    })
    await page.waitForSelector('#loginForm', {
      timeout: 0
    })
    util.log(`[${obj.name}(${obj.quic})] login page loaded, begin login`)
    await page.type('[name=username]', obj.username)
    await page.type('[name=password]', obj.password)
    await page.click('.btn')
    util.log(`[${obj.name}(${obj.quic})] input username and password, begin login`)
    await page.waitForNavigation({
      timeout: 0,
      waitUntil: 'networkidle0'
    })
    let frame = page.frames().find(frame => frame.name() === 'contentFrame')
    util.log(`[${obj.name}(${obj.quic})] open welcome page success, begin first load`)
    const firstStart = new Date().getTime()
    let firstEnd = 0
    await page.goto(obj.url + obj.main, {
      timeout: 0
    })
    frame = page.frames().find(frame => frame.name() === 'contentFrame')
    await frame.waitForSelector('.ant-pagination-total-text', {
      timeout: 0
    })
    firstEnd = new Date().getTime()
    const timeData = JSON.parse(await page.evaluate(
      () => JSON.stringify(window.performance.timing)
    ))
    const temp = dataHandler(timeData)
    util.log(`[${obj.name}(${obj.quic})] open the waited-test page success, begin remove the poster`)
    let items = await frame.$$('.ant-dropdown-menu-item')
    while (items.length === 0) {
      await frame.waitFor(1000)
      await frame.hover('.ant-btn-group.ant-dropdown-button > .ant-btn.ant-dropdown-trigger.ant-btn-default')
      items = await frame.$$('.ant-dropdown-menu-item')
    }
    await frame.hover('li.ant-dropdown-menu-item:nth-child(2) .ant-checkbox')
    await frame.click('li.ant-dropdown-menu-item:nth-child(2) .ant-checkbox')
    const result = {
      data: [
        'first',
        obj.name + '(' + obj.quic + ')',
        obj.url,
        util.toDecimal(temp.domTime / 1000),
        util.toDecimal(temp.holeTime / 1000),
        util.toDecimal((firstEnd - firstStart) / 1000),
      ],
      domTime: temp.domTime,
      holeTime: temp.domTime,
      totalTime: firstEnd - firstStart,
    }
    util.log(`[${obj.name}(${obj.quic})] page init complete, begin test`)
    return result;
  } catch(e) {
    util.log(`[${obj.name}(${obj.quic})] has error`, 'red', e);
    return;
  }
}

module.exports = init;