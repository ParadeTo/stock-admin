<template>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="商品编号" prop="code">
    <el-input v-model="ruleForm.code"></el-input>
  </el-form-item>
  <el-form-item label="商品名称" prop="name">
    <el-autocomplete
      class="inline-input"
      v-model="ruleForm.name"
      :fetch-suggestions="queryFieldSearch('nameList')"
      placeholder="请输入商品名称"
    ></el-autocomplete>
  </el-form-item>
  <el-form-item label="规格型号" prop="type">
    <el-autocomplete
      class="inline-input"
      v-model="ruleForm.type"
      :fetch-suggestions="queryFieldSearch('typeList')"
      placeholder="请输入规格型号"
    ></el-autocomplete>
  </el-form-item>
  <el-form-item label="供应商" prop="provider">
    <el-autocomplete
      class="inline-input"
      v-model="ruleForm.provider"
      :fetch-suggestions="queryFieldSearch('providerList')"
      placeholder="请输入供应商名称"
    ></el-autocomplete>
  </el-form-item>
  <el-form-item label="厂商" prop="manufacturer">
    <el-autocomplete
      class="inline-input"
      v-model="ruleForm.manufacturer"
      :fetch-suggestions="queryFieldSearch('manufacturerList')"
      placeholder="请输入厂商名称"
    ></el-autocomplete>
  </el-form-item>
  <el-form-item label="失效时间" prop="expiryTime">
    <el-date-picker type="date" placeholder="选择失效时间" v-model="ruleForm.expiryTime"></el-date-picker>
  </el-form-item>
  <el-form-item label="商品数量" prop="number">
    <el-input-number v-model="ruleForm.number"></el-input-number>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
</template>

<script>
  import Vue from 'vue'
  export default {
    data () {
      return {
        nameList: [],
        typeList: [],
        manufacturerList: [],
        providerList: [],
        ruleForm: {
          code: '',
          name: '',
          type: '',
          provider: '',
          manufacturer: '',
          expiryTime: '',
          number: 1,
          inStockNum: 1
        },
        rules: {
          code: [
            { required: false, message: '请输入商品编号', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入商品名称', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请输入商品规格', trigger: 'change' }
          ],
          expiryTime: [
            { type: 'date', required: true, message: '请选择失效时间', trigger: 'change' }
          ],
          number: [
            { required: true, trigger: 'change' }
          ]
        }
      }
    },

    async created () {
      const res = await Vue.prototype.$db.goods.getFields()
      const { nameList, typeList, manufacturerList, providerList } = res
      this.nameList = nameList || []
      this.typeList = typeList || []
      this.manufacturerList = manufacturerList || []
      this.providerList = providerList || []
    },

    methods: {
      queryFieldSearch (field) {
        return (queryString, cb) => {
          const list = this[field].map(f => ({ value: f }))
          const res = queryString ? list.filter(l => l.value.indexOf(queryString) > -1) : list
          cb(res)
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
              ...this.ruleForm,
              inStockNum: this.ruleForm.number,
              show: 1,
              expiryTime: new Date().getTime(),
              createTime: new Date().getTime()
            }

            this.$db.goods.insert(data, (err, res) => {
              if (err) {
                this.$message.error('入库失败')
                return
              }
              this.$message({
                message: '入库成功',
                type: 'success'
              })
              window.location.reload()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
