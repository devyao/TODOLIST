import { defineStore } from 'pinia'
import type { TODO } from '../types'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [
      {
        id: 1,
        title: '学习Vue3',
        content: '学习Vue3的Composition API',
        completed: false
      },
      {
        id: 2,
        title: '学习Pinia',
        content: '学习Pinia状态管理',
        completed: true
      }
    ] as TODO[]
  }),
  persist: {
    key: 'todo-store',
    storage: localStorage
  }
})
