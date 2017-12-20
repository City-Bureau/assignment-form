import Vue from 'vue'
import Router from 'vue-router'
import AssignmentForm from '@/components/AssignmentForm'
import Success from '@/components/Success'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'assignment_form',
      component: AssignmentForm
    },
    {
      path: '/success',
      name: 'success',
      component: Success
    }
  ]
})
