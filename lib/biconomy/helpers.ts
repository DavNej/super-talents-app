import { ethers } from 'ethers'
import { toast } from 'react-toastify'

import { BiconomySmartAccount } from '@biconomy/account'
import type { Transaction, UserOperation } from '@biconomy/core-types'

import { chainId, bundler, paymaster, paymasterServiceData } from './config'
import type {
  IHybridPaymaster,
  SponsorUserOperationDto,
} from '@biconomy/paymaster'

export async function init({
  signer,
}: {
  signer: ethers.providers.JsonRpcSigner
}) {
  console.log('💡 Creating Smart account')

  try {
    const _smartAccount = new BiconomySmartAccount({
      signer,
      chainId,
      bundler,
      paymaster,
    })

    const smartAccount = await _smartAccount.init()
    console.log('🎉 Smart account created', smartAccount)

    const address = await smartAccount.getSmartAccountAddress()
    console.log('🏠 Address:', address)
    return { smartAccount, address }
  } catch (err) {
    toast.error('Could not initialize smart account')
    throw err
  }
}

export async function sendUserOp({
  smartAccount,
  transactions,
}: {
  smartAccount: BiconomySmartAccount | undefined
  transactions: Transaction[]
}) {
  let userOp: Partial<UserOperation>
  if (!smartAccount) {
    toast.warn('Smart account not ready yet')
    return null
  }

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
