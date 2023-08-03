import { NextResponse } from 'next/server'

import { parseApiError } from '@/lib/error-utils'

import type { AskGPTResponse } from './chat-gpt'
import { askGPT } from './chat-gpt'

export async function POST(
  request: Request
): Promise<NextResponse<AskGPTResponse>> {
  const body = await request.json()

  try {
    const data = await askGPT(body.bio)

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: parseApiError(err), message: null })
  }
}
