import { NextResponse } from 'next/server'
import { generateAvatars } from '@/lib/avatar'

export async function POST(request: Request) {
  const body = await request.json()
  //TODO typecheck body with zod

  const res = await generateAvatars({ image: body.image })

  return NextResponse.json(res)
}
