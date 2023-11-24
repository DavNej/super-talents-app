'use-client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function BackLink() {
  const router = useRouter()

  return (
    <div className='mb-4 opacity-60 flex'>
      <div
        className='flex cursor-pointer items-center'
        onClick={() => {
          router.back()
        }}>
        <Image src='/arrow-left.svg' alt='Back arrow' width={22} height={22} />
        <p className='ml-3 md:ml-6 uppercase font-medium text-base md:text-xl'>back</p>
      </div>
    </div>
  )
}
