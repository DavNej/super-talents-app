'use client'

import mockAvatars from '@/mocks/avatars'
import mockprofile, { pinataCid as mockPinataCid, handle as mockHandle } from '@/mocks/profile'

import { useCache } from '../create-profile/useCache'

export default function MocksPage() {
  const {
    setNewProfile,
    setAvatars,
    setHandle,
    setPinataCid,
    setSelectedAvatar,
  } = useCache()

  return (
    <main className='p-4 md:p-24 bg-purple-500 flex flex-col gap-4 h-screen'>
      <button
        className='border-2 border-white p-2'
        onClick={() => {
          setNewProfile(mockprofile)
          console.log('🌻 setNewProfile', mockprofile)
        }}>
        Set newProfile
      </button>

      <button
        className='border-2 border-white p-2'
        onClick={() => {
          setSelectedAvatar(mockAvatars[0])
          console.log('🌻 setSelectedAvatar', mockAvatars[0])
        }}>
        Set selectedAvatar
      </button>

      <button
        className='border-2 border-white p-2'
        onClick={() => {
          setAvatars(mockAvatars)
          console.log('🌻 setAvatars', mockAvatars)
        }}>
        Set avatars
      </button>

      <button
        className='border-2 border-white p-2'
        onClick={() => {
          setHandle(mockHandle)
          console.log('🌻 setHandle', mockHandle)
        }}>
        Set handle
      </button>

      <button
        className='border-2 border-white p-2'
        onClick={() => {
          setPinataCid(mockPinataCid)
          console.log('🌻 setPinataCid', mockPinataCid)
        }}>
        Set pinataCid
      </button>
    </main>
  )
}
