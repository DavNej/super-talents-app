'use client'

import React from 'react'
import { toast } from 'react-toastify'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useAccountInfo } from '@particle-network/connect-react-ui'
import { ethers } from 'ethers'
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account'
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from '@biconomy/modules'
import type { Transaction, UserOperation } from '@biconomy/core-types'

import { getTalentLayerUser } from '@/features/talent-layer'
import { type TalentLayerUserType } from '@/features/talent-layer/types'
import { log } from '@/utils'

import { chainId, bundler, paymaster, paymasterServiceData } from './config'

interface IContext {
  signer: ethers.providers.JsonRpcSigner | undefined
  smartAccount: BiconomySmartAccountV2 | undefined
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
  const { account, particleProvider } = useAccountInfo()

  const [smartAccountAddress, setSmartAccountAddress] = React.useState<string>()
  const [smartAccount, setSmartAccount] =
    React.useState<BiconomySmartAccountV2>()
  const [signer, setSigner] = React.useState<ethers.providers.JsonRpcSigner>()

  React.useEffect(() => {
    async function init() {
      log('⚛️ | connected EOA', account)
      log('📜 | Smart account init')
      const ethersProvider = new ethers.providers.Web3Provider(
        particleProvider as any
      )
      const _signer = ethersProvider.getSigner(account)

      try {
        const ownerShipModule = await ECDSAOwnershipValidationModule.create({
          signer: _signer,
          moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
        })

        const biconomyAccount = await BiconomySmartAccountV2.create({
          chainId,
          bundler,
          paymaster,
          entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
          defaultValidationModule: ownerShipModule,
          activeValidationModule: ownerShipModule,
        })

        const _address = await biconomyAccount.getAccountAddress()

        setSmartAccount(biconomyAccount)
        setSmartAccountAddress(_address)
        setSigner(_signer)
        log('📜 | Smart account created', _address)
      } catch (err) {
        console.error(err)
        toast.error('Could not initialize smart account')
      }
    }

    if (account) {
      init()
    }
  }, [account, particleProvider])

  const sendUserOp = React.useCallback(
    async ({ transactions }: { transactions: Transaction[] }) => {
      if (!smartAccount) return null

      let userOp: Partial<UserOperation>

      log('🎟️ | Transactions', transactions)
      // Build user operations
      try {
        log('🎟️ | Build userOp')
        userOp = await smartAccount.buildUserOp(transactions, {
          paymasterServiceData,
        })
      } catch (err) {
        console.error('💥', err)
        toast.error('Could not build user operation')
        return null
      }

      // Send user operations
      try {
        log('🎟️ | Send userOp')
        const userOpResponse = await smartAccount.sendUserOp(userOp)
        log('🎟️ | Waiting for receipt')
        const { receipt } = await userOpResponse.wait(1)
        log('🤝 | Transaction hash', receipt.transactionHash)
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
