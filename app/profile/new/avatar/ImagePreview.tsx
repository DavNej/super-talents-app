import Image from 'next/image'
import React from 'react'

import Dialog from './Dialog'
import clsx from 'clsx'

export default function ImagePreview({
  images,
  onSelect,
}: {
  images: string[]
  onSelect: (dataUrl: string) => void
}) {
  const [showDialog, setShowDialog] = React.useState(false)
  const [dialogImage, setDialogImage] = React.useState('')
  const [selectedImage, setSelectedImage] = React.useState('')

  if (images.length === 0) {
    return (
      <div className='flex justify-center w-1/2'>
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
      <div className='flex flex-col justify-center items-center w-1/2'>
        <h3 className='font-semibold text-center text-4xl'>Select avatar</h3>
        <div className='mt-4 grid grid-cols-2 gap-4'>
          {images.map(dataUrl => {
            const isSelected = dataUrl === selectedImage
            return (
              <>
                <div key={dataUrl} className='relative'>
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
                      isSelected && 'border-white border-[6px]'
                    )}
                    src={dataUrl}
                    alt='Avatar'
                    width={248}
                    height={248}
                    priority
                    onClick={() => {
                      const _dataUrl = !isSelected ? dataUrl : ''
                      setSelectedImage(_dataUrl)
                      onSelect(_dataUrl)
                    }}
                  />
                </div>
              </>
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
