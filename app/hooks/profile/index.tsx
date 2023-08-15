'use client'

import * as React from 'react'
import type { IProfile } from './types'

export const initialValues: IProfile = {
  handle: '',
  name: '',
  about: '',
  skills: [],
  github: '',
  otherLink: '',
  portefolio: '',
  twitter: '',
  role: '',
  picture: '',
}

const ProfileContext = React.createContext<{
  profile: IProfile
  setProfile: React.Dispatch<React.SetStateAction<IProfile>>
}>({ profile: initialValues, setProfile: () => {} })

export function useProfile() {
  const context = React.useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within the ProfileProvider')
  }
  return context
}

export function ProfileProvider(props: React.PropsWithChildren) {
  const [profile, setProfile] = React.useState(initialValues)

  const value = React.useMemo(
    () => ({
      profile,
      setProfile,
    }),
    [profile, setProfile]
  )

  return <ProfileContext.Provider value={value} {...props} />
}
