<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
const dialogVisible = ref(false)
const form = reactive({
  id: 0,
  title: '',
  content: ''
})

const props = withDefaults(
  defineProps<{
    id: number
    title: string
    content: string
    completed: boolean
  }>(),
  {
    title: '默认标题',
    content: '默认内容',
    completed: false
  }
)
const isCompleted = ref<boolean>(props.completed)
const emits = defineEmits<{
  handleChangeCompleted: [id: number, value: boolean]
  handleEditTodo: [id: number, title: string, content: string]
  removeTodo: [id: number]
}>()
watch(isCompleted, newValue => {
  emits('handleChangeCompleted', props.id, newValue)
})
const editTodo = () => {
  dialogVisible.value = true
  form.id = props.id
  form.title = props.title
  form.content = props.content
}
const onSubmit = () => {
  dialogVisible.value = false
  emits('handleEditTodo', props.id, form.title, form.content)
}
const removeTodo = () => {
  emits('removeTodo', props.id)
}
</script>
<template>
  <div class="todoitem">
    <span class="id">{{ id }}</span>
    <el-tooltip :content="props.title" placement="bottom-start">
      <span :class="{ title: true, completed: isCompleted }">{{ title }}</span>
    </el-tooltip>
    <el-tooltip :content="props.content" placement="bottom-start">
      <span :class="{ title: true, completed: isCompleted }" class="content">{{ content }}</span>
    </el-tooltip>
    <el-button type="primary" @click="editTodo">编辑</el-button>
    <el-button type="warning" @click="removeTodo">删除</el-button>
    <el-checkbox v-model="isCompleted" />
  </div>
  <el-dialog v-model="dialogVisible" title="编辑任务" width="500">
    <template #footer>
      <div>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <el-form-item label="id" style="display: none">
            <el-input v-model="form.id" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="form.content" />
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.todoitem {
  display: flex;
  height: 50px;
  gap: 5px;
  justify-content: space-between;
  padding: 5px;
  border-radius: 5px;
  align-items: center;
  .id {
    display: none;
  }
  .title,
  .content {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: skyblue;
  }
  .completed {
    text-decoration: line-through;
    color: green;
  }
}
span {
  display: block;
}
</style>
