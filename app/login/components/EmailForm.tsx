'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import React from 'react'

import Button from '@/app/components/Button'
import { useWeb3Auth } from '@/lib/web3auth'

const labelClassNames = ['text-sm', 'font-light', 'opacity-70']
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

export default function EmailForm() {
  const { login } = useWeb3Auth()

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        await login('email_passwordless', values.email)
        setSubmitting(false)
      }}>
      {({ isSubmitting }) => (
        <Form>
          <label htmlFor='email' className={clsx(labelClassNames)}>
            Email
          </label>
          <Field
            type='email'
            name='email'
            placeholder='alan@turing.com'
            className={clsx(inputClassNames)}
          />
          <ErrorMessage
            name='email'
            component='div'
            className='font-light text-center'
          />

          <Button type='submit' isLoading={isSubmitting} className='mt-5'>
            Continue with email
          </Button>
        </Form>
      )}
    </Formik>
  )
}
