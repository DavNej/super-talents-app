import React from 'react'
import { useFormik } from 'formik'
import clsx from 'clsx'
import Image from 'next/image'
import type { ChatCompletionResponseMessage } from 'openai'

import { cn } from '@/lib/utils'
import { roleCaptions, validationSchema, initialValues } from '@/lib/form-utils'
import fetcher from '@/lib/fetcher'
import Button from '@/app/components/Button'
import Chip from '@/app/components/Chip'

import type { IProfile, IProfileForm } from '@/app/hooks/profile/types'

import ChooseAboutDialog from './ChooseAboutDialog'
import { toast } from 'react-toastify'

export const inputClassNames = [
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

export default function ProfileForm({
  profile,
  onSubmit,
}: {
  profile: IProfile | null
  onSubmit: (data: IProfileForm) => void
}) {
  const [GPTOptions, setGPTOptions] = React.useState<string[] | null>(null)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [isAboutLoading, setIsAboutLoading] = React.useState(false)
  const [skill, setSkill] = React.useState('')

  const formik = useFormik({
    initialValues: profile ? profile : initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const profileData: IProfileForm = {
        name: values.name,
        about: values.about,
        handle: values.handle,
        skills: values.skills,
        github: values.github,
        otherLink: values.otherLink,
        portefolio: values.portefolio,
        twitter: values.twitter,
        role: values.role,
      }

      onSubmit(profileData)
      setSubmitting(false)
    },
  })

  async function improveAbout() {
    const about = formik.values.about
    setIsAboutLoading(true)
    const res = await fetcher.POST<ChatCompletionResponseMessage>(
      '/profile/new/info/improve-bio',
      { about }
    )

    if (!res.ok) {
      toast.error(res.error.message)
      setIsAboutLoading(false)
      return
    }

    const content = res.data.content
    if (content) {
      setGPTOptions(JSON.parse(content.trim()))
      setOpenDialog(true)
      setIsAboutLoading(false)
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

  function fieldError(fieldName: keyof IProfile) {
    return formik.touched[fieldName] && formik.errors[fieldName]
  }

  function SimpleLabel({
    name,
    children,
  }: {
    name: keyof IProfile
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
          <SimpleLabel name='handle'>
            <div className='flex justify-between'>
              <span>Handle</span>
              {formik.touched.handle && !formik.errors.handle && (
                <span className='text-sm text-green'>Handle available</span>
              )}
            </div>
          </SimpleLabel>
          <input
            className={clsx(inputClassNames)}
            onChange={formik.handleChange}
            value={formik.values.handle}
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
            value={formik.values.name}
            placeholder='Choose a Full Name (ex: Alan Turing)'
          />
        </fieldset>
        <fieldset id='about' className='flex flex-col'>
          <SimpleLabel name='about'>Bio</SimpleLabel>
          <div className={clsx(inputClassNames, 'flex flex-col flex-1')}>
            <textarea
              className=' h-52 bg-transparent outline-none flex-1'
              name='about'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.about}
              placeholder='Write a bio or some keywords'
            />
            <Button
              className='bg-opacity-0 scale-75'
              isDisabled={!Boolean(formik.values.about)}
              isLoading={isAboutLoading}
              onClick={improveAbout}>
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
            value={formik.values.portefolio}
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
            value={formik.values.twitter}
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
            value={formik.values.github}
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
            value={formik.values.otherLink}
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
          <div className='relative box-border mt-2'>
            <select
              name='role'
              value={formik.values.role}
              className={cn(
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
              <option value='seller'>{roleCaptions.seller}</option>
              <option value='buyer'>{roleCaptions.buyer}</option>
              <option value='both'>{roleCaptions.both}</option>
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
          className='w-full'
          isDisabled={!formik.isValid || formik.isSubmitting}
          onClick={formik.handleSubmit}>
          Next
        </Button>
      </form>

      <ChooseAboutDialog
        open={Boolean(GPTOptions) && openDialog}
        options={GPTOptions}
        onSelectAbout={about => {
          formik.setFieldValue('about', about)
        }}
        onClose={() => {
          setOpenDialog(false)
        }}
      />
    </>
  )
}
