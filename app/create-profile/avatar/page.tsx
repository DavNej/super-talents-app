'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'

import { Button, Loader, BackLink } from '@/app/components'
import { useCreateAvatars } from '@/features/avatar'
import type { DataUrlType } from '@/utils/data-url'

import { ImagePreview } from '../components'

const UploadFile = dynamic(() => import('../components/UploadFile'), {
  ssr: false,
})

export default function AvatarPage() {
  const { createAvatar, isLoading } = useCreateAvatars()

  const [uploadedPicture, setUploadedPicture] =
    React.useState<DataUrlType | null>(null)

  const [selectedAvatar] = useLocalStorage<DataUrlType | null>(
    'selectedAvatar',
    null
  )

  return (
    <main className='flex-1 px-6 pb-6 md:px-24 bg-avatar bg-right bg-no-repeat bg-cover'>
      <div className='md:grid md:grid-cols-2 md:gap-x-24'>
        <div className='col-span-2'>
          <BackLink />
        </div>
        <div>
          <h3 className='font-semibold text-4xl md:text-5xl my-7 md:my-7 whitespace-nowrap'>
            Create <span className='hidden md:inline'>Your</span> Avatar
          </h3>

          <UploadFile onSuccess={setUploadedPicture} />

          <p className='mt-4 ml-4 font-light text-xs opacity-70'>
            For optimal results, please upload a high-quality picture with a
            clean background
          </p>

          {!!selectedAvatar ? (
            <Link
              className='mt-5 py-3 md:py-5 px-8 block w-full rounded-full uppercase font-medium text-center text-base md:text-xl bg-white text-pink'
              href='/create-profile/info'>
              Next
            </Link>
          ) : (
            <Button
              className='mt-5 w-full'
              onClick={() => {
                if (uploadedPicture)
                  createAvatar.mutate({ image: uploadedPicture })
              }}
              isDisabled={!uploadedPicture || isLoading}>
              {createAvatar.data ? 'Regenerate avatar' : 'Generate avatar'}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className='flex flex-col self-stretch justify-center items-center'>
            <h3 className='mt-4 mb-2 md:my-0 font-semibold text-center text-2xl md:text-4xl whitespace-nowrap'>
              Generating your avatar...
            </h3>
            <div className='mt-4 w-full flex justify-center items-center h-full rounded-[28px] backdrop-blur-xl'>
              <Loader size={520} />
            </div>
          </div>
        ) : (
          <ImagePreview />
        )}
      </div>
    </main>
  )
}
