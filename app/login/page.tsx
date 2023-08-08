'use client'

import React from 'react'
import Image from 'next/image'
import LoginSection from './components/LoginSection'
import { useWeb3Auth } from '@/lib/web3auth'
import { redirect } from 'next/navigation'
import Toast from '../components/Toast'

export default function LoginPage() {
  const { isReady, error } = useWeb3Auth()

  const [errorMessage, setErrorMessage] = React.useState(error?.message || '')

  React.useEffect(() => {
    if (error) {
      setErrorMessage(error.message)
    }
  }, [error])

  return !isReady ? (
    redirect('/')
  ) : (
    <main className='px-24 flex flex-1 gap-x-4 place-items-center bg-sign-up bg-right bg-no-repeat bg-contain'>
      <div className='flex-col flex-1'>
        <Image
          className='relative '
          src='/mask.png'
          alt='Next.js Logo'
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
      <LoginSection />

      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage('')} />
      )}
    </main>
  )
}
