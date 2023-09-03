import axios from "axios"

const DOMAIN = 'https://tracker-task-api.vercel.app'
const API_VERSION = 'api'

type URL = `/${string}`

type RequestOptions = {
    url: URL | ((data: any) => URL)
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: unknown
}

export function makeRequest<Res, Req = void>({ url, method }: RequestOptions) {
    return async (data: Req): Promise<Res> => {
        const path = typeof url === 'string' ? url : url(data)

        const response = await axios({
            url: `${DOMAIN}/${API_VERSION}${path}`,
            method,
            headers: {
                "Content-Type": "application/json",
            },
            data,
        })

        return response.data
    }
}
