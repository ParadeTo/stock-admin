
import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

console.log(remote.app.getPath('userData'))

const db = {}

db.goods = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/goods.db')
})

db.goods.find({ 'out.outTime': { $lt: new Date().getTime() } }, (err, goods) => {
  console.log(err)
  console.log(goods)
})
db.goods.find({ createTime: { $lt: new Date().getTime() } }, (err, goods) => {
  console.log(err)
  console.log(goods)
})

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
      $inc: { number: -number },
      $push: { out: { number, outTime: new Date() } }
    },
    {}, (err, goods) => {
      if (err) {
        reject(err)
        return
      }
      resolve(goods)
    })
  })
}

// db.goods.removeItem = (_id, number) => {
//   return new Promise((resolve, reject) => {
//     db.goods.update({ _id }, { $set: { show: 0 }, $pu } }, {}, (err, goods) => {
//       if (err) {
//         console.log(err)
//         reject(err)
//         return
//       }
//       resolve(goods)
//     })
//   })
// }

db.goods.getItem = query => {
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

/**
out: {
  number: 1,
  outTime: 2018-01-01 12:09:00
}
**/
db.goods.stockIn = data => {
  data.out = []
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

export default db
