'use client'
import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'
import Image from 'next/image'
import UploadFile from './UploadFile'
import React from 'react'

async function encodeImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      resolve(base64String)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AvatarPage() {
  const [base64Image, setBase64Image] = React.useState('')

  async function onUploadSuccess(file: File) {
    const encodedImage = await encodeImageToBase64(file)
    setBase64Image(encodedImage)
  }

  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-row gap-x-24 items-start'>
        <div className='flex-col w-1/2'>
          <BackLink />
          <h3 className='font-semibold text-5xl'>Create Your Avatar</h3>
          <UploadFile onSuccess={onUploadSuccess} />
          <Button className='mt-5' onClick={() => console.log(base64Image)}>
            Generate avatar
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
