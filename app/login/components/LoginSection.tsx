'use client'

import Image from 'next/image'
import React from 'react'
import { useWeb3Auth } from '@/lib/web3auth'
import { loginProviders } from '@/lib/web3auth/config'
import EmailForm from './EmailForm'

export default function LoginSection() {
  const { login } = useWeb3Auth()

  return (
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
            onClick={async () => {
              await login(provider.name)
            }}>
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

      <EmailForm />
    </div>
  )
}
