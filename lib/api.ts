import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { toast } from 'react-toastify'

async function POST<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any>
) {
  try {
    const res = await axios.post<T>(url, data, config)
    return res.data
  } catch (error) {
    toast.error('🏚️ Could not POST api')
    throw error
  }
}

async function GET<T>(url: string, config?: AxiosRequestConfig<any>) {
  try {
    const res = await axios.get<T>(url, config)
    return res.data
  } catch (error) {
    toast.error('🏚️ Could not GET api')
    throw error
  }
}

export const api = {
  GET,
  POST,
}

export default api
