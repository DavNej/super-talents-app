'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useMediaQuery } from 'react-responsive'

import { ProfilePreview, Title } from '@/app/components'
import { validateIPFSProfile } from '@/features/profile/schemas'
import { useConnectedTalentLayerUser } from '@/features/talent-layer'
import { breakpoints } from '@/utils'

import { MintButton } from '../components'
import { useCache } from '../useCache'

export default function ProfilePreviewPage() {
  const { newProfile, selectedAvatar } = useCache()
  const isMediumScreen = useMediaQuery({ minWidth: breakpoints.md })

  const connectedUser = useConnectedTalentLayerUser()

  if (!selectedAvatar) {
    redirect('/create-profile/avatar')
  }

  if (!newProfile) {
    redirect('/create-profile/info')
  }

  const profileToUpload = validateIPFSProfile({
    ...newProfile,
    picture: selectedAvatar,
  })

  const allowMint = handle && profileToUpload && !talentLayerId

  function MintProfileButton() {
    return allowMint ? (
      <MintButton handle={handle} profileToUpload={profileToUpload} />
    ) : (
      <Button isDisabled>Mint my profile NFT</Button>
    )
  }

  return (
    <>
      <div className='flex justify-between items-center mt-3 mb-6'>
        <Title className='my-0'>Profile preview</Title>
        {isMediumScreen && <MintProfileButton />}
      </div>

      {handle && profileToUpload && (
        <ProfilePreview
          handle={handle}
          profileData={profileToUpload}
          isSigner
        />
      )}

      <br className='mt-6 md:mt-0' />

      {!isMediumScreen && <MintProfileButton />}
    </>
  )
}
