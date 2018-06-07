<template>
  <div id="wrapper">
    hahah
  </div>
</template>

<script>
  export default {
    name: 'landing-page',
    data () {
      // this.$db.find({a: 1}, function (err, docs) {
      //   console.log(err)
      //   console.log(docs)
      // })
      return {}
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>

</style>
