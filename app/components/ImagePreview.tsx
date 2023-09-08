'use-client'

import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { v4 as uuid } from 'uuid';

import { DataUrlType } from '@/lib/avatar/types'

import { Dialog } from '@/app/components'
import { useLocalStorage } from 'usehooks-ts'

export default function ImagePreview() {
  //TODO delete images in local storage after mint
  const [avatars] = useLocalStorage<DataUrlType[]>('avatars', [])
  const [selectedAvatar, setSelectedAvatar] =
    useLocalStorage<DataUrlType | null>('selectedAvatar', null)

  const [showDialog, setShowDialog] = React.useState(false)
  const [dialogImage, setDialogImage] = React.useState(selectedAvatar)

  if (avatars.length === 0) {
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
          {avatars.map(dataUrl => {
            const isSelected = dataUrl === selectedAvatar
            return (
              <div key={uuid()} className='relative'>
                <Image
                  className='absolute bottom-4 left-4 cursor-pointer '
                  src={isSelected ? '/check.svg' : '/expand.svg'}
                  alt={isSelected ? 'Selected' : 'Expand'}
                  width={44}
                  height={44}
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
            className='rounded-[52px]'
            src={dialogImage}
            alt='Avatar'
            width={694}
            height={694}
            priority
          />
        )}
      </Dialog>
    </>
  )
}
