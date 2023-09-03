<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Tracker.Task</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="refresh">Refresh</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tracker.Task</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="container">
        <ion-input placeholder="Input task title" v-model="value" />
        <ion-button class="create-task-button" @click="addTask">Create task</ion-button>
        <ion-list class="list">
          <ion-title>Uncompleted</ion-title>
          <template v-if="isLoading">
            <ion-item>
              <ion-label>Loading...</ion-label>
            </ion-item>
          </template>
          <template v-else>
            <ion-item v-for="item in uncomletedTasks" :key="item.id">
              <ion-label class="ion-text-wrap">{{ item.name }}</ion-label>
              <div class="complete" @click="completeTask(item)"></div>
              <div class="remove" @click="removeTask(item)"></div>
            </ion-item>
          </template>
        </ion-list>

        <ion-list class="list">
          <ion-title>Completed</ion-title>
          <template v-if="isLoading">
            <ion-item>
              <ion-label>Loading...</ion-label>
            </ion-item>
          </template>
          <template v-else>
            <ion-item class="completed-list" v-for="item in comletedTasks" :key="item.id">
              <ion-label class="ion-text-wrap">{{ item.name }}</ion-label>
              <div class="complete" @click="uncompleteTask(item)"></div>
              <div class="remove" @click="removeTask(item)"></div>
            </ion-item>
          </template>
        </ion-list>
          <ion-toast
            :is-open="isOpen"
            message="Request is failed"
            :duration="5000"
            @didDismiss="setOpen(false)"
          >
          </ion-toast>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonList, IonLabel, IonToast } from '@ionic/vue';
import * as taskApi from '@/shared/api/task'

type UncompletedTask = {
  id: taskApi.UUID
  name: string
  isCompleted: false
}

type CompletedTask = {
  id: taskApi.UUID
  name: string
  isCompleted: true
}

function isTaskCompleted(task: Task): task is CompletedTask {
  return task.isCompleted
}
function isTaskUncompleted(task: Task): task is UncompletedTask {
  return !task.isCompleted
}

type Task = UncompletedTask | CompletedTask

const isOpen = ref(false)
function setOpen(value: boolean) {
  isOpen.value = value
}

const value = ref('')

const list = ref<Task[]>([
  //
])

const isLoading = ref(false)

async function refresh() {
  isLoading.value = true
  try {
    const { tasks } = await taskApi.getTasks()

    list.value = tasks.map(item => ({
      id: item.id,
      name: item.name,
      isCompleted: item.is_completed
    }))
  } catch (error) {
    console.error('update tasks is failed')
    setOpen(true)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  refresh()
})

const comletedTasks = computed<CompletedTask[]>(
  () => list.value.filter(isTaskCompleted)
)
const uncomletedTasks = computed<UncompletedTask[]>(
  () => list.value.filter(isTaskUncompleted)
)

let nextId = 1

async function addTask() {
  if (!value.value.trim()) return

  const response = await taskApi.createTask({
    name: value.value.trim(),
  })

  if (!response.status) return

  list.value.push({
    id: `${nextId++}`,
    name: value.value.trim(),
    isCompleted: false,
  })

  clear()
}

function clear() {
  value.value = ''
}

async function removeTask(task: any) {
  const response = await taskApi.removeTask({ id: task.id })

  if (!response.status) return

  list.value = list.value.filter(item => item.id !== task.id)
}

async function completeTask(task: UncompletedTask) {
  const updatedTask: CompletedTask = { ...task, isCompleted: true }

  const response = await taskApi.updateTask(updatedTask)

  if (!response.status) return

  list.value = list.value.map(
    item => item.id === task.id ? updatedTask : item
  )
}

async function uncompleteTask(task: CompletedTask) {
  const updatedTask: UncompletedTask = { ...task, isCompleted: false }

  const response = await taskApi.updateTask(updatedTask)

  if (!response.status) return

  list.value = list.value.map(
    item => item.id === task.id ? updatedTask : item
  )
}
</script>

<style scoped>
.container {
  padding: 0 16px;
}

.create-task-button {
  width: auto;
  margin-top: 12px;
}

.list {
  margin-top: 12px;
}

.completed-list {
  text-decoration: line-through;
}

ion-icon {
  color: blue;
}

.remove {
  width: 24px;
  height: 24px;
  background-color: red;
  border-radius: 4px;
  margin-left: 6px;
}

.complete {
  width: 24px;
  height: 24px;
  background-color: green;
  border-radius: 4px;
}

</style>
