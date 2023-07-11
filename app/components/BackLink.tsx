'use-client';

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function BackLink() {
  const router = useRouter()

  return (
    <div
      className='flex mb-4 opacity-60'
      onClick={() => {
        router.back()
      }}>
      <Image src='/arrow-left.svg' alt='Back arrow' width={22} height={22} />
      <p className='ml-6 uppercase font-medium text-xl '>back</p>
    </div>
  )
}
