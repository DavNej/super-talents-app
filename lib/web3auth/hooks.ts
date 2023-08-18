import { toast } from 'react-toastify'
import { ethers } from 'ethers'

import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { web3auth } from './config'
import {
  getWeb3AuthSigner,
  web3authInit,
  web3authLogin,
  web3authLogout,
} from './helpers'
import { ILoginParams } from './types'

type TSigner = {
  signer: ethers.providers.JsonRpcSigner
  address: string
} | null

export function useWeb3AuthInit(options?: UseQueryOptions<TSigner>) {
  const queryClient = useQueryClient()

  const enabled = Boolean(
    web3auth.status === 'disconnected' || web3auth.status === 'not_ready'
  )

  return useQuery<TSigner>({
    queryKey: ['web3auth init'],
    queryFn: () => web3authInit(),
    enabled,
    onError(err) {
      console.error(err)
      toast.error('Auth initilization failed')
    },
    onSuccess() {
      queryClient.invalidateQueries(['signer'])
    },
    ...options,
  })
}

export function useWeb3AuthLogin(
  options?: UseMutationOptions<TSigner, unknown, ILoginParams>
) {
  const queryClient = useQueryClient()

  return useMutation<TSigner, unknown, ILoginParams>({
    mutationFn: ({ loginProvider, email }) =>
      web3authLogin({ loginProvider, email }),
    onError(err) {
      console.error(err)
      toast.error('Login failed')
    },
    onSuccess() {
      queryClient.invalidateQueries(['signer'])
    },
    ...options,
  })
}

export function useWeb3AuthLogout(options?: UseMutationOptions<null>) {
  const queryClient = useQueryClient()

  return useMutation<null>({
    mutationFn: () => web3authLogout(),
    onError(err) {
      console.error(err)

      toast.error('Logout failed')
    },
    onSuccess() {
      queryClient.invalidateQueries(['signer'])
    },
    ...options,
  })
}

export function useSigner(options?: UseQueryOptions<TSigner>) {
  const enabled = Boolean(web3auth.provider && web3auth.status === 'connected')

  return useQuery<TSigner>({
    queryKey: ['signer'],
    queryFn: () => getWeb3AuthSigner(),
    enabled,
    onError(err) {
      console.error(err)
      toast.error('Could not get signer')
    },
    ...options,
  })
}
