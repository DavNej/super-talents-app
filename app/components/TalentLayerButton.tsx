'use client'

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

import {
  useProfileData,
  useUploadToIPFS,
  useUpdateProfileData,
  useMintProfile,
} from '@/lib/hooks'
import { IPFSProfileType } from '@/lib/profile/types'
import { deepEqual, log } from '@/lib/utils'
import { Button } from '@/app/components'
import { useBiconomy } from '@/lib/hooks/useBiconomy'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export default function TalentLayerButton({
  handle,
  profileToUpload,
}: {
  handle: string
  profileToUpload: IPFSProfileType
}) {
  const router = useRouter()
  const { smartAccountAddress } = useBiconomy()
  const [pinataCid, setPinataCid] = useLocalStorage('pinataCid', '')
  const profileData = useProfileData({ cid: pinataCid })
  const uploadToIPFS = useUploadToIPFS({ onSuccess: setPinataCid })
  const qc = useQueryClient()
  const updateProfileData = useUpdateProfileData({
    onSuccess(txHash) {
      toast.success(`Profil successfully minted 🎉\nTx hash: ${txHash}`)
      router.push(`/${handle}`)
    },
  })

  const mintProfile = useMintProfile({
    onMutate() {
      if (deepEqual(profileData.data, profileToUpload)) {
        log('🪐 Not uploading, data already on IPFS')
        return
      }
      uploadToIPFS.mutate({ name: handle, content: profileToUpload })
    },
    onSuccess({ profileId }) {
      updateProfileData.mutate({ profileId, cid: pinataCid })
    },
  })

  function handleClick() {
    if (!smartAccountAddress) return
    mintProfile.mutate({ handle, address: smartAccountAddress })
  }

  return (
    <Button
      isLoading={
        uploadToIPFS.isLoading ||
        mintProfile.isLoading ||
        updateProfileData.isLoading
      }
      isDisabled={!smartAccountAddress}
      onClick={handleClick}>
      Mint my profile NFT
    </Button>
  )
}
