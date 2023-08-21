import axios from 'axios';
import { makeRequest } from '../request';

type Task = {
    id: number
    name: string
    is_completed: boolean
}

export const getTasks = makeRequest<{ tasks: Task[] }>({
    url: '/tasks',
    method: 'GET',
})
