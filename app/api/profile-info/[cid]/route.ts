import { NextResponse } from 'next/server'

import { fetchFromIPFS } from '@/features/ipfs'

export async function GET(
  request: Request,
  { params }: { params: { cid: string } }
) {
  const data = await fetchFromIPFS({ cid: params.cid })
  return NextResponse.json(data)
}
