'use client'

import Image from 'next/image'

import useImageCrop from './useImageCrop'
import useDropzone from './useDropzone'

export default function UploadFile() {
  const {
    file,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleClick,
    handleFileChange,
  } = useDropzone()

  const dataUrl = useImageCrop({ file })

  return (
    <div
      className='flex p-4 mt-12 bg-gray-700 rounded-[30px] justify-center cursor-pointer'
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}>
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
