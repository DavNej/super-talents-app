'use client'

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import z from 'zod'

import { Button } from '@/app/components'
import { cn } from '@/utils'

import { inputClassNames } from '@/app/components'
import { useAuth } from '@/features/auth'

const EmailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export default function EmailForm() {
  const { login } = useAuth()

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={toFormikValidationSchema(EmailSchema)}
      onSubmit={(values, { setSubmitting }) => {
        login?.mutate({
          loginProvider: 'email_passwordless',
          email: values.email,
        })
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
