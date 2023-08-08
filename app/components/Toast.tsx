'use client'
import React from 'react'
import { useTimeout } from 'usehooks-ts'

export default function Toast({
  message,
  duration = 4200,
  onClose,
}: {
  message: string | null
  // severity: 'info' | 'warn' | 'error'
  duration?: number
  onClose?: () => void
}) {
  function hide() {
    console.log('Hide')
    onClose?.()
  }

  useTimeout(hide, duration)

  return (
    <div
      className='fixed inset-x-8 bottom-4 flex items-center justify-center animate-slide-up'
      onClick={hide}>
      <div onClick={hide}>
        <p className='px-4 py-2 cursor-pointer rounded-md shadow-md bg-red text-white'>
          {message}
        </p>
      </div>
    </div>
  )
}
