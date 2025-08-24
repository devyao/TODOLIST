<script lang="ts" setup>
import dayjs from 'dayjs'
import { reactive, ref, watch } from 'vue'
const props = defineProps<{
  isShow: boolean
}>()
const dialogVisible = ref<boolean>(false)
watch(
  () => props.isShow,
  newVal => {
    form.id = 0
    form.title = ''
    form.content = ''
    dialogVisible.value = newVal
  }
)
const form = reactive({
  id: 0,
  title: '',
  content: ''
})
const emits = defineEmits<{
  handleAddTodo: [id: number, title: string, content: string]
}>()
const onSubmit = () => {
  dialogVisible.value = false
  const taskId = dayjs().valueOf()
  emits('handleAddTodo', taskId, form.title.trim(), form.content.trim())
}
</script>
<template>
  <el-dialog v-model="dialogVisible" title="添加任务" width="500">
    <template #footer>
      <div>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <el-form-item label="标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="form.content" />
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button @click="onSubmit">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped></style>
