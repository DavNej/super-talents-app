import { NextResponse } from 'next/server'
import { askChatGPT } from '@/utils/chat-gpt'
import { log } from '@/utils'

import type { ChatCompletionResponseMessage } from 'openai'

export async function POST(request: Request) {
  const { prompt } = await request.json()
  const res = await askChatGPT(prompt)

  log('😺 | GPT response content:')
  log(res?.content)

  return NextResponse.json<ChatCompletionResponseMessage | null>(res)
}
