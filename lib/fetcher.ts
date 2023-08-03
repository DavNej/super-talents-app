import axios from 'axios'
import type { AxiosError, AxiosRequestConfig } from 'axios'

export interface ApiError {
  message: string
  reason?: string
  status?: number
  statusText?: string
  data?: unknown
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError }

async function POST<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any> | undefined
): Promise<ApiResponse<T>> {
  let response: ApiResponse<T>
  try {
    const res = await axios.post<T>(url, data, config)
    response = { ok: true, data: res.data }
  } catch (_err) {
    response = { ok: false, error: parseApiError(_err) }
  }

  return response
}

async function GET<T>(
  url: string,
  config?: AxiosRequestConfig<any> | undefined
): Promise<ApiResponse<T>> {
  let response: ApiResponse<T>
  try {
    const res = await axios.get<T>(url, config)
    response = { ok: true, data: res.data }
  } catch (_err) {
    response = { ok: false, error: parseApiError(_err) }
  }

  return response
}

const fetcher = {
  GET,
  POST,
}

export default fetcher

export function parseApiError(_error: unknown | string, reason?: string) {
  if (typeof _error === 'string') {
    console.log('======================')
    console.error(_error)
    console.log('======================')
    return { message: _error } satisfies ApiError
  }

  const error = _error as AxiosError
  const errorObj: ApiError = { message: '' }

  if (error.message) {
    errorObj.message = error.message
  }

  if (reason) {
    errorObj.reason = reason
  }

  if (error.response) {
    errorObj.statusText = error.response.statusText
    errorObj.status = error.response.status
    errorObj.data = error.response.data
  }

  console.log('======================')
  console.error(errorObj)
  console.log('======================')

  return errorObj
}

export function formatErrorMessage(message: string | undefined) {
  const defaultMessage = 'Something went wrong'
  console.error(message)

  if (typeof message === 'undefined') {
    return defaultMessage
  }

  return defaultMessage
}
