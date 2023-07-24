import Image from 'next/image'
import React from 'react'

export default function AvatarLoader() {
  return (
    <div className='flex flex-col self-stretch justify-center items-center w-1/2'>
      <h3 className='font-semibold text-center text-4xl'>
        Generating your avatar...
      </h3>
      <div className='mt-4 w-full flex justify-center items-center h-full rounded-[28px] backdrop-blur-xl'>
        <Image
          className='animate-spin'
          src='/mask.png'
          alt='Mask'
          width={100}
          height={100}
          priority
        />
      </div>
    </div>
  )
}
