'use client'

import clsx from 'clsx'
import React from 'react'
import Button from '@/app/components/Button'

import Dialog from '@/app/components/Dialog'

export default function ChooseBioDialog({
  onSelectBio,
  onClose,
  options,
  open,
}: {
  onSelectBio: (bio: string) => void
  onClose: () => void
  options: string[] | null
  open: boolean
}) {
  const [improvedBio, setImprovedBio] = React.useState('')

  return (
    <Dialog open={open} onClose={onClose}>
      <div
        className={clsx(
          'p-10',
          'rounded-[32px]',
          'font-light',
          'bg-white',
          'backdrop-blur-xl',
          'bg-opacity-20'
        )}>
        <h3 className='font-semibold text-5xl text-center whitespace-nowrap'>Choose your bio</h3>
        <div className={clsx('my-8', 'flex', 'flex-col', 'gap-4')}>
          {options?.map(option => (
            <div
              key={option}
              className={clsx(
                'px-4',
                'py-5',
                'rounded-[26px]',
                'max-w-3xl',
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
                <div className='h-6 w-6 border-white border-2 rounded-full p-1'>
                  {option === improvedBio ? (
                    <div className='h-full w-full bg-pink rounded-full' />
                  ) : null}
                </div>

                <div className='flex-1 flex flex-col'>
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
            onSelectBio(improvedBio)
            onClose()
          }}>
          Done
        </Button>
      </div>
    </Dialog>
  )
}
