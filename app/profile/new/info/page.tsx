'use client'

import clsx from 'clsx'
import React from 'react'
import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'
import Chip from '@/app/components/Chip'

import Image from 'next/image'

const labelClassNames = ['text-sm', 'font-light', 'opacity-70']
const inputClassNames = [
  'py-4',
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
  const formRef = React.useRef<HTMLFormElement>(null)
  const skillRef = React.useRef<HTMLInputElement>(null)
  const [skills, setSkills] = React.useState<string[]>([])

  function addSkill(event: React.FormEvent) {
    event.preventDefault()
    if (formRef.current && skillRef.current) {
      const newSkill = skillRef.current.value
      const skillSet = Array.from(new Set([...skills, newSkill]))
      setSkills(skillSet.filter(Boolean))
      skillRef.current.value = ''
    }
  }

  function removeSkill(skill: string) {
    setSkills(prev => prev.filter(s => s !== skill))
  }

  function handleSubmit() {
    if (formRef.current) {
      const data = new FormData(formRef.current)

      const body = Object.fromEntries(data)

      console.log('🦋 | body', body)
    }
  }
  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <h3 className='font-semibold text-5xl mb-12'>Add Profile Info</h3>

        <form
          ref={formRef}
          className='flex flex-1 gap-x-24 items-stretch'
          onSubmit={addSkill}>
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
              <p className={clsx(labelClassNames)}>Name</p>
              <input
                className={clsx(inputClassNames)}
                type='text'
                name='name'
                placeholder='Full name'
              />
            </label>

            <label className='flex-1 flex flex-col'>
              <p className={clsx(labelClassNames)}>Bio</p>
              <textarea
                className={clsx(...inputClassNames, 'flex-1')}
                name='bio'
                placeholder='Write something about you'
              />
            </label>

            <label>
              <p className={clsx(labelClassNames)}>Add your skills</p>
              <input
                ref={skillRef}
                className={clsx(inputClassNames)}
                type='text'
                name='skill'
                placeholder='Graphic design (then press Enter)'
              />
            </label>
            <input type='submit' hidden />

            <div className='flex gap-2 flex-wrap'>
              {skills.map(skill => (
                <Chip
                  key={skill}
                  caption={skill}
                  onDelete={() => {
                    removeSkill(skill)
                  }}
                />
              ))}
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

            <Button onClick={handleSubmit}>Next</Button>
          </div>
        </form>
      </div>
    </main>
  )
}
