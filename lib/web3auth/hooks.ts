import { toast } from 'react-toastify'
import { ethers } from 'ethers'

import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { ILoginParams } from './types'
import { web3auth } from './config'
import {
  getWeb3AuthSigner,
  web3authInit,
  web3authLogin,
  web3authLogout,
} from '.'

export type TSigner = {
  signer: ethers.providers.JsonRpcSigner
  address: string
} | null

export function useWeb3AuthInit(options?: UseQueryOptions<TSigner>) {
  return useQuery<TSigner>({
    queryKey: ['web3auth-init'],
    queryFn: () => web3authInit(),
    onError(err) {
      console.error(err)
      toast.error('Auth initilization failed')
    },
    ...options,
  })
}

export function useSigner(options?: UseQueryOptions<TSigner>) {
  return useQuery<TSigner>({
    queryKey: ['signer', web3auth.status],
    queryFn: () => getWeb3AuthSigner(),
    onError(err) {
      console.error(err)
      toast.error('Could not get signer')
    },
    ...options,
  })
}

export function useWeb3AuthLogin(
  options?: UseMutationOptions<TSigner, unknown, ILoginParams>
) {
  return useMutation<TSigner, unknown, ILoginParams>({
    mutationFn: ({ loginProvider, email }) =>
      web3authLogin({ loginProvider, email }),
    onError(err) {
      console.error(err)
      toast.error('Login failed')
    },
    ...options,
  })
}

export function useWeb3AuthLogout(options?: UseMutationOptions<null>) {
  return useMutation<null>({
    mutationFn: () => web3authLogout(),
    onError(err) {
      console.error(err)
      toast.error('Logout failed')
    },
    ...options,
  })
}
