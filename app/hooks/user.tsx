'use client'
import * as React from 'react'

import { getTalentLayerUser, type ITalentLayerUser } from '@/lib/talent-layer'
import { useWeb3Auth } from './web3auth'

const initialValue = {
  user: null,
  isFetched: false,
}

const UserContext = React.createContext<{
  user: ITalentLayerUser | null
  isFetched: boolean
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

  const [isFetched, setIsFetched] = React.useState(false)
  const [user, setUser] = React.useState<ITalentLayerUser | null>(null)

  React.useEffect(() => {
    ;async () => {
      if (signer) {
        const address = await signer.getAddress()
        const _user = await getTalentLayerUser(address)
        if (_user) {
          setUser(_user)
        }
        setIsFetched(true)
      }
    }
  }, [signer])

  const value = React.useMemo(
    () => ({
      user,
      isFetched,
    }),
    [user, isFetched]
  )

  return <UserContext.Provider value={value} {...props} />
}
