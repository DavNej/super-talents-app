'use client'

import { useLocalStorage } from 'usehooks-ts'

import type { BaseProfileType } from '@/features/profile'
import type { DataUrlType } from '@/utils/data-url'

export function useCache() {
  const [handle, setHandle] = useLocalStorage('handle', '')
  const [pinataCid, setPinataCid] = useLocalStorage('pinataCid', '')

  const [avatars, setAvatars] = useLocalStorage<DataUrlType[]>('avatars', [])
  const [selectedAvatar, setSelectedAvatar] =
    useLocalStorage<DataUrlType | null>('selectedAvatar', null)

  const [newProfile, setNewProfile] = useLocalStorage<BaseProfileType | null>(
    'newProfile',
    null
  )

  function clearCache() {
    setHandle('')
    setPinataCid('')
    setAvatars([])
    setSelectedAvatar(null)
    setNewProfile(null)
  }

  return {
    newProfile,
    setNewProfile,
    avatars,
    setAvatars,
    selectedAvatar,
    setSelectedAvatar,
    handle,
    setHandle,
    pinataCid,
    setPinataCid,
    clearCache,
  }
}
