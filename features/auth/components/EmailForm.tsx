'use client'

import React from 'react'
import clsx from 'clsx'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { Button } from '@/app/app/components'
import { inputClassNames } from '@/lib/utils'

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
