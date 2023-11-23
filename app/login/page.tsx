'use client'

import React from 'react'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { PageLoader } from '@/app/components'
import { useAuth } from '@/features/auth'
import { useSmartAccount } from '@/features/smart-account'

import { SocialLogin, EmailForm } from './components'

export default function LoginPage() {
  const { status } = useAuth()
  const { connectedUser } = useSmartAccount()

  if (connectedUser?.data?.handle) {
    redirect(`/${connectedUser.data.handle}`)
  }

  if (status === 'connected') {
    return connectedUser?.data === null ? (
      redirect('/create-profile/avatar')
    ) : (
      <PageLoader />
    )
  }

  return (
    <main className='px-24 flex flex-1 gap-x-4 place-items-center bg-sign-up bg-right bg-no-repeat bg-cover'>
      <div className='flex-col flex-1'>
        <Image
          className='relative'
          src='/mask.png'
          alt='SuperTalents Logo'
          width={128}
          height={48}
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

        <SocialLogin />

        <div className='my-12 flex items-center gap-5 opacity-50'>
          <hr className='flex-1' />
          <span>or</span>
          <hr className='flex-1' />
        </div>

        <EmailForm />
      </div>
    </main>
  )
}
