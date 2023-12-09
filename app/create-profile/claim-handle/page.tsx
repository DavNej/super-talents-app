'use client'

import React from 'react'
import { useFormik } from 'formik'
import { useLocalStorage } from 'usehooks-ts'

import { useMintProfile, useTalentLayerUser } from '@/features/talent-layer'
import useHandlePrice from '@/features/talent-layer/hooks/useHandlePrice'
import { useSmartAccount } from '@/features/smart-account'

import { Button, Title, inputClassNames } from '@/app/components'
import { cn } from '@/utils'

import { type HandleFormType, validationSchema } from './validation'

export default function ClaimHandlePage() {
  const { smartAccountAddress } = useSmartAccount()

  const [handle, setHandle] = useLocalStorage('handle', '')

  const talentLayerUserQuery = useTalentLayerUser({ handle })

  const isHandleAvailable = talentLayerUserQuery.data === null

  const formik = useFormik<HandleFormType>({
    initialValues: { handle, confirmed: false },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true)
      try {
        const address = smartAccountAddress
        const value = handlePriceQuery.data?.handlePrice
        if (address && value && handle && isHandleAvailable) {
          console.log({
            address,
            value,
            handle,
          })
          // mintProfileMutation.mutate({
          //   address,
          //   value,
          //   handle,
          // })
        }
        setSubmitting(false)
        return
      } catch (err) {
        return
      }
    },
  })

  const fieldError = formik.touched.handle && formik.errors.handle

  const handlePriceQuery = useHandlePrice(
    { handle },
    { enabled: Boolean(isHandleAvailable && !fieldError) }
  )

  const mintProfileMutation = useMintProfile()

  React.useEffect(() => {
    if (!formik.touched.handle) return

    if (!formik.errors.handle || !formik.values.handle) {
      setHandle(formik.values.handle)
    }
  }, [
    formik.errors.handle,
    formik.touched.handle,
    formik.values.handle,
    setHandle,
  ])

  return (
    <>
      <Title>Claim handle</Title>

      <form onSubmit={formik.handleSubmit} className=' mt-8'>
        <p
          className={cn(
            'min-h-4 text-sm font-light opacity-70',
            fieldError ? 'text-red' : 'text-green'
          )}>
          {fieldError || (isHandleAvailable && 'Handle available')}
        </p>

        <input
          className={cn(inputClassNames)}
          type='text'
          name='handle'
          placeholder='Choose a profile handle (ex: alanturing)'
          value={formik.values.handle}
          onBlur={formik.handleBlur}
          onChange={e =>
            formik.setFieldValue('handle', e.target.value.toLowerCase())
          }
        />

        <div className='flex gap-4 my-8'>
          <input
            type='checkbox'
            name='confirmed'
            checked={formik.values.confirmed}
            onChange={formik.handleChange}
          />

          <p className='text-sm font-light opacity-70'>
            Claiming your profile handle is fully free at the moment, but it is
            irreversible, so make sure that you choose a handle you want to
            keep.
          </p>
        </div>

        <Button
          className='w-full'
          isDisabled={
            !formik.isValid ||
            !isHandleAvailable ||
            !formik.values.confirmed ||
            formik.isSubmitting
          }
          onClick={formik.handleSubmit}>
          Claim handle
        </Button>
      </form>
    </>
  )
}
