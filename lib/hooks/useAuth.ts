import { toast } from 'react-toastify'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { web3auth } from '@/lib/web3auth/config'
import type { ADAPTER_STATUS_TYPE } from '@web3auth/base'

import type { Web3AuthLoginParams } from '@/lib/web3auth/types'
import { getProvider, init, login, logout } from '@/lib/web3auth/helpers'

import { TalentLayerUserType } from '@/lib/talent-layer/types'
import { TalentLayerUser } from '@/lib/talent-layer/schemas'
import { log } from '@/lib/utils'
import { getTalentLayerUser } from '@/lib/talent-layer/subgraph'

export function useInitAuth() {
  return useQuery({
    queryKey: ['auth-init'],
    enabled: Boolean(web3auth.status === 'not_ready'),
    queryFn: init,
  })
}

export function useAuth() {
  const queryClient = useQueryClient()

  const providerQuery = useQuery({
    queryKey: ['provider'],
    enabled: Boolean(web3auth.provider && web3auth.connected),
    queryFn: getProvider,
  })

  const address = providerQuery.data?.signerAddress

  const connectedUserQuery = useQuery<TalentLayerUserType | null>({
    queryKey: ['connected-user'],
    enabled: Boolean(address),
    queryFn: async () => {
      log('👤 | TL connected-user')
      if (!address) return null
      log('👤 | TL connected-user hit')

      const data = await getTalentLayerUser({ address })
      if (!data) return null

      const result = TalentLayerUser.safeParse(data)
      if (result.success) return result.data

      console.warn(
        'Zod validation',
        JSON.stringify(result.error.issues, null, 2)
      )

      toast.warn('Wrong TalentLayer user format', { toastId: 'wrong format' })
      return data as TalentLayerUserType
    },
  })

  const loginMutation = useMutation<
    ADAPTER_STATUS_TYPE | null,
    unknown,
    Web3AuthLoginParams
  >({
    mutationFn: login,
    onError(err) {
      console.error(err)
      toast.error('Login failed')
    },
    onSuccess() {
      queryClient.invalidateQueries(['provider'])
      queryClient.invalidateQueries(['connected-user'])
      queryClient.setQueryData(['auth-init'], web3auth.status)
    },
  })

  const logoutMutation = useMutation<ADAPTER_STATUS_TYPE | null, unknown, void>(
    {
      mutationFn: logout,
      onError(err) {
        console.error(err)
        toast.error('Logout failed')
      },
      onSuccess() {
        queryClient.setQueryData(['connected-user'], null)
        queryClient.setQueryData(['provider'], null)
        queryClient.setQueryData(['auth-init'], web3auth.status)
      },
    }
  )

  return {
    provider: providerQuery,
    login: loginMutation,
    logout: logoutMutation,
    connectedUser: connectedUserQuery,
  }
}
