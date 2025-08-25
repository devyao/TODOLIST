<script lang="ts" setup>
import { useRoute } from 'vue-router'
import TodoItem from '../components/TodoItem.vue'
import { useTodoStore } from '../store'
import { computed } from 'vue'
const store = useTodoStore()

// 使用computed来获取响应式的todos数据
const todos = computed(() => store.todos)

const toggleTodo = (id: number, completed: boolean) => {
  const todo = store.todos.find(item => item.id === id)
  if (todo) {
    todo.completed = completed
  }
}
const editTodo = (id: number, newTitle: string, newContent: string) => {
  const todo = store.todos.find(item => item.id === id)
  if (todo) {
    todo.title = newTitle
    todo.content = newContent
  }
}
const delTodo = (id: number) => {
  console.log('删除todo', id, store.todos)
  // 直接更新store中的数据
  store.todos = store.todos.filter(item => item.id !== id)
}

const route = useRoute()
const filterTodos = computed(() => {
  const path = route.path
  if (path === '/will') {
    return todos.value.filter(todo => todo.completed === false)
  } else if (path === '/completed') {
    return todos.value.filter(todo => todo.completed === true)
  } else {
    return todos.value
  }
})
console.log(filterTodos)
</script>
<template>
  <template v-if="filterTodos.length === 0">
    <div style="text-align: center; font-size: 14px">暂无任务</div>
  </template>
  <template v-else>
    <div v-for="todo in filterTodos" :key="todo.id" class="text item">
      <TodoItem
        :id="todo.id"
        :title="todo.title"
        :content="todo.content"
        :completed="todo.completed"
        @handle-change-completed="toggleTodo"
        @handle-edit-todo="editTodo"
        @remove-todo="delTodo"
      />
    </div>
  </template>
</template>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  height: 50px;
}
.clearfix {
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
.todo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .data {
    font-size: 12px;
    cursor: pointer;
    &:hover {
      color: rgb(241, 68, 68);
    }
  }
}
</style>
