const log4js = require('log4js')
const chalk = require('chalk')

log4js.configure({
  appenders: { output: { type: 'file', filename: './src/result/output.log' } },
  categories: { default: { appenders: ['output'], level: 'info' } }
})
const logger = log4js.getLogger('output')

/**
 * 工具类
 */
// 获取.000格式的小数
const toDecimal = (x) => {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  f = Math.round(x * 1000) / 1000;
  return f;
}

const log = (log, color = 'limegreen', e) => {
  if (e) {
    logger.info(chalk.keyword(color)(log), e)
    console.log(chalk.keyword(color)(log), e)
  } else {
    logger.info(chalk.keyword(color)(log))
    console.log(chalk.keyword(color)(log))
    
  }
}

module.exports = { 
  toDecimal,
  log
}