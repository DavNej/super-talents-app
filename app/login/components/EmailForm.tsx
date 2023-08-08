'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import React from 'react'

import Button from '@/app/components/Button'
import { useWeb3Auth } from '@/lib/web3auth'
import { inputClassNames } from '@/app/profile/new/info/components/ProfileForm'
import clsx from 'clsx'

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
          <fieldset>
            <label htmlFor='email' className='text-sm font-light opacity-70'>
              Email
            </label>
            <Field
              className={clsx(inputClassNames)}
              name='email'
              type='email'
              placeholder='alan@turing.com'
            />
            <ErrorMessage
              name='email'
              component='div'
              className='font-light text-right'
            />
          </fieldset>

          <Button type='submit' isLoading={isSubmitting} className='mt-5'>
            Continue with email
          </Button>
        </Form>
      )}
    </Formik>
  )
}
