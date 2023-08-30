'use client'

import React from 'react'
import { toast } from 'react-toastify'
import { useLocalStorage } from 'usehooks-ts'

import {
  useAuth,
  useProfileData,
  useProfileIdOfHandle,
  useUploadToIPFS,
  useUpdateProfileData,
  useMintProfile,
} from '@/lib/hooks'
import { IPFSProfileType } from '@/lib/profile/types'
import { deepEqual } from '@/lib/utils'
import { Button } from '@/app/components'

export default function TalentLayerButton({
  handle,
  dataToUpload,
}: {
  handle: string
  dataToUpload: IPFSProfileType
}) {
  const { provider } = useAuth()

  const [pinataCid, setPinataCid] = useLocalStorage('pinataCid', '')
  const profileData = useProfileData({ cid: pinataCid })
  const updateProfileData = useUpdateProfileData()
  const { data: talentLayerId } = useProfileIdOfHandle({ handle })
  const handleExists = talentLayerId || talentLayerId === 0
  const signerAddress = provider.data?.signerAddress
  const uploadToIPFS = useUploadToIPFS({ onSuccess: setPinataCid })

  const mintProfile = useMintProfile({
    onMutate() {
      if (deepEqual(profileData.data, dataToUpload)) return
      uploadToIPFS.mutate({ name: handle, content: dataToUpload })
    },
    onSuccess({ profileId }) {
      updateProfileData.mutate({ profileId, cid: pinataCid })
    },
  })

  function handleClick() {
    if (handleExists) {
      toast.error('Handle already exists')
      return
    }
    if (buttonIsDisabled) return

    mintProfile.mutate({ handle, address: signerAddress })
  }

  const buttonIsDisabled = !signerAddress || !handle

  return (
    <Button
      isLoading={uploadToIPFS.isLoading || mintProfile.isLoading}
      isDisabled
      // isDisabled={buttonIsDisabled }
      onClick={handleClick}>
      Mint my profile NFT
    </Button>
  )
}
