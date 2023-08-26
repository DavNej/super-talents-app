import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { BiconomySmartAccount } from '@biconomy/account'
import type { Transaction, UserOperation } from '@biconomy/core-types'
import type {
  IHybridPaymaster,
  SponsorUserOperationDto,
} from '@biconomy/paymaster'

import { log } from '@/lib/utils'

import { paymasterServiceData } from './config'

export async function sendUserOp({
  smartAccount,
  transactions,
}: {
  smartAccount: BiconomySmartAccount
  transactions: Transaction[]
}) {
  let userOp: Partial<UserOperation>

  log('🎟️ | send user op')

  // Build user operations
  try {
    userOp = await smartAccount.buildUserOp(transactions)
  } catch (err) {
    toast.error('Could not build user operation')
    throw err
  }

  // Setup paymaster
  try {
    const biconomyPaymaster =
      smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>
    const paymasterAndDataResponse =
      await biconomyPaymaster.getPaymasterAndData(userOp, paymasterServiceData)

    userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData
  } catch (err) {
    toast.error('Paymaster setup error')
    throw err
  }

  // Send user operations
  try {
    const userOpResponse = await smartAccount.sendUserOp(userOp)
    const { receipt } = await userOpResponse.wait(1)

    return receipt.transactionHash
  } catch (err) {
    toast.error('Could not process transactions')
    throw err
  }
}
