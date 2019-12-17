/**
 * 页面初始化
 */
const util = require('../util')

const init = async (page, obj, quic) => {
  try {
    util.log(`【${obj.name}(${quic})】跳转到登录页面`)
    await page.goto(obj.url + obj.login, {
      timeout: 0
    })
    await page.waitForSelector('.ant-form', {
      timeout: 0
    })
    util.log(`【${obj.name}(${quic})】登录页面加载完成`)
    await page.type('#username', obj.username)
    await page.type('#password', obj.password)
    await page.waitFor(1000)
    await page.click('.ant-btn')
    util.log(`【${obj.name}(${quic})】输入用户名、密码，开始登录`)
  } catch (e) {
    util.log(`测试【${obj.name}(${quic})】发生错误，原因：打开登录页面失败`, 'red', e)
    return null
  }
  // 等到页面登录成功在执行接下来的操作，保证登录肯定成功
  try {
    await page.waitForNavigation({
      timeout: 0,
      waitUntil: 'networkidle0'
    })
    util.log(`【${obj.name}(${quic})】打开页面成功，开始缓存`)
  } catch (e) {
    util.log(`测试【${obj.name}(${quic})】发生错误，原因：登录超时`, e)
  }
}

module.exports = init