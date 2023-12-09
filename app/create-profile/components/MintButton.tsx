'use client'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'

import { Button } from '@/app/components'
import { useProfileData, type ProfileWithPictureType } from '@/features/profile'
import { useUploadToIPFS } from '@/features/ipfs'
import {
  useUpdateProfileData,
  useMintProfile,
  useConnectedTalentLayerUser,
} from '@/features/talent-layer'
import { deepEqual } from '@/utils'
import { useCache } from '../useCache'

export default function MintButton({
  handle,
  profileToUpload,
}: {
  handle: string
  profileToUpload: ProfileWithPictureType
}) {
  const connectedUser = useConnectedTalentLayerUser()

  const { pinataCid, setPinataCid, clearCache } = useCache()
  const profileData = useProfileData({ cid: pinataCid })
  const uploadToIPFS = useUploadToIPFS({ onSuccess: setPinataCid })
  const updateProfileData = useUpdateProfileData({
    onSuccess(txHash) {
      toast.success(<UploadSuccess txHash={txHash || ''} />, {
        autoClose: false,
        closeOnClick: false,
      })
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
    onSuccess({ profileId, txHash }) {
      toast.success(<MintSuccess txHash={txHash || ''} />, {
        autoClose: false,
        closeOnClick: false,
      })
      updateProfileData.mutate({ profileId, cid: pinataCid })
    },
  })

  if (updateProfileData.isSuccess) {
    // clearCache()
    redirect(`/${handle}`)
  }

  const profileId = connectedUser.data?.id

  function handleClick() {
    if (!profileId) return
  }

  return (
    <Button
      isDisabled={!connectedUser.data || updateProfileData.isSuccess}
      onClick={handleClick}>
      Mint my profile NFT
    </Button>
  )
}

function MintSuccess({ txHash }: { txHash: string }) {
  return (
    <Link href={`https://mumbai.polygonscan.com/tx/${txHash}`} target='_blank'>
      Profile mint success 🎉
      <br />
      See transaction in explorer
    </Link>
  )
}

function UploadSuccess({ txHash }: { txHash: string }) {
  return (
    <Link href={`https://mumbai.polygonscan.com/tx/${txHash}`} target='_blank'>
      Profile data upload success 🎉
      <br />
      See transaction in explorer
    </Link>
  )
}
