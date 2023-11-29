'use client'

import { cn } from '@/utils'
import React from 'react'
import { v4 as uuid } from 'uuid'

import { Button, Dialog } from '@/app/components'

export default function ChooseAboutDialog({
  onSelectAbout,
  onClose,
  options,
  open,
}: {
  onSelectAbout: (about: string) => void
  onClose: () => void
  options: string[] | null
  open: boolean
}) {
  const [improvedAbout, setImprovedAbout] = React.useState('')

  return (
    <Dialog open={open} onClose={onClose}>
      <div
        className={cn(
          'py-7',
          'px-3',
          'md:p-10',
          'rounded-[20px]',
          'md:rounded-[32px]',
          'font-light',
          'bg-white',
          'backdrop-blur-xl',
          'bg-opacity-20'
        )}>
        <h3 className='font-semibold text-4xl md:text-5xl mb-7 md:mb-0 md:whitespace-nowrap text-center'>
          Choose your about
        </h3>

        <div
          className={cn(
            'my-8',
            'flex',
            'flex-col',
            'flex-1',
            'gap-2',
            'md:gap-4',
            'overflow-y-scroll',
            'max-h-80'
          )}>
          {options?.map(option => (
            <div
              key={uuid()}
              className={cn(
                'px-2',
                'md:px-4',
                'py-3',
                'md:py-5',
                'rounded-[26px]',
                'max-w-3xl',
                'cursor-pointer',
                'border-white',
                'border-2',
                option === improvedAbout
                  ? 'border-opacity-100'
                  : 'border-opacity-0'
              )}
              onClick={() => {
                setImprovedAbout(option)
              }}>
              <div className='flex gap-3'>
                <div className='h-6 w-6 border-white border-2 rounded-full p-1'>
                  {option === improvedAbout ? (
                    <div className='h-full w-full bg-pink rounded-full' />
                  ) : null}
                </div>

                <div className='flex-1 flex flex-col'>
                  {option.split('\n').map(line => (
                    <p key={uuid()}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button
          className='w-full'
          onClick={() => {
            onSelectAbout(improvedAbout)
            onClose()
          }}>
          Done
        </Button>
      </div>
    </Dialog>
  )
}
