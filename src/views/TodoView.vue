<script lang="ts" setup>
import { useRoute } from 'vue-router'
import TodoItem from '../components/TodoItem.vue'
import { useTodoStore } from '../store'
import { computed, ref, onUnmounted } from 'vue'

const store = useTodoStore()

// 使用computed来获取响应式的todos数据
const todos = computed(() => store.todos)

// 长任务处理相关状态
const sortTime = ref(0)
const status = ref('就绪')
const clickCount = ref(0)
const dataSize = ref(0)
let worker: Worker | null = null
let originalTestData: number[] = []

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

// 预先生成测试数据
const initializeTestData = () => {
  if (originalTestData.length > 0) return // 已经生成过了

  status.value = '初始化测试数据中...'
  const size = 10000000
  originalTestData = Array.from({ length: size }, () => Math.floor(Math.random() * 1000000))
  dataSize.value = size
  status.value = `测试数据已准备 (${size.toLocaleString()} 条)`
}

// 获取测试数据的副本
const getTestDataCopy = () => {
  if (originalTestData.length === 0) {
    initializeTestData()
  }
  return [...originalTestData]
}

// Worker 排序 - 不阻塞UI
const sortWithWorker = () => {
  status.value = 'Worker 排序中...'

  if (!worker) {
    worker = new Worker('/sort-worker.js')
    worker.onmessage = e => {
      if (e.data.type === 'sort-complete') {
        sortTime.value = Math.round(e.data.time)
        status.value = 'Worker 排序完成'
      }
    }
  }

  const testData = getTestDataCopy()
  worker.postMessage({
    type: 'sort',
    data: testData
  })
}

// 主线程排序 - 阻塞UI
const sortWithMainThread = () => {
  status.value = '主线程排序中...'

  const startTime = performance.now()
  // 执行排序操作（阻塞主线程）
  const testData = getTestDataCopy()
  testData.sort((a, b) => a - b)
  const endTime = performance.now()

  sortTime.value = Math.round(endTime - startTime)
  status.value = '主线程排序完成'
}

// 任务切片排序
const sortWithScheduler = async () => {
  status.value = '任务切片排序中...'

  const startTime = performance.now()
  const testData = getTestDataCopy()
  const chunkSize = 50000

  for (let i = 0; i < testData.length; i += chunkSize) {
    const chunk = testData.slice(i, i + chunkSize)
    chunk.sort((a, b) => a - b)

    // 让出控制权
    if (
      'scheduler' in window &&
      'yield' in (window as unknown as { scheduler: { yield: () => Promise<void> } }).scheduler
    ) {
      await (window as unknown as { scheduler: { yield: () => Promise<void> } }).scheduler.yield()
    } else {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  const endTime = performance.now()
  sortTime.value = Math.round(endTime - startTime)
  status.value = '任务切片排序完成'
}

// 空闲回调排序
const sortWithIdleCallback = () => {
  status.value = '空闲回调排序中...'

  const startTime = performance.now()
  const testData = getTestDataCopy()
  const chunkSize = 50000
  let currentIndex = 0

  const processChunk = (deadline: IdleDeadline) => {
    while (currentIndex < testData.length && deadline.timeRemaining() > 0) {
      const endIndex = Math.min(currentIndex + chunkSize, testData.length)
      const chunk = testData.slice(currentIndex, endIndex)
      chunk.sort((a, b) => a - b)
      currentIndex = endIndex
    }

    if (currentIndex < testData.length) {
      requestIdleCallback(processChunk)
    } else {
      const endTime = performance.now()
      sortTime.value = Math.round(endTime - startTime)
      status.value = '空闲回调排序完成'
    }
  }

  requestIdleCallback(processChunk)
}

// 测试页面交互
const testClick = () => {
  clickCount.value++
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

onUnmounted(() => {
  if (worker) {
    worker.terminate()
  }
})
</script>
<template>
  <!-- 长任务演示区域 -->
  <div class="task-demo">
    <h4>长任务处理演示</h4>
    <div class="controls">
      <button @click="initializeTestData">生成测试数据</button>
      <button @click="sortWithWorker">Worker排序</button>
      <button @click="sortWithMainThread">主线程排序</button>
      <button @click="sortWithScheduler">任务切片</button>
      <button @click="sortWithIdleCallback">空闲回调</button>
    </div>
    <div class="status">
      <p>状态: {{ status }}</p>
      <p v-if="dataSize > 0">数据量: {{ dataSize.toLocaleString() }} 条</p>
      <p>排序时间: {{ sortTime }}ms</p>
      <p>
        点击测试: <button @click="testClick">点击 ({{ clickCount }})</button>
      </p>
    </div>
  </div>

  <!-- 原有的 Todo 列表 -->
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
.task-demo {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
}

.controls button {
  margin: 5px;
  padding: 5px 10px;
}

.status {
  margin-top: 10px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  height: 50px;
}
</style>
