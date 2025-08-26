<script lang="ts" setup>
import { computed, ref } from 'vue'
import AddTodo from './components/AddTodo.vue'
import { useTodoStore } from './store'
const isShowAddForm = ref<boolean>(false)
const store = useTodoStore()

// 使用computed来获取响应式的todos数据
const todos = computed(() => store.todos)

const showDialog = () => {
  isShowAddForm.value = true
  console.log('form:', isShowAddForm.value)
}
const handleAddTodo = (id: number, title: string, content: string) => {
  isShowAddForm.value = false
  if (!id || !title || !content) return
  store.todos.unshift({
    id,
    title,
    content,
    completed: false
  })
}
const todoComputeData = computed(() => {
  const allTodosNum = todos.value.length
  const willTodosNum = todos.value.filter(todo => todo.completed === false).length
  const completedTodosNum = allTodosNum - willTodosNum
  return {
    allNum: allTodosNum,
    willNum: willTodosNum,
    completedNum: completedTodosNum
  }
})
</script>
<template>
  <el-card class="box-card">
    <template #header>
      <div class="clearfix">
        <span>待办列表</span>
      </div>
    </template>
    <router-view></router-view>
    <template #footer>
      <div class="todo-footer">
        <div>
          <router-link to="/" class="data">全部({{ todoComputeData.allNum }})</router-link>
          <span>/</span>
          <router-link to="/will" class="data">待完成({{ todoComputeData.willNum }})</router-link>
          <span>/</span>
          <router-link to="/completed" class="data">已完成({{ todoComputeData.completedNum }})</router-link>
        </div>

        <el-button style="float: right; padding: 3px 0" type="text" @click="showDialog">添加任务</el-button>
      </div>
      <AddTodo :is-show="isShowAddForm" @handle-add-todo="handleAddTodo" />
    </template>
  </el-card>
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
