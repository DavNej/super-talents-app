'use client'

import Image from 'next/image'
import React from 'react'

import useImageProcessing from '@/app/hooks/useImageProcessing'
import useDropzone from '@/app/hooks/useDropzone'
import { toast } from 'react-toastify'

export default function UploadFile({
  onSuccess,
}: {
  onSuccess: (dataUrl: string) => unknown
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const onError = toast.error

  const { file, handleDrop, handleDragOver, handleFileChange } = useDropzone({
    onError,
  })

  const dataUrl = useImageProcessing({ file, onError })

  React.useEffect(() => {
    if (!dataUrl) return
    onSuccess(dataUrl)
  }, [dataUrl, onSuccess])

  function handleClick() {
    fileInputRef.current?.click()
  }

  return (
    <div
      className='flex p-4 mt-12 bg-gray-700 rounded-[30px] justify-center cursor-pointer'
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}>
      <input
        ref={fileInputRef}
        type='file'
        className='hidden'
        accept='image/jpeg, image/png, image/heic, image/heif'
        onChange={handleFileChange}
      />

      {dataUrl && (
        <Image
          className='rounded-2xl mr-4'
          src={dataUrl}
          alt='Cropped'
          width={88}
          height={88}
        />
      )}

      <div className='flex flex-col items-center '>
        <Image
          className='relative'
          src='/download.svg'
          alt='Download'
          width={32}
          height={32}
          priority
        />
        <p className='font-light'>Upload your photo</p>
        <p className='font-light opacity-40'>Up to 24 mb</p>
      </div>
    </div>
  )
}
