import { NextResponse, NextRequest } from 'next/server'
import { AVATAR_SERVICE_BASE_URL, headers, buildPayload } from './config'
import type { RunpodResponse } from './config'
import fetcher from '@/lib/fetcher'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const payload = buildPayload(body.image)

  const res = await fetcher.POST<RunpodResponse>(
    `${AVATAR_SERVICE_BASE_URL}/run`,
    payload,
    { headers }
  )

  if (!res.ok) {
    return NextResponse.json(res.error, { status: res.error.status || 400 })
  }

  return NextResponse.json(res.data)
}

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get('id')
  if (!jobId)
    return NextResponse.json(
      { ok: false, error: { message: 'jobId undefined' } },
      { status: 404 }
    )

  const res = await fetcher.GET<RunpodResponse>(
    `${AVATAR_SERVICE_BASE_URL}/status/${jobId}`,
    { headers }
  )

  if (!res.ok) {
    return NextResponse.json(res.error, { status: res.error.status })
  }

  const { id, status, output = [] } = res.data

  let results = null
  if (status === 'COMPLETED' && output.length > 0) {
    results = output.map(o => o.image)
  }

  const data = { id, status, results }
  return NextResponse.json(data)
}
