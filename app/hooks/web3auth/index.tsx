'use client'

import * as React from 'react'
import { WALLET_ADAPTERS } from '@web3auth/base'
import type { Web3AuthNoModal } from '@web3auth/no-modal'
import { web3auth as _web3auth } from './config'
import type { LoginProvider } from './config'
import { ethers } from 'ethers'
import { redirect } from 'next/navigation'
import { ApiError, parseApiError } from '@/lib/fetcher'

const Web3AuthContext = React.createContext<{
  web3auth: Web3AuthNoModal
  init: Function
  logout: Function
  login: Function
  error: ApiError | null
  getSigner: Function
  signer: ethers.JsonRpcSigner | null
  isReady: boolean
  isConnected: boolean
}>({
  web3auth: _web3auth,
  init: () => {},
  getSigner: () => {},
  logout: () => {},
  login: () => {},
  signer: null,
  error: null,
  isReady: false,
  isConnected: false,
})

export function useWeb3Auth() {
  const context = React.useContext(Web3AuthContext)
  if (!context) {
    throw new Error('useWeb3Auth must be used within the Web3AuthProvider')
  }
  return context
}

export function Web3AuthProvider(props: React.PropsWithChildren) {
  const web3authRef = React.useRef(_web3auth)
  const web3auth = web3authRef.current

  const [error, setError] = React.useState<ApiError | null>(null)

  const [isReady, setIsReady] = React.useState(false)
  const [isConnected, setIsConnected] = React.useState(false)
  const [signer, setSigner] = React.useState<ethers.JsonRpcSigner | null>(null)

  const getSigner = React.useCallback(async () => {
    if (web3auth.provider) {
      const provider = new ethers.BrowserProvider(web3auth.provider)
      const _signer = await provider.getSigner()
      setSigner(_signer)
    }
  }, [web3auth.provider])

  const init = React.useCallback(async () => {
    if (web3auth.status === 'disconnected' || web3auth.status === 'not_ready') {
      console.log('🦋 | React.useEffect | web3auth', web3auth)
      web3auth
        .init()
        .then(() => {
          setIsReady(true)
          if (web3auth.status === 'connected') {
            setIsConnected(true)
            getSigner()
          }
        })
        .catch(err => {
          const _error = parseApiError(err)
          setError(_error)
        })
    }
  }, [web3auth, getSigner])

  const login = React.useCallback(
    async (loginProvider: LoginProvider, email?: string) => {
      const loginParams =
        loginProvider === 'email_passwordless'
          ? { loginProvider, extraLoginOptions: { login_hint: email } }
          : { loginProvider }

      await web3auth
        .connectTo(WALLET_ADAPTERS.OPENLOGIN, loginParams)
        .then(res => {
          redirect('/profile/new/info')
        })
        .catch(err => {
          const _error = parseApiError(err)
          setError(_error)
        })
    },
    [web3auth]
  )

  const logout = React.useCallback(async () => {
    if (web3auth.status === 'connected') {
      await web3auth
        .logout()
        .then(res => {
          setSigner(null)
          setIsConnected(false)
          redirect('/login')
        })
        .catch(err => {
          const _error = parseApiError(err)
          setError(_error)
        })
    }
  }, [web3auth])

  const value = React.useMemo(
    () => ({
      web3auth,
      init,
      logout,
      login,
      signer,
      isReady,
      isConnected,
      getSigner,
      error,
    }),
    [
      web3auth,
      init,
      logout,
      login,
      error,
      signer,
      isReady,
      isConnected,
      getSigner,
    ]
  )

  return <Web3AuthContext.Provider value={value} {...props} />
}
