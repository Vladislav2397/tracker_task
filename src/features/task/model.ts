import { ref, computed, onMounted } from 'vue'
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

export const useTasks = () => {
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
                isCompleted: item.is_completed,
            }))
        } catch (error) {
            console.error('update tasks is failed')
        } finally {
            isLoading.value = false
        }
    }

    onMounted(() => {
        refresh()
    })

    const comletedTasks = computed<CompletedTask[]>(() =>
        list.value.filter(isTaskCompleted),
    )
    const uncompletedTasks = computed<UncompletedTask[]>(() =>
        list.value.filter(isTaskUncompleted),
    )

    let nextId = 1

    async function addTask(name: string) {
        const normalizedName = name.trim()

        if (!normalizedName) return

        const response = await taskApi.createTask({
            name: normalizedName,
        })

        if (!response.status) return

        list.value.push({
            id: `${nextId++}`,
            name: normalizedName,
            isCompleted: false,
        })
    }

    async function removeTask(task: any) {
        const response = await taskApi.removeTask({ id: task.id })

        if (!response.status) return

        list.value = list.value.filter(item => item.id !== task.id)
    }

    async function toggleTask(task: Task) {
        if (task.isCompleted) {
            await uncompleteTask(task)
        } else {
            await completeTask(task)
        }
    }

    async function completeTask(task: UncompletedTask) {
        const updatedTask: CompletedTask = { ...task, isCompleted: true }

        const response = await taskApi.updateTask(updatedTask)

        if (!response.status) return

        list.value = list.value.map(item =>
            item.id === task.id ? updatedTask : item,
        )
    }

    async function uncompleteTask(task: CompletedTask) {
        const updatedTask: UncompletedTask = { ...task, isCompleted: false }

        const response = await taskApi.updateTask(updatedTask)

        if (!response.status) return

        list.value = list.value.map(item =>
            item.id === task.id ? updatedTask : item,
        )
    }

    return {
        refresh,
        isLoading,
        comletedTasks,
        uncompletedTasks,
        addTask,
        removeTask,
        toggleTask,
    }
}
