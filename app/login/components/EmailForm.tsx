'use client'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import React from 'react'

import Button from '@/app/components/Button'
import { useWeb3Auth } from '@/lib/web3auth'
import InputField from '@/app/components/InputField'

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
          <InputField
            label='Email'
            name='email'
            type='email'
            placeholder='alan@turing.com'
          />

          <Button type='submit' isLoading={isSubmitting} className='mt-5'>
            Continue with email
          </Button>
        </Form>
      )}
    </Formik>
  )
}
