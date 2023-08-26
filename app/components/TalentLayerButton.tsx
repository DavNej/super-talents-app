'use client'

import React from 'react'

import { useLocalStorage } from 'usehooks-ts'

import { IPFSProfileType } from '@/lib/profile/types'
import {
  useAuth,
  useProfileData,
  useProfileIdOfHandle,
  useUploadToIPFS,
} from '@/lib/hooks'
import { Button } from '@/app/components'

import { useTalentLayerContract } from '@/lib/hooks'
import { deepEqual } from '@/lib/utils'

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
  const uploadToIPFS = useUploadToIPFS({
    onSuccess: onIPFSUploadSuccess,
  })

  const { mintProfile, updateProfileData } = useTalentLayerContract()
  const { data: talentLayerId } = useProfileIdOfHandle({ handle })
  const hasTalentLayerId = talentLayerId || talentLayerId === 0
  const signerAddress = provider?.signerAddress

  async function onIPFSUploadSuccess(cid: string) {
    setPinataCid(cid)
    if (!signerAddress) return
    if (!hasTalentLayerId) {
      mintProfile.mutate({ handle, address: signerAddress })
    } else {
      updateProfileData.mutate({ cid, id: talentLayerId })
    }
  }

  async function handleClick() {
    if (buttonIsDisabled) return
    uploadToIPFS.mutate({ name: handle, content: dataToUpload })
  }

  const buttonIsDisabled =
    !signerAddress || !handle || !deepEqual(profileData.data, dataToUpload)

  return (
    <Button
      isLoading={uploadToIPFS.isLoading}
      isDisabled={buttonIsDisabled}
      onClick={handleClick}>
      Mint my profile NFT
    </Button>
  )
}
