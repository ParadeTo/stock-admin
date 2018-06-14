<template>
  <div class='block'>
    <div>
      <el-date-picker
        v-model='daterange'
        type='daterange'
        align='right'
        unlink-panels
        range-separator='至'
        start-placeholder='开始日期'
        end-placeholder='结束日期'
        :picker-options='pickerOptions'>
      </el-date-picker>
      <el-button type='primary' @click='onExport'>导出</el-button>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import { format, writeSummaryOutIn } from '../../utils'

export default {
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      daterange: null
    }
  },

  methods: {
    onExport () {
      const { daterange } = this
      const defaultFilename = `${format(daterange[0], 'YYYY-MM-DD')}-${format(daterange[1], 'YYYY-MM-DD')}`
      remote.dialog.showSaveDialog(
        {
          title: '导出统计',
          defaultPath: defaultFilename,
          filters: [{ name: 'data', extensions: ['csv'] }]
        },
        async filename => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })

          const summaryMap = await this.$db.summaryOutIn({
            startTs: daterange[0].getTime(),
            endTs: daterange[1].getTime()
          })
          writeSummaryOutIn(filename, summaryMap)
          setTimeout(() => {
            loading.close()
          }, 1000)
          console.log(filename) // 我这个是打开单个文件的
        }
      )
    }
  }
}
</script>
