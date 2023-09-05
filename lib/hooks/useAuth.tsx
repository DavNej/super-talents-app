'use client'
import React from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import {
  useQuery,
  useMutation,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query'

import { log } from '@/lib/utils'

import { web3auth, type Web3AuthLoginParams } from '@/lib/web3auth'
import { type ADAPTER_STATUS_TYPE, WALLET_ADAPTERS } from '@web3auth/base'

import { TalentLayerUserType } from '@/lib/talent-layer/types'
import { getTalentLayerUser } from '@/lib/talent-layer/subgraph'

export function AuthProvider(props: React.PropsWithChildren) {
  const [signerAddress, setSignerAddress] = React.useState<string | null>(null)
  const [signer, setSigner] =
    React.useState<ethers.providers.JsonRpcSigner | null>(null)

  const [status, setStatus] = React.useState(web3auth.status)
  const isConnected = web3auth.connected

  const init = React.useCallback(async () => {
    log('🔑 | init')
    if (web3auth.status === 'not_ready') {
      log('🔑 | init hit')
      await web3auth.init()
      setStatus(web3auth.status)
    }
  }, [])

  const login = React.useCallback(
    async ({ loginProvider, email }: Web3AuthLoginParams) => {
      log('🔑 | login')
      if (web3auth.connected) return null
      log('🔑 | login hit')
      const loginParams =
        loginProvider === 'email_passwordless'
          ? { loginProvider, extraLoginOptions: { login_hint: email } }
          : { loginProvider }

      await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, loginParams)
      setStatus(web3auth.status)
      return web3auth.status
    },
    []
  )

  const logout = React.useCallback(async () => {
    log('🔑 | logout')
    if (!web3auth.connected) return null
    log('🔑 | logout hit')
    await web3auth.logout()
    setStatus(web3auth.status)
    return web3auth.status
  }, [])

  const getSigner = React.useCallback(async () => {
    if (web3auth.provider) {
      log('🔑 | get-signer')
      const _provider = new ethers.providers.Web3Provider(web3auth.provider)
      const _signer = _provider.getSigner()
      const _address = await _signer.getAddress()

      setSigner(_signer)
      setSignerAddress(_address)
    }
  }, [])

  React.useEffect(() => {
    init()

    if (isConnected) {
      getSigner()
    }
  }, [getSigner, init, isConnected])

  const connectedUserQuery = useQuery<TalentLayerUserType | null>({
    queryKey: ['connected-user', setSignerAddress],
    enabled: Boolean(signerAddress),
    queryFn: async () => {
      log('👤 | TL connected-user')
      if (!signerAddress) return null
      log('👤 | TL connected-user hit')

      const data = await getTalentLayerUser({ address: signerAddress })
      return data
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
    onSuccess: getSigner,
  })

  const logoutMutation = useMutation<ADAPTER_STATUS_TYPE | null, unknown, void>(
    {
      mutationFn: logout,
      onError(err) {
        console.error(err)
        toast.error('Logout failed')
      },
      onSuccess() {
        setSigner(null)
        setSignerAddress(null)
      },
    }
  )

  const value = React.useMemo(
    () => ({
      status,
      isConnected,
      signer,
      signerAddress: signerAddress,
      login: loginMutation,
      logout: logoutMutation,
      connectedUser: connectedUserQuery,
    }),
    [
      status,
      isConnected,
      signer,
      signerAddress,
      loginMutation,
      logoutMutation,
      connectedUserQuery,
    ]
  )

  return <AuthContext.Provider value={value} {...props} />
}

interface IContext {
  status: ADAPTER_STATUS_TYPE
  isConnected: boolean
  signer: ethers.providers.JsonRpcSigner | null | undefined
  signerAddress: string | null | undefined
  login:
    | UseMutationResult<
        ADAPTER_STATUS_TYPE | null,
        unknown,
        Web3AuthLoginParams,
        unknown
      >
    | undefined
  logout:
    | UseMutationResult<ADAPTER_STATUS_TYPE | null, unknown, void, unknown>
    | undefined
  connectedUser: UseQueryResult<TalentLayerUserType | null, unknown> | undefined
}

const initialContext: IContext = {
  status: 'not_ready',
  isConnected: false,
  signer: undefined,
  signerAddress: undefined,
  login: undefined,
  logout: undefined,
  connectedUser: undefined,
}

const AuthContext = React.createContext<IContext>(initialContext)

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within the AuthProvider')
  }
  return context
}
