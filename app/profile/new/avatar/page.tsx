'use client'

import axios from 'axios'
import React from 'react'
import Link from 'next/link'
import { useInterval, useLocalStorage } from 'usehooks-ts'

import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'

import Link from 'next/link'

import AvatarLoader from './components/AvatarLoader'
import ImagePreview from './components/ImagePreview'
import UploadFile from './components/UploadFile'

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

  const hasImageOutputs = imageOutputs.length > 0

  async function generateImage() {
    console.log('posting image')
    if (hasImageOutputs) {
      setImageOutputs([])
    }
    await axios
      .post<APIResponse>('/profile/new/avatar/generate', {
        image: base64Data,
      })
      .then(res => {
        setJobId(res.data.id)
      })
  }

  async function checkStatus() {
    console.log('checking status')
    await axios
      .get<APIResponse>(`/profile/new/avatar/generate?id=${jobId}`)
      .then(res => {
        const images = res.data.results
        if (images) {
          setImageOutputs(images)
          saveToLocalStorage(images)
        }
        console.log(res.data)
      })
  }

  const delay = !jobId || hasImageOutputs || Boolean(error) ? null : 5000
  useInterval(checkStatus, delay)

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
            <Button className='mt-5' onClick={() => generateImage()}>
              {hasImageOutputs ? 'Regenerate avatar' : 'Generate avatar'}
            </Button>
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
