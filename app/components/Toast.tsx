'use client'
import React, { useState } from 'react'
import { useTimeout } from 'usehooks-ts'
// import type { ApiError } from "~/utils/error-utils";
// import { formatErrorMessage } from "~/utils/error-utils";

import Button from '../components/Button'

export default function Toast({
  message,
  duration = 3000,
  onClose,
}: {
  message: string
  duration?: number
  onClose?: () => void
}) {
  const [visible, setVisible] = useState(true)

  function hide() {
    setVisible(false)
  }

  useTimeout(hide, duration)

  React.useEffect(() => {
    console.error(message)
  }, [message])

  //  <Alert severity="error">
  //    {error?.reason ? `${error?.reason}: ` : ""}
  //    {formatErrorMessage(error?.message)}
  //  </Alert>

  if (!visible) return null

  return (
    <div
      className='fixed inset-x-8 bottom-4 flex items-center justify-center animate-slide-up'
      onClick={() => {
        hide()
        onClose?.()
      }}>
      <div
        onClick={() => {
          hide()
          onClose?.()
        }}>
        <p className='px-4 py-2 cursor-pointer rounded-md shadow-md bg-red text-white'>
          {message}
        </p>
      </div>
    </div>
  )
}
