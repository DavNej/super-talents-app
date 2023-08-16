'use client'

import * as React from 'react'
import { type Signer, ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

import type { ADAPTER_STATUS_TYPE } from '@web3auth/base'
import { WALLET_ADAPTERS } from '@web3auth/base'
import type { Web3AuthNoModal } from '@web3auth/no-modal'

import { web3auth as _web3auth, type LoginProvider } from './config'

const Web3AuthContext = React.createContext<{
  web3auth: Web3AuthNoModal
  init: Function
  logout: Function
  login: Function
  signer: Signer | null
  status: ADAPTER_STATUS_TYPE
}>({
  web3auth: _web3auth,
  init: () => {},
  logout: () => {},
  login: () => {},
  signer: null,
  status: 'not_ready',
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
  const router = useRouter()

  const [signer, setSigner] = React.useState<Signer | null>(null)
  const [status, setStatus] = React.useState<ADAPTER_STATUS_TYPE>('not_ready')

  const getSigner = React.useCallback(async () => {
    if (web3auth.provider) {
      const provider = new ethers.providers.Web3Provider(web3auth.provider)
      const _signer = await provider.getSigner()
      console.log('🦋 | signer', _signer)
      setSigner(_signer)
    }
  }, [web3auth.provider])

  const init = React.useCallback(async () => {
    if (web3auth.status === 'disconnected' || web3auth.status === 'not_ready') {
      web3auth
        .init()
        .then(() => {
          setStatus(web3auth.status)
          if (web3auth.status === 'connected') {
            getSigner()
          }
        })
        .catch(err => {
          console.error(err)
          toast.error('Auth initilization failed')
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
        .then(async res => {
          console.log('logged in')
          setStatus(web3auth.status)
          await getSigner()
          router.push('/profile')
        })
        .catch(err => {
          console.error(err)
          toast.error('Login failed')
        })
    },
    [getSigner, router, web3auth]
  )

  const logout = React.useCallback(async () => {
    if (!(web3auth.status === 'connected')) return

    await web3auth
      .logout()
      .then(res => {
        console.log('Logged out')
        setSigner(null)
        setStatus(web3auth.status)
        router.push('/login')
      })
      .catch(err => {
        console.error(err)
        toast.error('Logout failed')
      })
  }, [router, web3auth])

  const value = React.useMemo(
    () => ({
      web3auth,
      init,
      logout,
      login,
      signer,
      status,
    }),
    [web3auth, init, logout, login, signer, status]
  )

  return <Web3AuthContext.Provider value={value} {...props} />
}
