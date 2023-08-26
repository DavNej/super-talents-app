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

export async function POST(request: Request) {
  const body = await request.json()
  //TODO typecheck body with zod
  const { handle, address } = body

  let profileId = await profileIdOfHandle(handle)

  if (profileId !== null)
    return NextResponse.json('TL handle taken', { status: 400 })

  const signer = new ethers.Wallet(PK)
  const contract = new ethers.Contract(
    talentLayerAddress,
    talentLayerInterface,
    signer
  )

  let handlePrice: ethers.BigNumber

  try {
    handlePrice = await contract.getHandlePrice(handle)
  } catch (err) {
    console.error(err)
    return NextResponse.json('Could not get handle price', { status: 400 })
  }

  try {
    const mintTx: ethers.ContractTransaction = await contract.mintForAddress(
      address,
      platfromId,
      handle,
      // 'as;lkfjl;aksjfl;aksf[2 0134981 -203r984-0944-092019xkmx1q012 x',
      { value: handlePrice }
    )
    const mintTxReceipt = await mintTx.wait(1)
    log('🤝 |  mintTxReceipt', mintTxReceipt)
  } catch (err) {
    console.error(err)
    return NextResponse.json('Could not mint TL profile', { status: 500 })
  }

  profileId = await profileIdOfHandle(handle)

  if (profileId === null)
    return NextResponse.json('TL profile not minted', { status: 500 })

  return NextResponse.json<{ profileId: number }>({ profileId })
}
