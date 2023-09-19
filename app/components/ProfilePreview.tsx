import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { v4 as uuid } from 'uuid';

import { roleCaptions } from '@/lib/profile/helpers'
import { IPFSProfileType } from '@/lib/profile/types'


export default function ProfilePreview({
  handle,
  profileData,
  isSigner = false,
}: {
  handle: string
  profileData: IPFSProfileType
  isSigner?: boolean
}) {
  return (
    <div className='rounded-[40px] border-pink border-4 overflow-hidden'>
      <div className='px-12 py-4 col-span-2 bg-gray-800 flex items-center justify-between'>
        <Image src='/mask.png' alt='logo' width={72} height={27} />
        {isSigner && (
          <Link href='/create-profile/info'>
            <Image src='/edit.svg' alt='edit' width={24} height={24} />
          </Link>
        )}
      </div>

      <div className='px-14 py-11 flex gap-14'>
        <div className='w-4/6 flex flex-col gap-8'>
          <div className='flex gap-8 items-start'>
            <Image
              src={profileData.picture}
              style={{
                clipPath:
                  'path("M74.0171 4.16112L12.0171 39.8888C4.58185 44.1734 0 52.1018 0 60.6833V132.06C0 140.641 4.58186 148.569 12.0171 152.854L74.0171 188.582C81.434 192.856 90.566 192.856 97.9829 188.582L159.983 152.854C167.418 148.569 172 140.641 172 132.06V60.6833C172 52.1018 167.418 44.1734 159.983 39.8888L97.9829 4.16112C90.566 -0.112901 81.434 -0.112899 74.0171 4.16112Z")',
              }}
              alt='logo'
              width={192}
              height={192}
            />
            <div className='flex flex-col justify-between'>
              <p className='font-semibold text-2xl'>{profileData.name}</p>
              <p className='font-light'>@{handle}</p>
              <p className='font-normal text-pink whitespace-nowrap'>
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

        <div className='w-2/6 flex flex-col gap-8'>
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
        </div>
      </div>
    </div>
  )
}
