import { makeRequest } from '../request';

export type UUID = string & { __tag?: 'NotionDatabaseID'}

type Task = {
    id: UUID
    name: string
    is_completed: boolean
}

export const getTasks = makeRequest<{ tasks: Task[] }>({
    url: '/tasks',
    method: 'GET',
})

export const createTask = makeRequest<{ status: boolean }, { name: string }>({
    url: '/tasks',
    method: 'POST',
})

export const updateTask = makeRequest<{ status: boolean }, { id: string, name?: string, isCompleted?: boolean }>({
    url: ({ id }) => `/tasks/${id}`,
    method: 'PUT',
})

export const removeTask = makeRequest<{ status: boolean }, { id: string }>({
    url: ({ id }) => `/tasks/${id}`,
    method: 'DELETE',
})

