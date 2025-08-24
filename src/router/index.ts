import { createRouter, createWebHistory } from 'vue-router'
import TodoView from '../views/TodoView.vue'

const routes = [
  { path: '/', component: TodoView },
  { path: '/will', component: TodoView },
  { path: '/completed', component: TodoView }
]

const router = createRouter({
  history: createWebHistory('/TODOLIST/'),
  routes
})

export default router
