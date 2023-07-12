'use client'
import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'
import Image from 'next/image'
import UploadFile from './UploadFile'

export default function AvatarPage() {
  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-row gap-x-24 items-start'>
        <div className='flex-col w-1/2'>
          <BackLink />
          <h3 className='font-semibold text-5xl'>Create Your Avatar</h3>
          <UploadFile />
          <Button
            className='mt-5'
            caption='Generate avatar'
            onClick={() => alert('Clicked')}
          />
        </div>

        <div className='flex justify-center w-1/2'>
          <Image
            src='/avatar-placeholder.png'
            alt='Avatar'
            width={520}
            height={600}
            priority
          />
        </div>
      </div>
    </main>
  )
}
