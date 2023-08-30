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
      className='fixed inset-0 bg-black/[.6] flex justify-center p-24'
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
        <Image
          className='absolute top-6 right-6 cursor-pointer z-50'
          src='/cross.svg'
          alt='Close'
          width={44}
          height={44}
          priority
          onClick={() => {
            onClose()
          }}
        />
        <div className='inset-0'>{children}</div>
      </div>
    </div>
  )
}
