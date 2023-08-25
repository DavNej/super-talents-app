import { redirect } from 'next/navigation'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { Web3AuthLoginParams } from './types'
import { web3auth } from './config'
import { init, login, logout } from './helpers'

type IProvider = {
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
  signerAddress: string
}

export function useAuth() {
  const queryclient = useQueryClient()

  const initQuery = useQuery({
    queryKey: ['web3auth-init'],
    enabled: Boolean(web3auth.status === 'not_ready'),
    queryFn: init,
  })

  const loginMutation = useMutation<
    IProvider | null,
    unknown,
    Web3AuthLoginParams
  >({
    mutationFn: login,
    onError(err) {
      console.error(err)
      toast.error('Login failed')
    },
    onSuccess() {
      queryclient.invalidateQueries(['user'])
      redirect('/profile')
    },
  })

  const logoutMutation = useMutation<null, unknown, void>({
    mutationFn: logout,
    onError(err) {
      console.error(err)
      toast.error('Logout failed')
    },
    onSuccess() {
      queryclient.setQueryData(['web3auth-init'], null)
      queryclient.invalidateQueries(['user'])
      redirect('/login')
    },
  })

  return {
    init: initQuery,
    provider: initQuery.data,
    login: loginMutation,
    logout: logoutMutation,
  }
}
