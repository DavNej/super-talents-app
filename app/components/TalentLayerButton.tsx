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
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
  const updateProfileData = useUpdateProfileData({
    onSuccess(txHash) {
      toast.success(
        <Link
          href={`https://mumbai.polygonscan.com/tx/${txHash}`}
          target='_blank'>
          Profil successfully minted 🎉
          <br />
          See transaction in explorer
        </Link>,
        { autoClose: false }
      )
      router.push(`/${handle}?`)
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
      isDisabled={!smartAccountAddress || updateProfileData.isSuccess}
      onClick={handleClick}>
      Mint my profile NFT
    </Button>
  )
}
