import { NextResponse } from 'next/server'
import { askGPT } from './chat-gpt'

export async function POST(request: Request) {
  const body = await request.json()

  const res = await askGPT(body.bio)

  return NextResponse.json(res)
}
