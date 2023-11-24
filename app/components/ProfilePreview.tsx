import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'

import { roleCaptions, type ProfileWithPictureType } from '@/features/profile'

import HexagonImage from './HexagonImage'

export default function ProfilePreview({
  handle,
  profileData,
  isSigner = false,
}: {
  handle: string
  profileData: ProfileWithPictureType
  isSigner?: boolean
}) {
  return (
    <div className='mb-6 md:mb-8 rounded-[20px] md:rounded-[40px] border-pink border-[3px] md:border-4 overflow-hidden'>
      <div className='p-3 md:px-12 md:py-4 col-span-2 bg-gray-800 flex items-center justify-between'>
        <div className='w-[39px] h-[14px] md:w-[72px] md:h-[27px]'>
          <Image
            src='/mask.png'
            alt='SuperTalents Logo'
            width={72}
            height={27}
            className='w-full h-auto'
          />
        </div>

        {isSigner && (
          <Link href='/create-profile/info'>
            <div className='w-5 h-5 md:w-6 md:h-6'>
              <Image
                src='/edit.svg'
                alt='edit'
                width={24}
                height={24}
                className='w-full h-auto'
              />
            </div>
          </Link>
        )}
      </div>

      <div className='px-3 py-7 md:px-14 md:py-11 flex flex-col md:flex-row gap-8 md:gap-14'>
        <div className='md:w-4/6 flex flex-col gap-8'>
          <div className='flex flex-col md:flex-row gap-8 items-start'>
            <HexagonImage src={profileData.picture} />

            <div className='flex flex-col justify-between'>
              <p className='font-semibold text-2xl'>{profileData.name}</p>
              <p className='font-light'>@{handle}</p>
              <p className='my-4 md:my-0 font-normal text-pink whitespace-nowrap'>
                {profileData.role && roleCaptions[profileData.role]}
              </p>
              <div className='font-light'>
                {profileData.about.split('\n').map(paragraph => (
                  <p key={uuid()}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div id='skills'>
            <h4 className='text-lg font-medium border-b-[1px] border-gray-700'>
              Skills
            </h4>
            <div className='py-5 flex gap-2'>
              {profileData.skills.map(skill => (
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

        <div className='md:w-2/6 flex flex-col gap-8'>
          <div id='links'>
            <h4 className='text-lg font-medium border-b-[1px] border-gray-700'>
              Links
            </h4>
            <div className='py-5 flex gap-2'>
              {profileData.portfolio && (
                <Link href={profileData.portfolio} className='py-2 px-4'>
                  <Image
                    src='/pink-portfolio.svg'
                    alt='portfolio'
                    width={32}
                    height={32}
                  />
                </Link>
              )}
              {profileData.github && (
                <Link href={profileData.github} className='py-2 px-4'>
                  <Image
                    src='/pink-github.svg'
                    alt='github'
                    width={32}
                    height={32}
                  />
                </Link>
              )}
              {profileData.twitter && (
                <Link href={profileData.twitter} className='py-2 px-4'>
                  <Image
                    src='/pink-twitter.svg'
                    alt='twitter'
                    width={32}
                    height={32}
                  />
                </Link>
              )}
              {profileData.otherLink && (
                <Link href={profileData.otherLink} className='py-2 px-4'>
                  <Image
                    src='/pink-portfolio.svg'
                    alt='otherLink'
                    width={32}
                    height={32}
                  />
                </Link>
              )}
            </div>
          </div>

          <div id='projects'>
            <h4 className='text-lg font-medium border-b-[1px] border-gray-700'>
              Projects
            </h4>
            <div className='py-5 flex gap-2'>
              <p className='px-4'>No projects to show</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
