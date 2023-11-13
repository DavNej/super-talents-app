'use client'
import React from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { type ADAPTER_STATUS_TYPE, WALLET_ADAPTERS } from '@web3auth/base'

import { log } from '@/utils'

import { web3auth, type Web3AuthLoginParams } from './config'

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
}

const initialContext: IContext = {
  status: 'not_ready',
  isConnected: false,
  signer: undefined,
  signerAddress: undefined,
  login: undefined,
  logout: undefined,
}

export default function AuthProvider(props: React.PropsWithChildren) {
  const [signerAddress, setSignerAddress] = React.useState<string | null>(null)
  const [signer, setSigner] =
    React.useState<ethers.providers.JsonRpcSigner | null>(null)

  const [status, setStatus] = React.useState(web3auth.status)
  const isConnected = web3auth.connected

  const init = React.useCallback(async () => {
    if (web3auth.status === 'not_ready') {
      log('🔑 | Init auth')
      await web3auth.init()
      setStatus(web3auth.status)
    }
  }, [])

  const login = React.useCallback(
    async ({ loginProvider, email }: Web3AuthLoginParams) => {
      if (web3auth.connected) return null
      log('🔑 | Login')
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
    if (!web3auth.connected) return null
    log('🔑 | Logout')
    await web3auth.logout()
    setStatus(web3auth.status)
    return web3auth.status
  }, [])

  const getSigner = React.useCallback(async () => {
    if (web3auth.provider) {
      log('🔑 | Get signer')
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
    }),
    [status, isConnected, signer, signerAddress, loginMutation, logoutMutation]
  )

  return <AuthContext.Provider value={value} {...props} />
}

export const AuthContext = React.createContext<IContext>(initialContext)
