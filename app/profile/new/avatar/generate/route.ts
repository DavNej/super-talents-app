import { NextResponse } from 'next/server'
import { AVATAR_SERVICE_BASE_URL, headers, buildPayload } from './config'
import type { RouteResponse, RunpodResponse } from './config'
import fetcher from '@/lib/fetcher'

export async function POST(
  request: Request
): Promise<NextResponse<RouteResponse>> {
  const body = await request.json()
  const payload = buildPayload(body.image)

  const res = await fetcher.POST<RunpodResponse>(
    `${AVATAR_SERVICE_BASE_URL}/run`,
    payload,
    { headers }
  )

  if (!res.ok) {
    return NextResponse.json(res)
  }

  const { id, status } = res.data
  return NextResponse.json({ id, status })
}

export async function GET(request: Request) {
  const jobId = request.url.split('=').at(-1)
  const res = await fetcher.GET<RunpodResponse>(
    `${AVATAR_SERVICE_BASE_URL}/status/${jobId}`,
    { headers }
  )

  if (!res.ok) {
    return NextResponse.json(res)
  }

  const { id, status, output = [] } = res.data

  if (status !== 'COMPLETED') {
    return NextResponse.json({ id, status, results: null })
  } else if (output.length > 0) {
    const results = output.map(o => o.image)
    return NextResponse.json({ id, results })
  }
}
