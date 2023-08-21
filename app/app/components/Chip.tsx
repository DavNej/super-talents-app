'use client'
import React from 'react'
import Image from 'next/image'

export default function Chip({
  caption,
  onDelete,
}: {
  caption: string
  onDelete: () => void
}) {
  return (
    <div className='p-3 flex flex-row bg-pink rounded-full'>
      <p className='text-white text-sm font-light'>
        {caption}
      </p>
      <Image
        className='ml-2 cursor-pointer'
        src='/skill-cross.svg'
        alt='Close'
        width={14}
        height={14}
        priority
        onClick={onDelete}
      />
    </div>
  )
}
