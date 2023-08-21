'use client'

import React from 'react'
import Image from 'next/image'
import { useLocalStorage } from 'usehooks-ts'

import type { DataUrlType } from '@/lib/avatar/types'

export default function InfoPage() {
  const [selectedAvatar] = useLocalStorage<DataUrlType | null>(
    'selectedAvatar',
    null
  )

  return (
    <>
      {selectedAvatar && (
        <Image
          className='rounded-[52px]'
          src={selectedAvatar}
          alt='Avatar'
          width={694}
          height={694}
          priority
        />
      )}
      <h3 className='font-semibold text-5xl whitespace-nowrap'>Profile info</h3>
    </>
  )
}
