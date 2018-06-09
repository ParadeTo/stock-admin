<template>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="商品编号" prop="code">
    <el-input v-model="ruleForm.code"></el-input>
  </el-form-item>
  <el-form-item label="商品名称" prop="name">
    <el-autocomplete
      class="inline-input"
      v-model="ruleForm.name"
      :fetch-suggestions="queryNameSearch"
      placeholder="请输入商品名称"
    ></el-autocomplete>
    <!-- <el-select v-model="ruleForm.name" placeholder="请选择商品名称" v-if="nameList && nameList.length > 0">
      <el-option :key="name" v-for="name in nameList" :label="name" :value="name"></el-option>
    </el-select>
    <el-input v-model="ruleForm.name" v-else></el-input> -->
  </el-form-item>
  <el-form-item label="规格型号" prop="type">
    <el-autocomplete
      class="inline-input"
      v-model="ruleForm.type"
      :fetch-suggestions="queryTypeSearch"
      placeholder="请输入规格型号"
    ></el-autocomplete>
    <!-- <el-select v-model="ruleForm.type" placeholder="请选择商品名称" v-if="typeList && typeList.length > 0">
      <el-option :key="type" v-for="type in typeList" :label="type" :value="type"></el-option>
    </el-select>
    <el-input v-model="ruleForm.type" v-else></el-input> -->
  </el-form-item>
  <el-form-item label="失效时间" prop="expiryTime">
    <el-date-picker type="datetime" placeholder="选择失效时间" v-model="ruleForm.expiryTime"></el-date-picker>
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
        ruleForm: {
          code: '',
          name: '',
          type: '',
          expiryTime: '',
          number: 1
        },
        rules: {
          code: [
            { required: false, message: '请输入商品编号', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入商品规格', trigger: 'blur' }
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
      const res = await Vue.prototype.$db.goods.getAllGoodsNameAndType()
      const { nameList, typeList } = res
      this.nameList = nameList
      this.typeList = typeList
    },

    methods: {
      queryNameSearch (queryString, cb) {
        const nameList = this.nameList.map(name => ({ value: name }))
        const res = queryString ? nameList.filter(name => name.value.indexOf(queryString) > -1) : nameList
        cb(res)
      },
      queryTypeSearch (queryString, cb) {
        const typeList = this.typeList.map(type => ({ value: type }))
        const res = queryString ? typeList.filter(type => type.value.indexOf(queryString) > -1) : typeList
        cb(res)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
              ...this.ruleForm,
              createTime: new Date()
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
