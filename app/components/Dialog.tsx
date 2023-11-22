import React from 'react'
import Image from 'next/image'

export default function Dialog({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  React.useEffect(() => {
    function closeOnEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keyup', closeOnEscape)
    return function cleanup() {
      window.removeEventListener('keyup', closeOnEscape)
    }
  }, [onClose])

  if (!open) return null

  return (
    <div
      className='fixed inset-0 bg-black/[.6] flex justify-center items-center p-5 md:p-24'
      onClick={() => {
        onClose()
      }}>
      <div
        className='relative'
        onScroll={e => {
          e.stopPropagation()
        }}
        onClick={e => {
          e.stopPropagation()
        }}>
        <div className='w-8 h-8 md:w-11 md:h-11 absolute top-2 md:top-6 right-2 md:right-6 cursor-pointer z-50'>
          <Image
            className='w-full h-auto'
            src='/cross.svg'
            alt='Close'
            width={44}
            height={44}
            onClick={() => {
              onClose()
            }}
            layout='responsive'
          />
        </div>

        <div className='inset-0'>{children}</div>
      </div>
    </div>
  )
}
