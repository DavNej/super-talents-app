'use client'

import axios from 'axios'
import React from 'react'
import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'

import UploadFile from './UploadFile'

import type { APIResponse } from './generate/config'
import ImagePreview from './ImagePreview'
import Link from 'next/link'

export default function AvatarPage() {
  const [imageOutputs, setImageOutputs] = React.useState([
    '/_avatar.jpg',
    '/bg-avatar.svg',
    '/avatar-placeholder.png',
    '/bg-signup.svg',
  ])
  // const [imageOutputs, setImageOutputs] = React.useState([])
  const [error, setError] = React.useState('')
  const [jobId, setJobId] = React.useState('')
  const [isAvatarSelected, setIsAvatarSelected] = React.useState(false)
  const [base64Data, setBase64Data] = React.useState('')

  function onUploadSuccess(dataUrl: string) {
    const fileExtension = dataUrl.substring(
      dataUrl.indexOf('/') + 1,
      dataUrl.indexOf(';')
    )
    const regex = new RegExp(`^data:image\/${fileExtension};base64,`)
    const data = dataUrl.replace(regex, '')
    setBase64Data(data)
  }

  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-row flex-1 gap-x-24 items-start'>
        <div className='flex-col w-1/2'>
          <BackLink />
          <h3 className='font-semibold text-5xl'>Create Your Avatar</h3>
          <UploadFile
            onSuccess={onUploadSuccess}
            onError={err => setError(err)}
          />
          {isAvatarSelected ? (
            <Link
              className='mt-5 py-5 px-8 block w-full rounded-full uppercase font-medium text-center text-xl bg-white text-pink'
              href='/profile/new/info'>
              Next
            </Link>
          ) : (
            <>
              <Button
                className='mt-5'
                onClick={() => {
                  axios
                    .post<APIResponse>('/profile/new/avatar/generate', {
                      image: base64Data,
                    })
                    .then(res => {
                      setJobId(res.data.id)
                    })
                }}>
                Generate avatar
              </Button>
              <Button
                className='mt-5'
                onClick={() => {
                  axios
                    .get<APIResponse | string[]>(
                      `/profile/new/avatar/generate?id=${jobId}`
                    )
                    .then(res => {
                      if (Array.isArray(res.data)) {
                        setImageOutputs(res.data)
                      }
                      console.log(res.data)
                    })
                }}>
                GET
              </Button>
            </>
          )}
        </div>

        <ImagePreview
          images={imageOutputs}
          onSelect={_dataUrl => setIsAvatarSelected(Boolean(_dataUrl))}
        />
      </div>
    </main>
  )
}
