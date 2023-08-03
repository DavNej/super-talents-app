import axios from 'axios'
import { NextResponse } from 'next/server'
import { AVATAR_SERVICE_BASE_URL, headers, buildPayload } from './config'
import type { RouteResponse, RunpodResponse } from './config'
import { parseApiError } from '@/lib/error-utils'

export async function POST(
  request: Request
): Promise<NextResponse<RouteResponse>> {
  const body = await request.json()
  const payload = buildPayload(body.image)

  try {
    const response = await axios.post<RunpodResponse>(
      `${AVATAR_SERVICE_BASE_URL}/run`,
      payload,
      { headers }
    )
    const { id, status } = response.data
    return NextResponse.json({ id, status })
  } catch (err) {
    return NextResponse.json({ error: parseApiError(err) })
  }
}

export async function GET(request: Request) {
  const jobId = request.url.split('=').at(-1)

  try {
    const response = await axios.get<RunpodResponse>(
      `${AVATAR_SERVICE_BASE_URL}/status/${jobId}`,
      { headers }
    )
    const { id, status, output = [] } = response.data

    if (status !== 'COMPLETED') {
      return NextResponse.json({ id, status, results: null })
    } else if (output.length > 0) {
      const results = output.map(o => o.image)
      return NextResponse.json({ id, results })
    }
  } catch (err) {
    return NextResponse.json({ error: parseApiError(err) })
  }
}
