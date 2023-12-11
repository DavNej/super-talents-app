'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useMediaQuery } from 'react-responsive'

import {
  useUpdateProfileData,
  useConnectedTalentLayerUser,
} from '@/features/talent-layer'
import { useProfileData, validateIPFSProfile } from '@/features/profile'
import { useUploadToIPFS } from '@/features/ipfs'
import { ProfilePreview, Title, Button } from '@/app/components'
import { breakpoints, deepEqual } from '@/utils'

import { useCache } from '../useCache'

export default function ProfilePreviewPage() {
  const isMediumScreen = useMediaQuery({ minWidth: breakpoints.md })

  const { pinataCid, setPinataCid, selectedAvatar, newProfile, clearCache } =
    useCache()

  const profileToUpload = validateIPFSProfile({
    ...newProfile,
    picture: selectedAvatar,
  })

  const connectedUser = useConnectedTalentLayerUser()
  const { id: profileId, handle } = connectedUser.data || {}

  const { data: profileData } = useProfileData({ cid: pinataCid })
  const updateProfileDataMutation = useUpdateProfileData()

  const uploadToIPFSMutation = useUploadToIPFS({
    onSuccess(cid) {
      setPinataCid(cid)
      if (profileId) {
        updateProfileDataMutation.mutate({ profileId, cid: pinataCid })
      }
    },
  })

  if (updateProfileDataMutation.isSuccess) {
    // clearCache()
    redirect(`/${handle}`)
  }

  function handleClick() {
    if (!profileId || !handle) return
    if (!deepEqual(profileData, profileToUpload)) {
      uploadToIPFSMutation.mutate({ name: handle, content: profileToUpload })
    } else {
      updateProfileDataMutation.mutate({ profileId, cid: pinataCid })
    }
  }

  function SubmitButton() {
    return (
      <Button
        isLoading={
          uploadToIPFSMutation.isLoading || updateProfileDataMutation.isLoading
        }
        isDisabled={!profileId || updateProfileDataMutation.isSuccess}
        onClick={handleClick}>
        Save profile info
      </Button>
    )
  }

  return (
    <>
      <div className='flex justify-between items-center mt-3 mb-6'>
        <Title className='my-0'>Profile preview</Title>
        {isMediumScreen && <SubmitButton />}
      </div>

      {profileToUpload && handle && (
        <ProfilePreview
          handle={handle}
          profileData={profileToUpload}
          isSigner
        />
      )}

      <br className='mt-6 md:mt-0' />

      {!isMediumScreen && <SubmitButton />}
    </>
  )
}
