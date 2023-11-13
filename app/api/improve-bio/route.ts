import { NextResponse } from 'next/server'
import { askChatGPT } from '@/utils/chat-gpt'
import { log } from '@/utils'

import type { ChatCompletionResponseMessage } from 'openai'

export async function POST(request: Request) {
  const body = await request.json()
  //TODO typecheck body with zod

  const res = await askChatGPT(body.prompt)

  log('😺 | GPT response content', res?.content)

  return NextResponse.json<ChatCompletionResponseMessage | null>(res)
}
