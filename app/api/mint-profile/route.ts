import { NextResponse } from 'next/server'
import { ethers } from 'ethers'

import {
  platfromId,
  talentLayerAddress,
  talentLayerInterface,
} from '@/features/talent-layer'

import { log } from '@/utils'

const PK = process.env.SUPERTALENTS_FUNDER_PRIVATE_KEY as string
const RPC_TARGET = process.env.NEXT_PUBLIC_RPC_TARGET as string

const provider = new ethers.providers.JsonRpcProvider(RPC_TARGET)
const wallet = new ethers.Wallet(PK, provider)
const contract = new ethers.Contract(
  talentLayerAddress,
  talentLayerInterface,
  wallet
)

export async function POST(request: Request) {
  const { handle, value, address } = await request.json()

  try {
    log('🎫 | Minting TL handle', { address, platfromId, handle, value })

    const mintTx: ethers.ContractTransaction = await contract.mintForAddress(
      address,
      platfromId,
      handle,
      { value }
    )

    const receipt = await mintTx.wait(1)
    const txHash = receipt.transactionHash
    log('🎫 | TL handle minted', txHash)
    return NextResponse.json({ txHash })
  } catch (err) {
    console.error('💥', err)
    return NextResponse.json(
      { message: 'Could not mint handle', cause: err },
      { status: 500 }
    )
  }
}
