'use client'
import React from 'react'
import Image from 'next/image'

export default function Loader({ size = 320 }: { size?: number }) {
  return (
    <Image
      src='/loader.gif'
      alt='Loading'
      width={size}
      height={size}
      priority
    />
  )
}
