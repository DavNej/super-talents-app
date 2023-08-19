import React from 'react'
import { ethers } from 'ethers'
import { useQuery, useMutation } from '@tanstack/react-query'
import { BiconomySmartAccount } from '@biconomy/account'
import type { Transaction } from '@biconomy/core-types'

import { init, sendUserOp } from './helpers'

export function useBiconomy({
  signer,
}: {
  signer: ethers.providers.JsonRpcSigner
}) {
  const [smartAccount, setSmartAccount] = React.useState<BiconomySmartAccount>()
  const [address, setAddress] = React.useState<string>()

  useQuery<{
    address: string
    smartAccount: BiconomySmartAccount
  }>({
    queryKey: ['biconomy init', { signer }],
    queryFn: () => init({ signer }),
    enabled: Boolean(signer && !smartAccount),
    onSuccess({ address, smartAccount }) {
      setSmartAccount(smartAccount)
      setAddress(address)
    },
  })

  const userOp = useMutation<
    string | null,
    unknown,
    { transactions: Transaction[] }
  >({
    mutationFn: ({ transactions }) =>
      sendUserOp({ smartAccount, transactions }),
  })

  return { userOp, smartAccount, address }
}
