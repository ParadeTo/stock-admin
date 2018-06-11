
import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
console.log(remote.app.getPath('userData'))

const db = {}
db.goods = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/goods.db')
})

// goods
db.goods.getAllGoodsNameAndType = () => {
  const names = new Set()
  const types = new Set()
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
        })
        resolve({nameList: [...names], typeList: [...types]})
      } else {
        reject(err)
      }
    })
  })
}

db.goods.getAllGoods = () => {
  return new Promise((resolve, reject) => {
    db.goods.find({}, (err, goods) => {
      if (err) {
        reject(err)
        return
      }
      resolve(goods)
    })
  })
}

db.goods.stockOut = (_id, number) => {
  return new Promise((resolve, reject) => {
    db.goods.update({ _id }, { $inc: { number: -number } }, {}, (err, goods) => {
      if (err) {
        reject(err)
        return
      }
      resolve(goods)
    })
  })
}

db.goods.removeItem = _id => {
  return new Promise((resolve, reject) => {
    db.goods.remove({ _id }, {}, (err, goods) => {
      if (err) {
        console.log(err)
        reject(err)
        return
      }
      resolve(goods)
    })
  })
}

export default db
