'use client'

import React from 'react'
import { toast } from 'react-toastify'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { BiconomySmartAccount } from '@biconomy/account'
import type { Transaction, UserOperation } from '@biconomy/core-types'
import type {
  IHybridPaymaster,
  SponsorUserOperationDto,
} from '@biconomy/paymaster'

import { useAuth } from '@/features/auth'
import { getTalentLayerUser } from '@/features/talent-layer'
import { type TalentLayerUserType } from '@/features/talent-layer/types'
import { log } from '@/utils'

import { chainId, bundler, paymaster, paymasterServiceData } from './config'

interface IContext {
  smartAccount: BiconomySmartAccount | undefined
  smartAccountAddress: string | undefined
  sendUserOp:
    | (({
        transactions,
      }: {
        transactions: Transaction[]
      }) => Promise<string | null>)
    | undefined
  connectedUser: UseQueryResult<TalentLayerUserType | null, unknown> | undefined
}

const initialContext: IContext = {
  smartAccount: undefined,
  sendUserOp: undefined,
  smartAccountAddress: undefined,
  connectedUser: undefined,
}

export default function BiconomyProvider(props: React.PropsWithChildren) {
  const { signer } = useAuth()
  const [smartAccountAddress, setSmartAccountAddress] = React.useState<string>()
  const [smartAccount, setSmartAccount] = React.useState<BiconomySmartAccount>()

  const init = React.useCallback(async () => {
    if (signer) {
      log('📜 | Smart account init')
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
      if (!smartAccount) return null
      log('🎟️ | Send user op')

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

  const connectedUserQuery = useQuery<TalentLayerUserType | null>({
    queryKey: ['connected-user', smartAccountAddress],
    enabled: Boolean(smartAccountAddress),
    queryFn: async () => {
      if (!smartAccountAddress) return null
      log('👤 | Get TL connected-user')

      const data = await getTalentLayerUser({ address: smartAccountAddress })
      return data
    },
  })

  const value = React.useMemo(
    () => ({
      sendUserOp,
      smartAccount,
      smartAccountAddress,
      connectedUser: connectedUserQuery,
    }),
    [connectedUserQuery, sendUserOp, smartAccount, smartAccountAddress]
  )

  return <BiconomyContext.Provider value={value} {...props} />
}

export const BiconomyContext = React.createContext<IContext>(initialContext)
