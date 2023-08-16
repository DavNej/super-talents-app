'use client'

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { redirect } from 'next/navigation'
import { uploadToPinata } from '@/lib/ipfs/pinata'

import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'
import { useProfile } from '@/app/hooks/profile'
import { useWeb3Auth } from '@/app/hooks/web3auth'
import { mintTalentLayerId, updateProfileData } from '@/lib/talent-layer'
import ProfilePreview from '@/app/components/ProfilePreview'
import { useUser } from '@/app/hooks/user'

export default function ProfilePreviewPage() {
  const { profile } = useProfile()
  const { signer } = useWeb3Auth()
  const [pinataCid, setPinataCid] = useLocalStorage('pinataCid', '')
  const [isLoading, setIsLoading] = React.useState(false)
  const user = useUser()

  if (!profile.handle || !signer) redirect('/login')

  async function uploadData() {
    if (!signer) {
      console.error('missing signer address')
      console.error('signer', signer)
      return
    }
    if (!profile.role) {
      console.error('missing profile role')
      console.error('profile.role', profile.role)
      return
    }

    setIsLoading(true)
    const address = await signer.getAddress()
    const ipfsHash = await uploadToPinata(profile, address)
    if (!ipfsHash) {
      setIsLoading(false)
      return
    }

    await setPinataCid(ipfsHash)
    setIsLoading(false)
  }

  async function handleMint() {
    if (!signer) {
      console.error('missing signer address')
      console.error('signer', signer)
      return
    }
    if (!profile.role) {
      console.error('missing profile role')
      console.error('profile.role', profile.role)
      return
    }

    const talentLayerId = await mintTalentLayerId(profile.handle, signer)

    if (!talentLayerId) {
      setIsLoading(false)
      return
    }

    await updateProfileData(talentLayerId, pinataCid, signer)
    setIsLoading(false)
  }

  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <div className='mb-12 flex justify-between items-center'>
          <h3 className='font-semibold text-5xl whitespace-nowrap'>
            Profile preview
          </h3>
          {Boolean(user.id) ? (
            <Button isLoading={isLoading} onClick={uploadData}>
              Update profile
            </Button>
          ) : (
            <Button isLoading={isLoading} onClick={handleMint}>
              Mint my profile NFT
            </Button>
          )}
        </div>

        <ProfilePreview />
      </div>
    </main>
  )
}
