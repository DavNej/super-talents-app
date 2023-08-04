'use client'
import React from 'react'
import Image from 'next/image'

export default function Loader({ size }: { size: number }) {
  return (
    <Image
      className='rounded-full bg-white backdrop-blur-xl bg-opacity-20'
      src='/loader.gif'
      alt='Loading'
      width={size}
      height={size}
      priority
    />
  )
}
