import type { AxiosError } from 'axios'

export interface ApiError {
  message: string
  reason?: string
  status?: number
  statusText?: string
  data?: unknown
}

export function parseApiError(_error: unknown, reason?: string) {
  console.error('======================')
  console.error(_error)
  console.error('======================')

  if (typeof _error === 'string') return { message: _error }

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

  console.error(errorObj)
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
