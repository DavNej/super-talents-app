import axios from 'axios'
import { NextResponse } from 'next/server'
import { API_BASE_URL, headers, buildPayload } from './config'
import type { APIResponse } from './config'
import { parseApiError } from '@/lib/error-utils'

export async function POST(request: Request) {
  const body = await request.json()
  const payload = buildPayload(body.image)
  let data = null

  try {
    const response = await axios.post<APIResponse>(
      `${API_BASE_URL}/run`,
      payload,
      { headers }
    )
    data = response.data
  } catch (error) {
    data = parseApiError(error)
  }

  return NextResponse.json(data)
}

export async function GET(request: Request) {
  const jobId = request.url.split('=').at(-1)

  let data = null

  try {
    const response = await axios.get<APIResponse>(
      `${API_BASE_URL}/status/${jobId}`,
      { headers }
    )

    data = response.data
    const hasResults = data.status === 'COMPLETED' && !!data.output?.length

    if (hasResults) {
      const outputImages = data.output?.map(o => o.image) || []
      if (outputImages.length > 0) return NextResponse.json(outputImages)
    }
  } catch (error) {
    data = parseApiError(error)
  }

  return NextResponse.json(data)
}
