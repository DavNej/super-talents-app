'use client'

import React from 'react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useAccount } from '@particle-network/connect-react-ui'

import { ConnectButton } from '@/features/auth'
import { useSmartAccount } from '@/features/smart-account'

export default function HomePage() {
  const { connectedUser } = useSmartAccount()

  const account = useAccount()

  if (connectedUser?.data?.handle) {
    redirect(`/${connectedUser.data.handle}`)
  }

  if (account && connectedUser?.data === null)
    redirect('/create-profile/avatar')

  return (
    <main className='flex-1 flex flex-col md:flex-row gap-x-4 px-5 md:px-24 py-5 md:py-0 place-items-center bg-sign-up bg-right bg-no-repeat bg-cover'>
      <div className='flex-col flex-1 flex md:block justify-around'>
        <div className='relative w-16 h-6 md:w-32 md:h-12'>
          <Image
            src='/mask.png'
            alt='SuperTalents Logo'
            width={128}
            height={48}
            className='w-full h-auto'
          />
        </div>

        <h3 className='font-semibold text-4xl md:text-5xl my-4 md:my-7'>
          Sharing the Future of Work with Web3 and AI
        </h3>

        <ul>
          <li className='my-3 md:my-7'>
            <p className='uppercase text-xl md:text-2xl text-blue'>talents</p>
            <p className='font-normal text-base opacity-60'>
              Truly own your profile and career
            </p>
          </li>
          <li className='my-3 md:my-7'>
            <p className='uppercase text-xl md:text-2xl text-purple-400'>
              clients
            </p>
            <p className='font-normal text-base opacity-60'>
              Connect with the best talent in Web3 and AI
            </p>
          </li>
          <li className='my-3 md:my-7'>
            <p className='uppercase text-xl md:text-2xl text-pink'>
              supporters
            </p>
            <p className='font-normal text-base opacity-60'>
              Support the talent you believe in and earn together
            </p>
          </li>
        </ul>
      </div>

      <div className='px-5 md:px-14 mt-8 md:mt-0 py-8 md:py-16 bg-gradient-to-b from-purple-500 to-pink w-full md:w-[521px] rounded-[22px] md:rounded-[50px]'>
        <h3 className='font-semibold text-3xl md:text-5xl mb-4 md:mb-14 whitespace-nowrap'>
          Let’s get started
        </h3>

        <ConnectButton />
      </div>
    </main>
  )
}
