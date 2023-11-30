'use client'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'
import { toast } from 'react-toastify'

import { Button } from '@/app/components'
import { useProfileData, type ProfileWithPictureType } from '@/features/profile'
import { useSmartAccount } from '@/features/smart-account'
import { useUploadToIPFS } from '@/features/ipfs'
import { useUpdateProfileData, useMintProfile } from '@/features/talent-layer'
import { deepEqual, log } from '@/utils'

export default function MintButton({
  handle,
  profileToUpload,
}: {
  handle: string
  profileToUpload: ProfileWithPictureType
}) {
  const { smartAccountAddress } = useSmartAccount()

  const [pinataCid, setPinataCid] = useLocalStorage('pinataCid', '')
  const [, setAvatars] = useLocalStorage('avatars', [])
  const [, setSelectedAvatar] = useLocalStorage('selectedAvatar', null)
  const [, setNewProfile] = useLocalStorage('newProfile', null)

  const profileData = useProfileData({ cid: pinataCid })
  const uploadToIPFS = useUploadToIPFS({ onSuccess: setPinataCid })
  const updateProfileData = useUpdateProfileData({
    onSuccess(txHash) {
      toast.success(<UploadSuccess txHash={txHash || ''} />, {
        autoClose: false,
        closeOnClick: false,
      })
      // setPinataCid('')
      // setAvatars([])
      // setSelectedAvatar(null)
      // setNewProfile(null)
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
    redirect(`/${handle}`)
  }

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
