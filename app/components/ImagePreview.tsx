import Image from 'next/image'
import React from 'react'

import Dialog from '@/app/components/Dialog'
import clsx from 'clsx'
import { useLocalStorage } from 'usehooks-ts'

function dataToUrl(data: string) {
  return `data:image/jpeg;base64,` + data
}

export default function ImagePreview({ images }: { images: string[] }) {
  const [showDialog, setShowDialog] = React.useState(false)
  const [dialogImage, setDialogImage] = React.useState('')

  const [selectedAvatar, setSelectedAvatar] = useLocalStorage(
    'selectedAvatar',
    ''
  )

  if (images.length === 0) {
    return (
      <div className='flex justify-center'>
        <Image
          src='/avatar-placeholder.png'
          alt='Avatar'
          width={520}
          height={600}
          priority
        />
      </div>
    )
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center'>
        <h3 className='font-semibold text-center text-4xl whitespace-nowrap'>
          Select avatar
        </h3>
        <div className='mt-4 grid grid-cols-2 gap-4'>
          {images.map((data, idx) => {
            const dataUrl = dataToUrl(data)
            const isSelected = dataUrl === selectedAvatar
            return (
              <div key={idx} className='relative'>
                <Image
                  className='absolute bottom-4 left-4 cursor-pointer '
                  src={isSelected ? '/check.svg' : '/expand.svg'}
                  alt={isSelected ? 'Selected' : 'Expand'}
                  width={44}
                  height={44}
                  priority
                  onClick={() => {
                    setShowDialog(true)
                    setDialogImage(dataUrl)
                  }}
                />

                <Image
                  className={clsx(
                    'rounded-[28px]',
                    'border-white',
                    'border-[6px]',
                    isSelected ? 'border-opacity-100' : 'border-opacity-0'
                  )}
                  src={dataUrl}
                  alt='Avatar'
                  width={248}
                  height={248}
                  priority
                  onClick={() => {
                    const _data = isSelected ? '' : dataUrl
                    setSelectedAvatar(_data)
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false)
        }}>
        <Image
          className='rounded-[52px]'
          src={dialogImage}
          alt='Avatar'
          width={694}
          height={694}
          priority
        />
      </Dialog>
    </>
  )
}
