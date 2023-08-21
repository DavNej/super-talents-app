'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'

import { BackLink, Button } from '@/app/app/components'

import { useSigner } from '@/lib/web3auth/hooks'
import type { IPFSProfileType, NewProfileType } from '@/features/profile/types'
import { IPFSProfile } from '@/features/profile/validate'

import { ProfilePreview } from '@/features/profile'
import { useUser } from '@/features/profile/hooks'
import { DataUrlType } from '@/lib/avatar/types'
import { toast } from 'react-toastify'
import { useUploadToIPFS } from '@/lib/ipfs/hooks'

export default function ProfilePreviewPage() {
  const router = useRouter()
  const [newProfile] = useLocalStorage<NewProfileType | null>(
    'newProfile',
    null
  )
  const [selectedAvatar] = useLocalStorage<DataUrlType | null>(
    'selectedAvatar',
    null
  )
  const [pinataCid, setPinataCid] = useLocalStorage('pinataCid', '')

  const signer = useSigner()
  const connectedUser = useUser({ address: signer.data?.address })
  const uploadToIPFS = useUploadToIPFS()

  let redirectPath = ''

  if (!newProfile) {
    redirectPath = '/app/profile/new/info'
  }

  if (!selectedAvatar) {
    redirectPath = '/app/profile/new/avatar'
  }

  React.useEffect(() => {
    if (redirectPath) {
      router.push(redirectPath)
    }
  }, [redirectPath, router])

  React.useEffect(() => {
    if (uploadToIPFS.data) {
      setPinataCid(uploadToIPFS.data)
    }
  }, [setPinataCid, uploadToIPFS.data])

  let IPFSProfileData: IPFSProfileType

  const dataToUpload = newProfile && { ...newProfile, picture: selectedAvatar }
  const handle = newProfile?.handle
  const result = IPFSProfile.safeParse(dataToUpload)

  if (result.success) {
    IPFSProfileData = result.data
  } else {
    toast.error('Could not parse data before upload')
    console.error(result.error.issues)
    IPFSProfileData = dataToUpload as IPFSProfileType
  }

  function handleClick() {
    if (!handle) {
      console.error('missing connectedProfile handle')
      return
    }

    uploadToIPFS.mutate({ name: handle, content: IPFSProfileData })
  }

  return redirectPath ? null : (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <div className='mb-12 flex justify-between items-center'>
          <h3 className='font-semibold text-5xl whitespace-nowrap'>
            Profile preview
          </h3>
          <Button isLoading={uploadToIPFS.isLoading} onClick={handleClick}>
            {connectedUser.data === null
              ? 'Mint my profile NFT'
              : 'Update profile'}
          </Button>
        </div>

        {handle && IPFSProfileData && (
          <ProfilePreview
            handle={handle}
            profileData={IPFSProfileData}
            isSigner
          />
        )}
      </div>
    </main>
  )
}
