'use client'

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
// TODO remove Yup
import * as Yup from 'yup'

import { Button } from '@/app/components'
import { cn } from '@/lib/utils'

import { inputClassNames } from '@/app/profile/new/info/page'

export default function EmailForm({
  onSubmit,
}: {
  onSubmit: ({ email }: { email: string }) => void
}) {
  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit({ email: values.email })
        setSubmitting(false)
      }}>
      {({ isSubmitting }) => (
        <Form>
          <fieldset>
            <label htmlFor='email' className='text-sm font-light opacity-70'>
              Email
            </label>
            <Field
              className={cn(inputClassNames)}
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

          <Button
            type='submit'
            isLoading={isSubmitting}
            className='mt-5 w-full'>
            Continue with email
          </Button>
        </Form>
      )}
    </Formik>
  )
}
