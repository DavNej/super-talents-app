'use client'

import Image from 'next/image'
import { Formik, Form, Field, ErrorMessage, FormikProps } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'

import fetcher from '@/lib/fetcher'
import Button from '@/app/components/Button'

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

type LoginProvider =
  | 'github'
  | 'google'
  | 'twitter'
  | 'linkedin'
  | 'email_passwordless'

const providers: {
  icon: string
  name: LoginProvider
}[] = [
  {
    icon: '/linkedin.svg',
    name: 'linkedin',
  },
  {
    icon: '/github.svg',
    name: 'github',
  },
  {
    icon: '/twitter.svg',
    name: 'twitter',
  },
  {
    icon: '/google.svg',
    name: 'google',
  },
]

export default function LoginPage() {
  async function login(loginProvider: LoginProvider, email?: string) {
    const res = fetcher.POST('/login/auth', { loginProvider, email })
    console.log({ res })
  }

  return (
    <div className='px-14 py-16 bg-gradient-to-b from-purple-500 to-pink h-[644px] rounded-[50px]'>
      <h3 className='font-semibold text-5xl mb-14 whitespace-nowrap'>
        Let’s get started
      </h3>
      {/* <p className='font-light text-lg'>Lorem ipsum dolor sit amet consectetur. </p> */}
      <p className='mb-8 font-normal text-xl uppercase'>Continue with</p>
      <ul className='flex justify-between'>
        {providers.map(provider => (
          <li
            className='cursor-pointer'
            key={provider.name}
            onClick={async () => {
              await login(provider.name)
            }}>
            <Image
              src={provider.icon}
              alt={provider.name}
              width={48}
              height={48}
              priority
            />
          </li>
        ))}
      </ul>
      <div className='my-12 flex items-center gap-5 opacity-50'>
        <hr className='flex-1' />
        <span>or</span>
        <hr className='flex-1' />
      </div>

      <div>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid email address')
              .required('Required'),
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
      </div>
    </div>
  )
}
