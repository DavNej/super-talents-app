import React from 'react'
import { useFormik } from 'formik'
import clsx from 'clsx'

import { IFormValues, initialValues, validationSchema } from './form-utils'
import Button from '@/app/components/Button'
import fetcher from '@/lib/fetcher'
import type { ChatCompletionResponseMessage } from 'openai'
import ChooseBioDialog from './components/ChooseBioDialog'
import Chip from '@/app/components/Chip'
import Image from 'next/image'

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

export default function ProfileForm() {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit(values) {
      console.log('🦋 | onSubmit | values', values)
    },
  })

  const [GPTOptions, setGPTOptions] = React.useState<string[] | null>(null)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isBioLoading, setIsBioLoading] = React.useState(false)

  const [skill, setSkill] = React.useState('')

  async function improveBio() {
    const bio = formik.values.bio
    setIsBioLoading(true)
    const res = await fetcher.POST<ChatCompletionResponseMessage>(
      '/profile/new/info/improve-bio',
      { bio }
    )

    if (!res.ok) {
      setIsBioLoading(false)
      return
    }

    const content = res.data.content
    if (content) {
      setGPTOptions(JSON.parse(content.trim()))
      setOpenDialog(true)
      setIsBioLoading(false)
    }
  }

  function addSkill(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const newSkill = event.currentTarget.value.trim()

      const newSkillSet = Array.from(
        new Set([...formik.values.skills, newSkill])
      ).filter(Boolean)

      formik.setFieldValue('skills', newSkillSet)
      setSkill('')
    }
  }

  function removeSkill(skill: string) {
    const newSkillSet = formik.values.skills.filter(s => s !== skill)
    formik.setFieldValue('skills', newSkillSet)
  }

  function fieldError(fieldName: keyof IFormValues) {
    return formik.touched[fieldName] && formik.errors[fieldName]
  }

  function SimpleLabel({
    name,
    children,
  }: {
    name: keyof IFormValues
    children: React.ReactNode
  }) {
    return (
      <label
        className={clsx(
          'text-sm font-light opacity-70',
          fieldError(name) && 'text-red'
        )}
        htmlFor={name}>
        {fieldError(name) || children}
      </label>
    )
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit} className='grid grid-cols-2 gap-8'>
        <fieldset id='handle'>
          <SimpleLabel name='handle'>Handle</SimpleLabel>
          <input
            className={clsx(inputClassNames)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type='text'
            name='handle'
            placeholder='Choose a profile handle (ex: alanturing)'
          />
        </fieldset>
        <fieldset id='name'>
          <SimpleLabel name='name'>Name</SimpleLabel>
          <input
            className={clsx(inputClassNames)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type='text'
            name='name'
            placeholder='Choose a Full Name (ex: Alan Turing)'
          />
        </fieldset>
        <fieldset id='bio' className='flex flex-col'>
          <SimpleLabel name='bio'>Bio</SimpleLabel>
          <div className={clsx(inputClassNames, 'flex flex-col flex-1')}>
            <textarea
              className=' h-52 bg-transparent outline-none flex-1'
              name='bio'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bio}
              placeholder='Write a bio or some keywords'
            />
            <Button
              className='bg-opacity-0 scale-75'
              isDisabled={!Boolean(formik.values.bio)}
              isLoading={isBioLoading}
              onClick={improveBio}>
              Improve bio with AI
            </Button>
          </div>
        </fieldset>
        <fieldset id='links'>
          <SimpleLabel name='portefolio'>Links</SimpleLabel>
          <input
            className={clsx(inputClassNames)}
            type='text'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name='portefolio'
            placeholder='Add portefolio'
          />

          {formik.errors.twitter && (
            <SimpleLabel name='twitter'>{formik.errors.twitter}</SimpleLabel>
          )}

          <input
            className={clsx(inputClassNames)}
            type='text'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name='twitter'
            placeholder='Add Twitter link'
          />

          {formik.errors.github && (
            <SimpleLabel name='github'>{formik.errors.github}</SimpleLabel>
          )}

          <input
            className={clsx(inputClassNames)}
            type='text'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name='github'
            placeholder='Add Github link'
          />

          {formik.errors.otherLink && (
            <SimpleLabel name='otherLink'>
              {formik.errors.otherLink}
            </SimpleLabel>
          )}
          <input
            className={clsx(inputClassNames)}
            type='text'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name='otherLink'
            placeholder='Add other link'
          />
        </fieldset>
        <fieldset id='skills' className='row-span-2'>
          <SimpleLabel name='skills'>Skills</SimpleLabel>
          <input
            className={clsx(inputClassNames)}
            onChange={e => setSkill(e.currentTarget.value)}
            onBlur={formik.handleBlur}
            value={skill}
            onKeyDown={addSkill}
            type='text'
            name='skills'
            placeholder='Graphic design (then press Enter)'
          />
          <div className='flex flex-row items-start gap-2 flex-wrap mt-2'>
            {formik.values.skills.map(skill => (
              <Chip
                key={skill}
                caption={skill}
                onDelete={() => removeSkill(skill)}
              />
            ))}
          </div>
        </fieldset>
        <fieldset id='role'>
          <SimpleLabel name='role'>Role</SimpleLabel>
          <div className='relative mt-2'>
            <select
              name='role'
              defaultValue=''
              className={clsx(
                'appearance-none',
                inputClassNames,
                'mt-0',
                'relative'
              )}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}>
              <option disabled value=''>
                -- Choose role --
              </option>
              <option value='seller'>Talent seeking project</option>
              <option value='buyer'>Client seeking talent</option>
              <option value='both'>Both</option>
            </select>

            <div className='pointer-events-none absolute inset-y-0 right-8 flex items-center'>
              <Image
                src='/chevron-down.svg'
                alt='Arrow'
                className='w-5 h-5 text-gray-400'
                width={5}
                height={5}
              />
            </div>
          </div>
        </fieldset>

        <Button
          onClick={formik.handleSubmit}
          isDisabled={!formik.dirty || !formik.isValid || formik.isSubmitting}>
          Next
        </Button>
      </form>

      <ChooseBioDialog
        open={Boolean(GPTOptions) && openDialog}
        options={GPTOptions}
        onSelectBio={bio => {
          formik.setFieldValue('bio', bio)
        }}
        onClose={() => {
          setOpenDialog(false)
        }}
      />
    </>
  )
}
