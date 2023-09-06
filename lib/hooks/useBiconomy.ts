import React from 'react'
import { toast } from 'react-toastify'
import { BiconomySmartAccount } from '@biconomy/account'
import type { Transaction, UserOperation } from '@biconomy/core-types'
import type {
  IHybridPaymaster,
  SponsorUserOperationDto,
} from '@biconomy/paymaster'

import { useAuth } from '@/lib/hooks'
import { log } from '@/lib/utils'

import {
  chainId,
  bundler,
  paymaster,
  paymasterServiceData,
} from '@/lib/biconomy/config'

export default function useBiconomy() {
  const { signer } = useAuth()
  const [smartAccountAddress, setSmartAccountAddress] = React.useState<string>()
  const [smartAccount, setSmartAccount] = React.useState<BiconomySmartAccount>()

  const init = React.useCallback(async () => {
    log('📜 | Smart account init')
    if (signer) {
      log('📜 | Smart account init hit')
      try {
        const biconomySmartAccount = new BiconomySmartAccount({
          signer,
          chainId,
          bundler,
          paymaster,
        })

        const _smartAccount = await biconomySmartAccount.init()
        const _address = await _smartAccount.getSmartAccountAddress()

        setSmartAccount(_smartAccount)
        setSmartAccountAddress(_address)
        log('📜 | Smart account created', _address)
      } catch (err) {
        console.error(err)
        toast.error('Could not initialize smart account')
      }
    }
  }, [signer])

  React.useEffect(() => {
    init()
  }, [init])

  const sendUserOp = React.useCallback(
    async ({ transactions }: { transactions: Transaction[] }) => {
      log('🎟️ | Send user op')
      if (!smartAccount) return null
      log('🎟️ | Send user op hit')

      let userOp: Partial<UserOperation>

      // Build user operations
      try {
        userOp = await smartAccount.buildUserOp(transactions)
      } catch (err) {
        console.error('💥', err)
        toast.error('Could not build user operation')
        return null
      }

      // Setup paymaster
      try {
        const biconomyPaymaster =
          smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>
        const paymasterAndDataResponse =
          await biconomyPaymaster.getPaymasterAndData(
            userOp,
            paymasterServiceData
          )

        userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData
      } catch (err) {
        console.error('💥', err)
        toast.error('Paymaster setup error')
        return null
      }

      // Send user operations
      try {
        const userOpResponse = await smartAccount.sendUserOp(userOp)
        const { receipt } = await userOpResponse.wait(1)
        console.log('🤝 | Transaction hash', receipt.transactionHash)
        return receipt.transactionHash
      } catch (err) {
        console.error('💥', err)
        toast.error('Could not process transactions')
        return null
      }
    },
    [smartAccount]
  )

  return {
    sendUserOp,
    smartAccount,
    smartAccountAddress,
  }
}
