import axios from "axios"

const DOMAIN = 'https://tracker-task-api.vercel.app'
const API_VERSION = 'api'

type URL = `/${string}`

type RequestOptions = {
    url: URL
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: unknown
}

export function makeRequest<Res, Req = void>({ url, method, data }: RequestOptions) {

    return async (data: Req): Promise<Res> => {
        const response = await axios({
            url: `${DOMAIN}/${API_VERSION}${url}`,
            method,
            headers: {
                "Content-Type": "application/json",
            },
            data,
        })

        return response.data
    }
}