'use client'

import clsx from 'clsx'
import React from 'react'
import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'
import Chip from '@/app/components/Chip'

import Image from 'next/image'

const labelClassNames = ['text-sm', 'font-light', 'opacity-70']
const inputClassNames = [
  'py-5',
  'px-8',
  'mt-3',
  'w-full',
  'rounded-[32px]',
  'font-light',
  'bg-white',
  'backdrop-blur-xl',
  'bg-opacity-20',
  'outline-none',
  'border-white',
  'border-2',
  'border-opacity-0',
  'focus:border-opacity-100',
]

export default function InfoPage() {
  const formRef = React.useRef(null)
  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <h3 className='font-semibold text-5xl mb-12'>Add Profile Info</h3>

        <form
          ref={formRef}
          className='flex flex-1 gap-x-24 items-start'
          onSubmit={event => {
            if (formRef.current) {
              event.preventDefault()
              const data = new FormData(formRef.current)

              console.log('🦋 | InfoPage | data', data)
            }
          }}>
          <div className='flex flex-col w-1/2 gap-y-5'>
            <label>
              <p className={clsx(labelClassNames)}>Handle</p>
              <input
                className={clsx(inputClassNames)}
                type='text'
                name='handle'
                placeholder='Choose a profile handle'
              />
            </label>

            <label>
              <p className={clsx(labelClassNames)}>Bio</p>
              <textarea
                className={clsx(inputClassNames)}
                name='bio'
                placeholder='Write something about you'
              />
            </label>

            <label>
              <p className={clsx(labelClassNames)}>Add your skills</p>
              <input
                className={clsx(inputClassNames)}
                type='text'
                name='skills'
                placeholder='Graphic design'
              />
            </label>

            <div className='flex gap-2'>
              <Chip caption='Skill 1' onDelete={() => {}} />
              <Chip caption='Skill 2' onDelete={() => {}} />
              <Chip caption='Skill 3' onDelete={() => {}} />
            </div>
          </div>

          <div className='flex-col w-1/2'>
            <p className={clsx(labelClassNames)}>Links</p>
            <input
              className={clsx(inputClassNames)}
              type='text'
              name='portefolio'
              placeholder='Add portefolio'
            />
            <input
              className={clsx(inputClassNames)}
              type='text'
              name='twitter'
              placeholder='Add Twitter link'
            />
            <input
              className={clsx(inputClassNames)}
              type='text'
              name='gihub'
              placeholder='Add Github link'
            />
            <input
              className={clsx(inputClassNames)}
              type='text'
              name='link'
              placeholder='Add other link'
            />

            <div className='relative'>
              <select
                name='role'
                className={clsx(
                  'appearance-none',
                  ...inputClassNames,
                  'mt-9',
                  'mb-9'
                )}
                // className='appearance-none focus:outline-none focus:ring focus:border-blue-300'
                placeholder='Choose role'>
                <option value='seeking-project'>Talent seeking project</option>
                <option value='seeking-talent'>Client seeking talent</option>
                <option value='talent-supporter'>Supporter for talent</option>
              </select>

              <div className='pointer-events-none absolute inset-y-0 right-8 flex items-center pr-2'>
                <Image
                  src='/chevron-down.svg'
                  alt='Arrow'
                  className='w-5 h-5 text-gray-400'
                  width={5}
                  height={5}
                />
              </div>
            </div>

            <Button type='submit'>Next</Button>
          </div>
        </form>
      </div>
    </main>
  )
}
