'use client'

import React from 'react'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'

import type { TLoginProvider } from '@/lib/web3auth/types'
import { type TSigner, useWeb3AuthLogin } from '@/lib/web3auth/hooks'
import { EmailForm } from '@/features/auth'

import { useQueryClient } from '@tanstack/react-query'
import { TalentLayerUserType } from '@/lib/talent-layer/types'

const loginProviders: {
  icon: string
  name: TLoginProvider
}[] = [
  { icon: '/linkedin.svg', name: 'linkedin' },
  { icon: '/github.svg', name: 'github' },
  { icon: '/twitter.svg', name: 'twitter' },
  { icon: '/google.svg', name: 'google' },
]

export default function LoginPage() {
  const router = useRouter()
  const login = useWeb3AuthLogin()

  const queryClient = useQueryClient()
  const signer = queryClient.getQueryData<TSigner>(['signer', 'connected'])

  let redirectPath = ''

  if (signer) {
    const connectedUser = queryClient.getQueryData<TalentLayerUserType>([
      'user',
      { address: signer?.address },
    ])

    redirectPath = connectedUser?.handle
      ? `/app/profile/${connectedUser.handle}`
      : '/app/profile/new/avatar'
  }

  React.useEffect(() => {
    if (redirectPath) {
      router.push(redirectPath)
    }
  }, [redirectPath, router])

  function handleEmailSubmit({ email }: { email: string }) {
    login.mutate({ loginProvider: 'email_passwordless', email })
  }

  return redirectPath ? null : (
    <main className='px-24 flex flex-1 gap-x-4 place-items-center bg-sign-up bg-right bg-no-repeat bg-contain'>
      <div className='flex-col flex-1'>
        <Image
          className='relative'
          src='/mask.png'
          alt='SuperTalents Logo'
          width={128}
          height={48}
          priority
        />
        <h3 className='font-semibold text-5xl my-7'>
          Sharing the Future of Work with Web3 and AI
        </h3>
        <ul>
          <li className='my-7'>
            <p className='uppercase text-2xl text-blue'>talents</p>
            <p className='font-normal text-lg opacity-60'>
              Truly own your profile and career
            </p>
          </li>
          <li className='my-7'>
            <p className='uppercase text-2xl text-purple-400'>clients</p>
            <p className='font-normal text-lg opacity-60'>
              Connect with the best talent in Web3 and AI
            </p>
          </li>
          <li className='my-7'>
            <p className='uppercase text-2xl text-pink'>supporters</p>
            <p className='font-normal text-lg opacity-60'>
              Support the talent you believe in and earn together
            </p>
          </li>
        </ul>
      </div>

      <div className='px-14 py-16 bg-gradient-to-b from-purple-500 to-pink h-[644px] w-[521px] rounded-[50px]'>
        <h3 className='font-semibold text-5xl mb-14 whitespace-nowrap'>
          Let’s get started
        </h3>
        <p className='mb-8 font-normal text-xl uppercase'>Continue with</p>
        <ul className='flex justify-between'>
          {loginProviders.map(provider => (
            <li
              className='cursor-pointer'
              key={provider.name}
              onClick={() => login.mutate({ loginProvider: provider.name })}>
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
        <div className='my-12 flex items-center gap-5 opacity-50'>
          <hr className='flex-1' />
          <span>or</span>
          <hr className='flex-1' />
        </div>

        <EmailForm onSubmit={handleEmailSubmit} />
      </div>
    </main>
  )
}
