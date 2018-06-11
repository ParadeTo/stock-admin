<template>
  <el-table
    :data="goods"
    border
    style="width: 100%">
    <el-table-column
      prop="code"
      label="商品编号">
    </el-table-column>
    <el-table-column
      sortable
      prop="name"
      label="商品名称">
    </el-table-column>
    <el-table-column
      sortable
      prop="type"
      label="规格型号">
    </el-table-column>
    <el-table-column
      sortable
      prop="provider"
      label="供应商">
    </el-table-column>
    <el-table-column
      sortable
      prop="manufacturer"
      label="厂商">
    </el-table-column>
    <el-table-column
      prop="number"
      label="数量">
    </el-table-column>
    <el-table-column
      sortable
      prop="expiryTime"
      label="过期时间">
    </el-table-column>
    <el-table-column
      sortable
      prop="createTime"
      label="入库时间">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button @click="handleOutClick(scope.row)" type="text" size="small">出库</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import { format } from '../../utils'
  export default {
    data () {
      return {
        goods: []
      }
    },

    async created () {
      this.getGoods()
    },

    methods: {
      async getGoods () {
        const goods = await this.$db.goods.getAllGoods()

        this.goods = goods.map(g => {
          return {
            ...g,
            expiryTime: format(g.expiryTime),
            createTime: format(g.createTime, 'YYYY-MM-DD h:mm:ss')
          }
        })
      },

      handleOutClick (row) {
        const { name, _id, number } = row

        this.$prompt(`${name}，请输入出库数量`, '出库', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[123456789]+/,
          inputErrorMessage: '出库数量不正确'
        }).then(async ({ value }) => {
          value = value > number ? number : value

          if (number === Number(value)) {
            console.log(1)
            await this.$db.goods.removeItem(_id)
          } else {
            await this.$db.goods.stockOut(_id, value)
          }

          this.$message({
            type: 'success',
            message: `${name} 出库成功 ${value} 件`,
            onClose: () => { this.getGoods() }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消出库'
          })
        })
      }
    }
  }
</script>
