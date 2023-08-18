import { toast } from 'react-toastify'
import { ethers } from 'ethers'

import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { web3auth } from './config'
import { web3authInit } from './helpers'

type TWeb3AuthInit =
  | {
      signer: ethers.providers.JsonRpcSigner
      address: string
    }
  | undefined

export function useWeb3AuthInit(options?: UseQueryOptions<TWeb3AuthInit>) {
  const enabled = Boolean(
    web3auth.status === 'disconnected' || web3auth.status === 'not_ready'
  )

  return useQuery<TWeb3AuthInit>({
    queryKey: ['web3auth init'],
    queryFn: () => web3authInit(),
    enabled,
    onError(err) {
      console.error(err)
      toast.error('Auth initilization failed')
    },
    ...options,
  })
}
