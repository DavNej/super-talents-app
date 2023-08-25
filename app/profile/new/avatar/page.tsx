'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'

import { useCreateAvatars } from '@/lib/hooks'
import type { DataUrlType } from '@/lib/avatar/types'
import { Button, Loader, BackLink, ImagePreview } from '@/app/components'

const UploadFile = dynamic(() => import('@/app/components/UploadFile'), {
  ssr: false,
})

export default function AvatarPage() {
  const createAvatar = useCreateAvatars()

  const [uploadedPicture, setUploadedPicture] =
    React.useState<DataUrlType | null>(null)

  //TODO delete images in local storage after mint
  const [avatars, setAvatars] = useLocalStorage<DataUrlType[]>('avatars', [])
  const [selectedAvatar, setSelectedAvatar] =
    useLocalStorage<DataUrlType | null>('selectedAvatar', null)

  React.useEffect(() => {
    if (createAvatar.data) {
      setAvatars(createAvatar.data)
    }
  }, [createAvatar.data, setAvatars])

  return (
    <main className='flex-1 px-24 bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='grid grid-cols-2 gap-x-24'>
        <div className='col-span-2'>
          <BackLink />
        </div>
        <div>
          <h3 className='font-semibold text-5xl whitespace-nowrap'>
            Create Your Avatar
          </h3>

          <UploadFile onSuccess={setUploadedPicture} />

          <p className='mt-4 ml-4 font-light text-xs opacity-70'>
            For optimal results, please upload a high-quality picture with a
            clean background
          </p>

          {!!selectedAvatar ? (
            <Link
              className='mt-5 py-5 px-8 block w-full rounded-full uppercase font-medium text-center text-xl bg-white text-pink'
              href='/profile/new/info'>
              Next
            </Link>
          ) : (
            <Button
              className='mt-5 w-full'
              onClick={() => {
                if (uploadedPicture)
                  createAvatar.mutate({ image: uploadedPicture })
              }}
              isDisabled={!uploadedPicture || createAvatar.isLoading}>
              {createAvatar.data ? 'Regenerate avatar' : 'Generate avatar'}
            </Button>
          )}
        </div>

        {createAvatar.isLoading ? (
          <div className='flex flex-col self-stretch justify-center items-center'>
            <h3 className='font-semibold text-center text-4xl whitespace-nowrap'>
              Generating your avatar...
            </h3>
            <div className='mt-4 w-full flex justify-center items-center h-full rounded-[28px] backdrop-blur-xl'>
              <Loader size={520} />
            </div>
          </div>
        ) : (
          <ImagePreview
            images={avatars}
            onSelect={setSelectedAvatar}
            selectedAvatar={selectedAvatar}
          />
        )}
      </div>
    </main>
  )
}
