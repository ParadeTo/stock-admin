import fs from 'fs'
import os from 'os'
import iconv from 'iconv-lite'

// date: date obj or ts
export const format = (date, format = 'DD-MM-YYYY') => {
  date = new Date(date)
  var dateObj = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S+': date.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in dateObj) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? dateObj[k] : ('00' + dateObj[k]).substr(('' + dateObj[k]).length))
    }
  }
  return format
}

export const writeSummaryOutIn = (filename, dataMap) => {
  const EOL = os.EOL
  let writeData = `商品名称,入库数量,出库数量${EOL}`
  for (let k in dataMap) {
    writeData += `${k},${dataMap[k].inStockNum},${dataMap[k].outStockNum}${EOL}`
  }
  writeData = iconv.encode(writeData, 'gbk')
  fs.writeFileSync(filename, writeData)
}
