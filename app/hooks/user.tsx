'use client'
import * as React from 'react'
import { useWeb3Auth } from './web3auth'

import {
  type IGetTalentLayerUserArgs,
  getTalentLayerUser,
} from '@/app/hooks/talent-layer/graph'
import type { ITalentLayerUser } from '@/app/hooks/talent-layer/config'

const initialValue = {
  user: null,
  connectedUser: null,
  getUser: () => {},
  getConnectedUser: () => {},
}

const UserContext = React.createContext<{
  user: ITalentLayerUser | null
  connectedUser: ITalentLayerUser | null
  getUser: (args: IGetTalentLayerUserArgs) => void
  getConnectedUser: () => void
}>(initialValue)

export function useUser() {
  const context = React.useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within the UserProvider')
  }
  return context
}

export function UserProvider(props: React.PropsWithChildren) {
  const { signer } = useWeb3Auth()

  const [user, setUser] = React.useState<ITalentLayerUser | null>(null)
  const [connectedUser, setConnectedUser] =
    React.useState<ITalentLayerUser | null>(null)

  const getUser = React.useCallback(
    async ({ handle, address }: IGetTalentLayerUserArgs) => {
      console.log('getting user')
      const _user = await getTalentLayerUser({ handle, address })
      if (_user) {
        setUser(_user)
      }
    },
    []
  )

  const getConnectedUser = React.useCallback(async () => {
    if (signer) {
      const address = await signer.getAddress()
      console.log('🦋 | Getting connected user')
      const _user = await getTalentLayerUser({ address })
      if (_user) {
        setConnectedUser(_user)
      }
    }
  }, [signer])

  React.useEffect(() => {
    getConnectedUser()
  }, [getConnectedUser])

  const value = React.useMemo(
    () => ({
      user,
      connectedUser,
      getUser,
      getConnectedUser,
    }),
    [user, connectedUser, getUser, getConnectedUser]
  )

  return <UserContext.Provider value={value} {...props} />
}
