/**
 * 结果输出到excle
 */
const fs = require('fs')
const xlsx = require('node-xlsx')
const dayjs = require('dayjs')

const output = (async (timeData, quic = '') => {
  let data = [['number', 'owner', 'link', 'frist/s', 'first dom/s', 'total/s']]
  let len = timeData.length
  for (let i = 0; i < len; i++) {
    data = data.concat(timeData[i])
    data.push(['', '', '', '', '', ''])
  }
  const xlsxOption = { '!cols': [{ wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }] }
  var buffer = xlsx.build([{ name: "mySheetName", data: data }], xlsxOption); // Returns a buffer
  const time = dayjs().format('MM-DD-HH-mm') + '-' + quic
  fs.writeFileSync(`./src/result/${time}.xlsx`, buffer, 'binary')
})

module.exports = output