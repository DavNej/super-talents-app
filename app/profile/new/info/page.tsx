'use client'

import clsx from 'clsx'
import React from 'react'
import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'
import Chip from '@/app/components/Chip'

import Image from 'next/image'
import fetcher from '@/lib/fetcher'
import Dialog from '@/app/components/Dialog'
import { ChatCompletionResponseMessage } from 'openai'

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


function splitBios(bios: string): string[] {
  const regex = /Option \d+:/g
  return bios
    .split(regex)
    .map(str => str.trim())
    .filter(Boolean)
}

export default function InfoPage() {
  const formRef = React.useRef<HTMLFormElement>(null)
  const skillRef = React.useRef<HTMLInputElement>(null)
  const [skills, setSkills] = React.useState<string[]>([])

  const [GPTProposals, setGPTProposals] = React.useState<string[] | null>(null)
  const [improvedBio, setImprovedBio] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [error, setError] = React.useState('')

  function addSkill(event: React.FormEvent) {
    event.preventDefault()
    if (formRef.current && skillRef.current) {
      const newSkill = skillRef.current.value
      const skillSet = Array.from(new Set([...skills, newSkill]))
      setSkills(skillSet.filter(Boolean))
      skillRef.current.value = ''
    }
  }

  async function improveBio() {
    if (formRef.current) {
      const data = new FormData(formRef.current)
      const bio = String(data.get('bio') || '')
      setIsLoading(true)
      const res = await fetcher.POST<ChatCompletionResponseMessage>(
        '/profile/new/info/improve-bio',
        { bio }
      )

      if (!res.ok) {
        setError(res.error.message)
        setIsLoading(false)
        return
      }

      const content = res.data.content
      if (content) {
        setGPTProposals(splitBios(content))
        setOpenDialog(true)
        setIsLoading(false)
      }
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
                placeholder='Choose a profile handle (ex @alanturing)'
              />
            </label>

            <label>
              <p className={clsx(labelClassNames)}>Display Name</p>
              <input
                className={clsx(inputClassNames)}
                type='text'
                name='name'
                placeholder='Choose a Fulle Name (ex Alan Turing)'
              />
            </label>

            <label className='flex-1 flex flex-col'>
              <p className={clsx(labelClassNames)}>Bio</p>
              <div className={clsx(...inputClassNames, 'flex-1')}>
                <textarea
                  className='w-full h-52 bg-white bg-opacity-0 outline-none'
                  name='bio'
                  placeholder='Write a bio or some keywords'
                />
                <Button className='bg-opacity-0 scale-75' onClick={improveBio}>
                  Improve bio with AI
                </Button>
              </div>
            </label>

            <label>
              <p className={clsx(labelClassNames)}>Add your skills</p>
              <input
                ref={skillRef}
                className={clsx(inputClassNames)}
                type='text'
                name='skills'
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

        <Dialog
          open={Boolean(GPTProposals) && openDialog}
          onClose={() => {
            setOpenDialog(false)
          }}>
          <div
            className={clsx(
              'p-10',
              'w-4xl',
              'rounded-[32px]',
              'font-light',
              'bg-white',
              'backdrop-blur-xl',
              'bg-opacity-20'
            )}>
            <h3 className='font-semibold text-5xl text-center'>
              Choose your bio
            </h3>
            <div className={clsx('my-8', 'flex', 'flex-col', 'gap-4')}>
              {GPTProposals?.map(option => (
                <div
                  key={option}
                  className={clsx(
                    'px-4',
                    'py-5',
                    'rounded-[26px]',
                    'cursor-pointer',
                    'border-white',
                    'border-2',
                    option === improvedBio
                      ? 'border-opacity-100'
                      : 'border-opacity-0'
                  )}
                  onClick={() => {
                    setImprovedBio(option)
                  }}>
                  <div className='flex gap-3'>
                    <div className='h-6 w-6 border-white border-2 rounded-full'>
                      {option === improvedBio ? (
                        <div className='h-full w-full bg-pink rounded-full border-2' />
                      ) : null}
                    </div>

                    <div className='flex flex-col'>
                      {option.split('\n').map(line => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => {
                const textarea = formRef.current?.elements.namedItem(
                  'bio'
                ) as HTMLTextAreaElement
                if (!!textarea) {
                  textarea.value = improvedBio
                }
                setOpenDialog(false)
              }}>
              Done
            </Button>
          </div>
        </Dialog>
      </div>
    </main>
  )
}
