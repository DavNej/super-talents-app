import { NextResponse } from 'next/server'
import { fetchFromIPFS } from '@/lib/ipfs'

export async function GET(
  request: Request,
  { params }: { params: { cid: string } }
) {
  //TODO typecheck body with zod
  const res = await fetchFromIPFS({ cid: params.cid })

  return NextResponse.json(res)
}
