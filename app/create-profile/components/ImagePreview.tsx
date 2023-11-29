'use-client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/utils'
import { v4 as uuid } from 'uuid'
import { useLocalStorage } from 'usehooks-ts'

import { Dialog } from '@/app/components'
import { type DataUrlType } from '@/utils/data-url'

export default function ImagePreview() {
  const [avatars] = useLocalStorage<DataUrlType[]>('avatars', [])
  const [selectedAvatar, setSelectedAvatar] =
    useLocalStorage<DataUrlType | null>('selectedAvatar', null)

  const [showDialog, setShowDialog] = React.useState(false)
  const [dialogImage, setDialogImage] = React.useState(selectedAvatar)

  if (avatars.length === 0) {
    return (
      <div className='mt-8 md:mt-0 flex justify-center'>
        <div className='w-[254px] h-[293px] md:w-[520px] md:h-[600px]'>
          <Image
            src='/avatar-placeholder.png'
            alt='Avatar'
            width={520}
            height={600}
            className='w-full h-auto '
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center'>
        <h3 className='mt-4 md:mt-0 font-semibold text-center text-2xl md:text-4xl md:whitespace-nowrap'>
          Select avatar
        </h3>
        <div className='mt-4 grid grid-cols-2 gap-4'>
          {avatars.map(dataUrl => {
            const isSelected = dataUrl === selectedAvatar
            return (
              <div key={uuid()} className='relative'>
                <div className='w-8 h-8 md:w-11 md:h-11 absolute bottom-4 left-4 cursor-pointer'>
                  <Image
                    src={isSelected ? '/check.svg' : '/expand.svg'}
                    alt={isSelected ? 'Selected' : 'Expand'}
                    onClick={() => {
                      setShowDialog(true)
                      setDialogImage(dataUrl)
                    }}
                    width={44}
                    height={44}
                    className='w-full h-auto '
                  />
                </div>

                <Image
                  className={cn(
                    'rounded-xl',
                    'md:rounded-[28px]',
                    'border-white',
                    'border-2',
                    'md:border-[6px]',
                    isSelected ? 'border-opacity-100' : 'border-opacity-0'
                  )}
                  src={dataUrl}
                  alt='Avatar'
                  width={248}
                  height={248}
                  onClick={() => {
                    const _data = isSelected ? null : dataUrl
                    setSelectedAvatar(_data)
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        {dialogImage && (
          <Image
            src={dialogImage}
            alt='Avatar'
            width={694}
            height={694}
            className='rounded-[18px]'
          />
        )}
      </Dialog>
    </>
  )
}
