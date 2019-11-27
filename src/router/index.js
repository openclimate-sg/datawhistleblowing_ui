import Vue from 'vue'
import Router from 'vue-router'
import PreciDatos from '@/components/PreciDatos'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PreciDatos',
      component: PreciDatos
    }
  ]
})
