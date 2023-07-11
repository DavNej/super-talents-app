'use client'
import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'
import Image from 'next/image'

export default function AvatarPage() {
  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-row gap-x-24 items-start'>
        <div className='flex-col w-1/2'>
          <BackLink />
          <h3 className='font-semibold text-5xl'>Create Your Avatar</h3>
          <div className='flex flex-col p-4 mt-12 gap-y-2 bg-gray-700 rounded-[30px] items-center'>
            <Image
              className='relative'
              src='/download.svg'
              alt='Download'
              width={32}
              height={32}
              priority
            />
            <p className='font-light'>Upload your photo</p>
            <p className='font-light opacity-40'>Up to 24 mb</p>
          </div>
          <Button
            className='mt-5'
            caption='Generate avatar'
            onClick={() => alert('Clicked')}
          />
        </div>

        <div className='flex justify-center w-1/2'>
          <Image
            // className='relative'
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
