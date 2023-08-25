import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { web3auth } from '@/lib/web3auth/config'
import { Web3AuthLoginParams } from '@/lib/web3auth/types'
import { init, login, logout } from '@/lib/web3auth/helpers'

type IProvider = {
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
  signerAddress: string
}

export default function useAuth() {
  const queryclient = useQueryClient()

  const initQuery = useQuery({
    queryKey: ['auth-init'],
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
    onSuccess(provider) {
      queryclient.setQueryData(['auth-init'], provider)
      queryclient.invalidateQueries(['connected-user'])
    },
  })

  const logoutMutation = useMutation<null, unknown, void>({
    mutationFn: logout,
    onError(err) {
      console.error(err)
      toast.error('Logout failed')
    },
    onSuccess() {
      queryclient.setQueryData(['auth-init'], null)
      queryclient.invalidateQueries(['connected-user'])
    },
  })

  return {
    init: initQuery,
    provider: initQuery.data,
    login: loginMutation,
    logout: logoutMutation,
  }
}
