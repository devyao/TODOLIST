import { defineStore } from 'pinia'
import type { TODO } from '../types'

function getTodos() {
  const list = Array.from({ length: 5 }, (_val, i) => i)
  return list.map(i => ({
    id: i,
    title: `学习Vue3-${i}`,
    content: `学习Vue3的Composition API-${i}`,
    completed: i % 2 === 0 ? true : false
  }))
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: getTodos() as TODO[]
  }),
  persist: {
    key: 'todo-store',
    storage: localStorage
  }
})
