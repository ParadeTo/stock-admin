
import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

console.log(remote.app.getPath('userData'))

const db = {}

db.goods = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/goods.db')
})

db.out = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/out.db')
})

// out
db.out.insertOutRecord = ({goodsId, number}) => {
  return new Promise((resolve, reject) => {
    db.out.insert({goodsId, number, outTime: new Date().getTime()}, (err, res) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res)
    })
  })
}

db.out.findByQuery = query => {
  return new Promise((resolve, reject) => {
    db.out.find(query, (err, res) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res)
    })
  })
}

// goods
db.goods.getFields = () => {
  const names = new Set()
  const types = new Set()
  const providers = new Set()
  const manufacturers = new Set()
  return new Promise((resolve, reject) => {
    db.goods.find({}, (err, goods) => {
      if (!err && goods && goods.length > 0) {
        goods.forEach(g => {
          if (g.name) {
            names.add(g.name)
          }
          if (g.type) {
            types.add(g.type)
          }
          if (g.provider) {
            providers.add(g.provider)
          }
          if (g.manufacturer) {
            manufacturers.add(g.manufacturer)
          }
        })
        resolve({nameList: [...names], typeList: [...types], providerList: [...providers], manufacturerList: [...manufacturers]})
      } else {
        reject(err)
      }
    })
  })
}

db.goods.getAllGoods = () => {
  return new Promise((resolve, reject) => {
    db.goods.find({ show: 1 }, (err, goods) => {
      if (err) {
        reject(err)
        return
      }
      resolve(goods)
    })
  })
}

db.goods.stockOut = (_id, number) => {
  number = +number
  return new Promise((resolve, reject) => {
    db.goods.update({ _id }, {
      $inc: { number: -number }
    },
    {}, async (err, goods) => {
      if (err) {
        reject(err)
        return
      }
      // insert out table
      await db.out.insertOutRecord({goodsId: _id, number})
      resolve(goods)
    })
  })
}

db.goods.findByQuery = query => {
  return new Promise((resolve, reject) => {
    db.goods.find(query, (err, goods) => {
      if (err) {
        reject(err)
        return
      }
      resolve(goods)
    })
  })
}

db.goods.stockIn = data => {
  return new Promise((resolve, reject) => {
    db.goods.insert(data, (err, res) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res)
    })
  })
}

db.summaryOutIn = async ({startTs, endTs}) => {
  const outList = await db.out.findByQuery({ outTime: { $gte: startTs, $lte: endTs } })
  const goodsList = await db.goods.findByQuery({ createTime: { $gte: startTs, $lte: endTs } })

  const outMap = {}
  const goodsMap = {}

  outList.forEach(g => {
    const { goodsId, number } = g
    if (!outMap[goodsId]) {
      outMap[goodsId] = number
    } else {
      outMap[goodsId] += number
    }
  })

  goodsList.forEach(g => {
    const { _id, name, inStockNum } = g
    if (!goodsMap[_id]) {
      goodsMap[_id] = {
        name,
        inStockNum,
        outStockNum: outMap[_id] || 0
      }
    }
  })

  const summaryMap = {}
  for (let k in goodsMap) {
    const { name, inStockNum, outStockNum } = goodsMap[k]
    if (!summaryMap[name]) {
      summaryMap[name] = {
        inStockNum,
        outStockNum
      }
    } else {
      summaryMap[name].inStockNum += inStockNum
      summaryMap[name].outStockNum += outStockNum
    }
  }

  return summaryMap
}

const startTs = new Date('2018-06-05').getTime()
const endTs = new Date('2018-06-15').getTime()
console.log(111)
console.log(startTs, endTs)
db.summaryOutIn({
  startTs,
  endTs
})

export default db
