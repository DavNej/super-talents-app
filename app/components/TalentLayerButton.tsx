'use client'

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

import {
  useAuth,
  useProfileData,
  useUploadToIPFS,
  useUpdateProfileData,
  useMintProfile,
} from '@/lib/hooks'
import { IPFSProfileType } from '@/lib/profile/types'
import { deepEqual, log } from '@/lib/utils'
import { Button } from '@/app/components'

export default function TalentLayerButton({
  handle,
  profileToUpload,
}: {
  handle: string
  profileToUpload: IPFSProfileType
}) {
  const { signerAddress } = useAuth()
  const [pinataCid, setPinataCid] = useLocalStorage('pinataCid', '')
  const profileData = useProfileData({ cid: pinataCid })
  const uploadToIPFS = useUploadToIPFS({ onSuccess: setPinataCid })

  const updateProfileData = useUpdateProfileData()
  const mintProfile = useMintProfile({
    onMutate() {
      if (deepEqual(profileData.data, profileToUpload)) {
        log('🪐 Not uploading, data already on IPFS', )
        return
      }
      uploadToIPFS.mutate({ name: handle, content: profileToUpload })
    },
    onSuccess({ profileId }) {
      updateProfileData.mutate({ profileId, cid: pinataCid })
    },
  })

  function handleClick() {
    if (!signerAddress) return
    mintProfile.mutate({ handle, address: signerAddress })
  }

  return (
    <Button
      isLoading={uploadToIPFS.isLoading || mintProfile.isLoading}
      isDisabled={!signerAddress}
      onClick={handleClick}>
      Mint my profile NFT
    </Button>
  )
}
