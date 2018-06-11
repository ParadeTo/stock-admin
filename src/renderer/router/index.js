import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'layout',
      component: require('@/components/layout/Layout').default,
      children: [{
        path: '/',
        component: require('@/components/out/Out').default
      }, {
        path: '/in',
        component: require('@/components/in/In').default
      }, {
        path: '/summary',
        component: require('@/components/summary/Summary').default
      }]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
