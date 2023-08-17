'use client'

import * as React from 'react'
import type { IProfile } from './types'

const ProfileContext = React.createContext<{
  profile: IProfile | null
  setProfile: React.Dispatch<React.SetStateAction<IProfile | null>>
  connectedProfile: IProfile | null
  setConnectedProfile: React.Dispatch<React.SetStateAction<IProfile | null>>
}>({
  profile: null,
  setProfile: () => {},
  connectedProfile: null,
  setConnectedProfile: () => {},
})

export function useProfile() {
  const context = React.useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within the ProfileProvider')
  }
  return context
}

export function ProfileProvider(props: React.PropsWithChildren) {
  const [profile, setProfile] = React.useState<IProfile | null>(null)
  const [connectedProfile, setConnectedProfile] =
    React.useState<IProfile | null>(null)

  const value = React.useMemo(
    () => ({
      profile,
      setProfile,
      connectedProfile,
      setConnectedProfile,
    }),
    [profile, setProfile, connectedProfile, setConnectedProfile]
  )

  return <ProfileContext.Provider value={value} {...props} />
}
