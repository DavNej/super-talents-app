import { NextResponse } from 'next/server'
import { profileIdOfHandle } from '@/lib/talent-layer/subgraph'
import { ethers } from 'ethers'

import {
  platfromId,
  talentLayerAddress,
  talentLayerInterface,
} from '@/lib/talent-layer/contract/config'
import { log } from '@/lib/utils'

const PK = process.env.SUPERTALENTS_FUNDER_PRIVATE_KEY || ''
const RPC_TARGET = process.env.NEXT_PUBLIC_RPC_TARGET || ''

export async function POST(request: Request) {
  const body = await request.json()
  //TODO typecheck body with zod
  const { handle, address } = body

  log('📓 | Check if handle is available')
  let profileId = await profileIdOfHandle(handle)

  if (profileId !== null)
    return NextResponse.json(
      `TL handle "${handle}" taken => id: ${profileId}`,
      { status: 400 }
    )

  const provider = new ethers.providers.JsonRpcProvider(RPC_TARGET)
  const wallet = new ethers.Wallet(PK, provider)

  const contract = new ethers.Contract(
    talentLayerAddress,
    talentLayerInterface,
    wallet
  )

  let handlePrice: ethers.BigNumber

  try {
    log('📓 | Get handle price')
    handlePrice = await contract.getHandlePrice(handle)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Could not get handle price' },
      { status: 400 }
    )
  }

  try {
    log('📓 | Send mint tx', {
      address,
      platfromId,
      handle,
      value: handlePrice,
    })

    const mintTx: ethers.ContractTransaction = await contract.mintForAddress(
      address,
      platfromId,
      handle,
      { value: handlePrice }
    )

    const mintTxReceipt = await mintTx.wait(1)
    log('📓 | TL profile minted')
    console.log('🤝 | Transaction hash', mintTxReceipt.transactionHash)
  } catch (err) {
    return NextResponse.json(
      { message: 'Could not mint TL profile' },
      { status: 500 }
    )
  }

  try {
    log('📓 | Retrieve profile id')
    profileId = await contract.ids(address)
    log('📓 | profileId', profileId)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Could not get minted Id' },
      { status: 500 }
    )
  }

  if (!profileId)
    return NextResponse.json(
      { message: 'TL profile not minted' },
      { status: 500 }
    )

  return NextResponse.json<{ profileId: number }>({ profileId })
}
