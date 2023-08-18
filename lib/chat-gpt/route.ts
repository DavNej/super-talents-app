import { askChatGPT } from '@/lib/chat-gpt'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  //TODO typecheck body with zod

  const res = await askChatGPT(body.prompt)

  return NextResponse.json(res)
}
