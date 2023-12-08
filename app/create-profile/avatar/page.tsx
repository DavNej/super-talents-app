'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'
import { useMediaQuery } from 'react-responsive'

import { Button, Loader, Title } from '@/app/components'
import { useCreateAvatars } from '@/features/avatar'
import type { DataUrlType } from '@/utils/data-url'
import { breakpoints } from '@/utils'

import { ImagePreview } from '../components'

const UploadFile = dynamic(() => import('../components/UploadFile'), {
  ssr: false,
})

export default function AvatarPage() {
  const { createAvatar, isLoading } = useCreateAvatars()
  const isMediumScreen = useMediaQuery({ minWidth: breakpoints.md })

  const [uploadedPicture, setUploadedPicture] =
    React.useState<DataUrlType | null>(null)

  const [selectedAvatar] = useLocalStorage<DataUrlType | null>(
    'selectedAvatar',
    null
  )

  function NextButton({}) {
    return !!selectedAvatar ? (
      <Link
        className='mt-5 py-3 md:py-5 px-8 block w-full rounded-full uppercase font-medium text-center text-base md:text-xl bg-white text-pink'
        href='/create-profile/claim-handle'>
        Next
      </Link>
    ) : (
      <Button
        className='mt-5 w-full'
        onClick={() => {
          if (uploadedPicture) createAvatar.mutate({ image: uploadedPicture })
        }}
        isDisabled={!uploadedPicture || isLoading}>
        {createAvatar.data ? 'Regenerate avatar' : 'Generate avatar'}
      </Button>
    )
  }

  return (
    <div className='md:grid md:grid-cols-2 md:gap-x-24'>
      <div>
        <Title>Create {isMediumScreen && 'Your '} Avatar</Title>

        <UploadFile onSuccess={setUploadedPicture} />

        <p className='mt-4 ml-4 font-light text-xs opacity-70'>
          For optimal results, please upload a high-quality picture with a clean
          background
        </p>

        {isMediumScreen && <NextButton />}
      </div>

      {isLoading ? (
        <div className='flex flex-col self-stretch justify-center items-center'>
          <h3 className='mt-4 mb-2 md:my-0 font-semibold text-center text-2xl md:text-4xl md:whitespace-nowrap'>
            Generating your avatar...
          </h3>
          <div className='mt-4 w-full flex justify-center items-center h-full rounded-[28px] backdrop-blur-xl'>
            <Loader size={520} />
          </div>
        </div>
      ) : (
        <ImagePreview />
      )}
      {!isMediumScreen && <NextButton />}
    </div>
  )
}
