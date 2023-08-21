<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Tracker.Task</ion-title>
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
        <ion-button @click="addTask">Create task</ion-button>
        <ion-list class="list">
          <ion-title>Uncompleted</ion-title>
          <ion-item v-for="item in uncomletedTasks" :key="item.id">
            <ion-label class="ion-text-wrap">{{ item.name }}</ion-label>
            <div class="complete" @click="completeTask(item)"></div>
            <div class="remove" @click="removeTask(item)"></div>
          </ion-item>
        </ion-list>

        <ion-list class="list">
          <ion-title>Completed</ion-title>
          <ion-item class="completed-list" v-for="item in comletedTasks" :key="item.id">
            <ion-label class="ion-text-wrap">{{ item.name }}</ion-label>
            <div class="complete" @click="uncompleteTask(item)"></div>
            <div class="remove" @click="removeTask(item)"></div>
          </ion-item>
        </ion-list>
        
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {computed, ref, onMounted} from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonList } from '@ionic/vue';
import {getTasks} from '../shared/api/task'

type UncompletedTask = {
  id: number
  name: string
  isCompleted: false
}

type CompletedTask = {
  id: number
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

const value = ref('')

const list = ref<Task[]>([
  //
])

onMounted(async () => {
  const { tasks } = await getTasks()

  list.value = tasks.map(item => ({
    id: item.id,
    name: item.name,
    isCompleted: item.is_completed
  }))
})

const comletedTasks = computed<CompletedTask[]>(
  () => list.value.filter(isTaskCompleted)
)
const uncomletedTasks = computed<UncompletedTask[]>(
  () => list.value.filter(isTaskUncompleted)
)

let nextId = 1

function addTask() {
  if (!value.value.trim()) return

  list.value.push({
    id: nextId++,
    name: value.value.trim(),
    isCompleted: false,
  })

  clear()
}

function clear() {
  value.value = ''
}

function removeTask(task: any) {
  list.value = list.value.filter(item => item.id !== task.id)
}

function completeTask(task: UncompletedTask) {
  list.value = list.value.map(
    item => item.id === task.id ? { ...item, isCompleted: true } : item
  )
}

function uncompleteTask(task: CompletedTask) {
  list.value = list.value.map(
    item => item.id === task.id ? { ...item, isCompleted: false } : item
  )
}
</script>

<style scoped>
.container {
  padding: 0 16px;
}

.button {
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
