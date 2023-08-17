'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { roleCaptions } from '@/app/profile/new/info/form-utils'

import { clsx, type ClassValue } from 'clsx'
import { IProfile } from '../hooks/profile/types'

export default function ProfilePreview({
  className,
  profile,
  isMinted,
}: {
  profile: IProfile
  className?: ClassValue
  isMinted: boolean
}) {
  return (
    <div
      className={clsx(
        'rounded-[40px] border-pink border-4 overflow-hidden',
        className
      )}>
      <div className='px-12 py-4 col-span-2 bg-gray-800 flex items-center justify-between'>
        <Image src='/mask.png' alt='logo' width={72} height={27} priority />
        {!isMinted && (
          <Link href='/profile/new/info'>
            <Image src='/edit.svg' alt='edit' width={24} height={24} priority />
          </Link>
        )}
      </div>

      <div className='px-14 py-11 flex gap-14'>
        <div className='w-1/2 flex flex-col gap-8'>
          <div className='flex gap-8 items-start'>
            <Image
              className='rounded-full'
              src={profile.picture}
              alt='logo'
              width={172}
              height={172}
              priority
            />
            <div className='flex flex-col justify-between'>
              <p className='font-semibold text-2xl'>{profile.name}</p>
              <p className='font-light'>@{profile.handle}</p>
              <p className='font-normal text-pink whitespace-nowrap'>
                {profile.role && roleCaptions[profile.role]}
              </p>
              <p className='font-light text-justify'>{profile.about}</p>
            </div>
          </div>

          <div id='skills'>
            <h4 className='text-lg font-medium border-b-[1px] border-gray-700'>
              Skills
            </h4>
            <div className='py-5 flex gap-2'>
              {profile.skills.map(skill => (
                <div
                  key={skill}
                  className='py-2 px-4 rounded-full bg-white backdrop-blur-xl bg-opacity-20'>
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div id='services'>
            <h4 className='text-lg font-medium border-b-[1px] border-gray-700'>
              Services
            </h4>
            <div className='py-5 flex gap-2'>
              <p className='px-4'>No services to show</p>
            </div>
          </div>
        </div>

        <div className='w-1/2 flex flex-col gap-8'>
          <div id='projects'>
            <h4 className='text-lg font-medium border-b-[1px] border-gray-700'>
              Projects
            </h4>
            <div className='py-5 flex gap-2'>
              <p className='px-4'>No projects to show</p>
            </div>
          </div>

          <div id='links'>
            <h4 className='text-lg font-medium border-b-[1px] border-gray-700'>
              Links
            </h4>
            <div className='py-5 flex gap-2'>
              {profile.portefolio && (
                <Link href={profile.portefolio} className='py-2 px-4'>
                  <Image
                    src='/pink-portefolio.svg'
                    alt='portefolio'
                    width={32}
                    height={32}
                    priority
                  />
                </Link>
              )}
              {profile.github && (
                <Link href={profile.github} className='py-2 px-4'>
                  <Image
                    src='/pink-github.svg'
                    alt='github'
                    width={32}
                    height={32}
                    priority
                  />
                </Link>
              )}
              {profile.twitter && (
                <Link href={profile.twitter} className='py-2 px-4'>
                  <Image
                    src='/pink-twitter.svg'
                    alt='twitter'
                    width={32}
                    height={32}
                    priority
                  />
                </Link>
              )}
              {profile.otherLink && (
                <Link href={profile.otherLink} className='py-2 px-4'>
                  <Image
                    src='/pink-portefolio.svg'
                    alt='otherLink'
                    width={32}
                    height={32}
                    priority
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
