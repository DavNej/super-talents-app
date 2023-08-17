'use client'

import React from 'react'
import Link from 'next/link'
import { useInterval, useLocalStorage } from 'usehooks-ts'

import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'
import fetcher from '@/lib/fetcher'

import type { AvatarResponse } from './generate/config'

import Loader from '@/app/components/Loader'
import ImagePreview from '@/app/components/ImagePreview'
import UploadFile from '@/app/components/UploadFile'
import { toast } from 'react-toastify'

export default function AvatarPage() {
  const [jobId, setJobId] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [base64UploadedImage, setBase64UploadedImage] = React.useState('')

  const [selectedAvatar] = useLocalStorage('selectedAvatar', '')
  const [imageOutputs, setImageOutputs] = useLocalStorage<string[]>(
    'avatars',
    []
  )

  const hasImageOutputs = imageOutputs.length > 0

  function onUploadSuccess(dataUrl: string) {
    const fileExtension = dataUrl.substring(
      dataUrl.indexOf('/') + 1,
      dataUrl.indexOf(';')
    )
    const regex = new RegExp(`^data:image\/${fileExtension};base64,`)
    const data = dataUrl.replace(regex, '')
    setBase64UploadedImage(data)
  }

  async function generateImage() {
    setIsLoading(true)
    if (hasImageOutputs) {
      setImageOutputs([])
    }

    const res = await fetcher.POST<AvatarResponse>(
      '/profile/new/avatar/generate',
      { image: base64UploadedImage }
    )

    console.log('🦋 | generateImage', res)

    if (!res.ok) {
      toast.error(res.error.message)
      setIsLoading(false)
      return
    }

    const id = res.data.id
    if (id) {
      setJobId(id)
    }
  }

  async function checkStatus() {
    console.log('⏳ Checking status id:', jobId)
    if (!jobId) return

    const res = await fetcher.GET<AvatarResponse>(
      `/profile/new/avatar/generate?id=${jobId}`
    )

    if (!res.ok) {
      toast.error(res.error.message)
      setIsLoading(false)
      return
    }

    const images = res.data.results
    if (!!images?.length) {
      setImageOutputs(images)
      setIsLoading(false)
    }
  }

  const delay = isLoading ? 5000 : null
  useInterval(checkStatus, delay)

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

          <UploadFile onSuccess={onUploadSuccess} />

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
              onClick={() => generateImage()}
              isDisabled={!base64UploadedImage || isLoading}>
              {hasImageOutputs ? 'Regenerate avatar' : 'Generate avatar'}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className='flex flex-col self-stretch justify-center items-center'>
            <h3 className='font-semibold text-center text-4xl whitespace-nowrap'>
              Generating your avatar...
            </h3>
            <div className='mt-4 w-full flex justify-center items-center h-full rounded-[28px] backdrop-blur-xl'>
              <Loader size={520} />
            </div>
          </div>
        ) : (
          <ImagePreview images={imageOutputs} />
        )}
      </div>
    </main>
  )
}
