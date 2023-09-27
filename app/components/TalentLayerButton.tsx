'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'
import { toast } from 'react-toastify'

import { Button } from '@/app/components'
import type { IPFSProfileType } from '@/features/profile/types'
import { useProfileData } from '@/features/profile'
import { useBiconomy } from '@/features/biconomy'
import { useUploadToIPFS } from '@/features/ipfs'
import { useUpdateProfileData, useMintProfile } from '@/features/talent-layer'
import { deepEqual, log } from '@/utils'

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
  const [, setAvatars] = useLocalStorage('avatars', [])
  const [, setSelectedAvatar] = useLocalStorage('selectedAvatar', null)
  const [, setNewProfile] = useLocalStorage('newProfile', null)

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
      setPinataCid('')
      setAvatars([])
      setSelectedAvatar(null)
      setNewProfile(null)
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
