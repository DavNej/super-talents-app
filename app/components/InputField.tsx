'use client'

import { Field, ErrorMessage } from 'formik'
import clsx from 'clsx'
import React from 'react'

const inputClassNames = [
  'py-4',
  'px-8',
  'mt-2',
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

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export default function InputField(props: InputProps) {
  const { name, type, placeholder, className, label } = props

  return (
    <>
      {label && (
        <label htmlFor={name} className='text-sm font-light opacity-70'>
          {label}
        </label>
      )}
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className={clsx(inputClassNames, className)}
      />
      <ErrorMessage
        name={name}
        component='div'
        className='font-light text-right'
      />
    </>
  )
}
