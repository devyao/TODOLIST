import { defineStore } from 'pinia'
import type { TODO } from '../types'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as TODO[]
  })
})
