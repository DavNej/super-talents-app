import { NextResponse } from 'next/server'
import { askGPT } from '@/utils/gpt'
import { log } from '@/utils'

import type { ChatCompletionResponseMessage } from 'openai'

export async function POST(request: Request) {
  const { prompt } = await request.json()
  const res = await askGPT(prompt)

  log('😺 | GPT response:')
  log(res)

  return NextResponse.json<ChatCompletionResponseMessage | null>(res)
}
