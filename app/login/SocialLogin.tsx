'use client'

import Image from 'next/image'

import { useAuth } from '@/lib/hooks'
import type { LoginProvider } from '@/lib/web3auth'

const loginProviders: {
  icon: string
  name: LoginProvider
}[] = [
  { icon: '/linkedin.svg', name: 'linkedin' },
  { icon: '/github.svg', name: 'github' },
  { icon: '/twitter.svg', name: 'twitter' },
  { icon: '/google.svg', name: 'google' },
]

export default function SocialLogin() {
  const { login } = useAuth()

  return (
    <ul className='flex justify-between'>
      {loginProviders.map(provider => (
        <li
          className='cursor-pointer'
          key={provider.name}
          onClick={() => login?.mutate({ loginProvider: provider.name })}>
          <Image
            src={provider.icon}
            alt={provider.name}
            width={48}
            height={48}
            priority
          />
        </li>
      ))}
    </ul>
  )
}
