'use client'

import axios from 'axios'
import Image from 'next/image'
import React from 'react'
import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'

import Dialog from './Dialog'
import UploadFile from './UploadFile'

import type { APIResponse } from './generate/config'

export default function AvatarPage() {
  const [showDialog, setShowDialog] = React.useState(false)
  const [error, setError] = React.useState('')
  const [jobId, setJobId] = React.useState('')
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
                .get<APIResponse>(`/profile/new/avatar/generate?id=${jobId}`)
                .then(res => {
                  console.log(res.data)
                })
            }}>
            GET
          </Button>
        </div>

        <div className='flex justify-center w-1/2'>
          <Image
            src='/avatar-placeholder.png'
            alt='Avatar'
            width={520}
            height={600}
            priority
          />
        </div>
      </div>
    </main>
  )
}
