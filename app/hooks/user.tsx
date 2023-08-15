'use client'

import * as React from 'react'

import { getTalentLayerUser, type ITalentLayerUser } from '@/lib/talent-layer'
import { useWeb3Auth } from './web3auth'

type IUser =
  | ITalentLayerUser
  | { id: null; handle: null; address: null; cid: null }

const initialValue = { id: null, handle: null, address: null, cid: null }

const UserContext = React.createContext<IUser>(initialValue)

export function useUser() {
  const context = React.useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within the UserProvider')
  }
  return context
}

export function UserProvider(props: React.PropsWithChildren) {
  const { signer } = useWeb3Auth()
  const [user, setUser] = React.useState<IUser>(initialValue)

  React.useEffect(() => {
    async function getUser() {
      if (signer) {
        const _address = await signer.getAddress()
        const _user = await getTalentLayerUser(_address)
        if (_user) {
          setUser(_user)
        }
      }
    }

    getUser()
  }, [signer])

  const value = React.useMemo(() => user, [user])

  return <UserContext.Provider value={value} {...props} />
}
