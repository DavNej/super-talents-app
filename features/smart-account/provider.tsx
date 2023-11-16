'use client'

import React from 'react'
import { toast } from 'react-toastify'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useAccount } from '@particle-network/connect-react-ui'
import { ethers } from 'ethers'
import { BiconomySmartAccount } from '@biconomy/account'
import type { Transaction, UserOperation } from '@biconomy/core-types'
import type {
  IHybridPaymaster,
  SponsorUserOperationDto,
} from '@biconomy/paymaster'

import { getTalentLayerUser } from '@/features/talent-layer'
import { type TalentLayerUserType } from '@/features/talent-layer/types'
import { log } from '@/utils'

import { chainId, bundler, paymaster, paymasterServiceData } from './config'

const RPC_TARGET = process.env.NEXT_PUBLIC_RPC_TARGET as string

interface IContext {
  signer: ethers.providers.JsonRpcSigner | undefined
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
  signer: undefined,
  smartAccount: undefined,
  sendUserOp: undefined,
  smartAccountAddress: undefined,
  connectedUser: undefined,
}

export default function SmartAccountProvider(props: React.PropsWithChildren) {
  const account = useAccount()

  const [smartAccountAddress, setSmartAccountAddress] = React.useState<string>()
  const [smartAccount, setSmartAccount] = React.useState<BiconomySmartAccount>()
  const [signer, setSigner] = React.useState<ethers.providers.JsonRpcSigner>()

  const init = React.useCallback(async () => {
    if (account) {
      log('⚛️ | connected EOA', account)
      log('📜 | Smart account init')
      const ethersProvider = new ethers.providers.JsonRpcProvider(RPC_TARGET)
      const _signer = ethersProvider.getSigner(account)

      try {
        const biconomySmartAccount = new BiconomySmartAccount({
          signer: _signer,
          chainId,
          bundler,
          paymaster,
        })

        const _smartAccount = await biconomySmartAccount.init()
        const _address = await _smartAccount.getSmartAccountAddress()

        setSmartAccount(_smartAccount)
        setSmartAccountAddress(_address)
        setSigner(_signer)
        log('📜 | Smart account created', _address)
      } catch (err) {
        console.error(err)
        toast.error('Could not initialize smart account')
      }
    }
  }, [account])

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
      signer,
      sendUserOp,
      smartAccount,
      smartAccountAddress,
      connectedUser: connectedUserQuery,
    }),
    [connectedUserQuery, sendUserOp, smartAccount, smartAccountAddress, signer]
  )

  return <SmartAccountContext.Provider value={value} {...props} />
}

export const SmartAccountContext = React.createContext<IContext>(initialContext)
