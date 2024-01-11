'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'

import { Chip, Button, inputClassNames, Title } from '@/app/components'
import { roleCaptions, BaseProfile, type SkillsType } from '@/features/profile'

import { cn } from '@/utils'
import { useGPT } from '@/utils/gpt'

import { ChooseAboutDialog } from '../components'
import { useCache } from '../useCache'
import { validationSchema, type ProfileFormType } from './form-validation'

const initialValues: ProfileFormType = {
  name: '',
  about: '',
  skills: [],
  github: '',
  otherLink: '',
  linkedin: '',
  twitter: '',
  role: '',
}

export default function ProfileInfoPage() {
  const router = useRouter()

  const [GPTOptions, setGPTOptions] = React.useState<string[] | null>(null)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [skill, setSkill] = React.useState('')
  const { newProfile, setNewProfile } = useCache()

  const GPT = useGPT()

  React.useEffect(() => {
    const content = GPT.data?.content

    if (content) {
      let options: string[]
      const regex = /(Option \d:)/

      try {
        options = content
          .split(regex)
          .map(opt => opt.trim())
          .filter(opt => Boolean(opt) && !regex.test(opt))
      } catch (err) {
        toast.warn('Could not parse options')
        console.log(GPT.data)
        options = content.split('Option')
      }

      setGPTOptions(options)
      setOpenDialog(true)
    }
  }, [GPT.data])

  const formik = useFormik<ProfileFormType>({
    initialValues: newProfile ? newProfile : initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      const result = BaseProfile.safeParse({
        name: values.name,
        about: values.about,
        skills: values.skills,
        github: values.github,
        otherLink: values.otherLink,
        linkedin: values.linkedin,
        twitter: values.twitter,
        role: values.role,
      })

      if (result.success) {
        setNewProfile(result.data)

        //! ATTENTION
        setSubmitting(false)
        router.push('/create-profile/preview')
      } else {
        toast.error('Could not parse newProfile')
        console.error(result.error.issues)
        setSubmitting(false)
      }
    },
  })

  function addSkill(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const newSkill = event.currentTarget.value.trim()

      const newSkillSet = Array.from(
        new Set([...formik.values.skills, newSkill])
      ).filter(Boolean) as SkillsType

      formik.setFieldValue('skills', newSkillSet)
      setSkill('')
    }
  }

  function removeSkill(skill: string) {
    const newSkillSet = formik.values.skills.filter(
      s => s !== skill
    ) as SkillsType
    formik.setFieldValue('skills', newSkillSet)
  }

  function fieldError(fieldName: keyof ProfileFormType) {
    return formik.touched[fieldName] && formik.errors[fieldName]
  }

  function SimpleLabel({
    name,
    children,
  }: {
    name: keyof ProfileFormType
    children: React.ReactNode
  }) {
    return (
      <label
        className={cn(
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
      <Title>Add Profile Info</Title>

      <form
        onSubmit={formik.handleSubmit}
        className='md:grid md:grid-cols-2 md:gap-8'>
        <div>
          <fieldset id='name' className='mt-5 md:mt-0'>
            <SimpleLabel name='name'>Name</SimpleLabel>
            <input
              className={cn(inputClassNames)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type='text'
              name='name'
              value={formik.values.name}
              placeholder='Choose a Full Name (ex: Alan Turing)'
            />
          </fieldset>
          <fieldset id='about' className='flex flex-col mt-5 md:mt-0'>
            <SimpleLabel name='about'>Bio</SimpleLabel>
            <div className={cn(inputClassNames, 'flex flex-col flex-1')}>
              <textarea
                className='h-96 md:h-52 bg-transparent outline-none'
                name='about'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.about}
                placeholder='Write a bio or some keywords'
              />
              <Button
                className='bg-opacity-0 scale-75'
                isDisabled={!Boolean(formik.values.about)}
                isLoading={GPT.isLoading}
                onClick={() => {
                  const prompt = formik.values.about
                  if (prompt) GPT.mutate(prompt)
                }}>
                Improve bio with AI
              </Button>
            </div>
          </fieldset>
        </div>
        <fieldset id='links' className='mt-5 md:mt-0'>
          <SimpleLabel name='linkedin'>Links (optional)</SimpleLabel>
          <input
            className={cn(inputClassNames)}
            type='text'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name='linkedin'
            value={formik.values.linkedin}
            placeholder='Add linkedin link'
          />

          {formik.errors.twitter && (
            <SimpleLabel name='twitter'>{formik.errors.twitter}</SimpleLabel>
          )}

          <input
            className={cn(inputClassNames)}
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
            className={cn(inputClassNames)}
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
            className={cn(inputClassNames)}
            type='text'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.otherLink}
            name='otherLink'
            placeholder='Add other link'
          />
        </fieldset>
        <fieldset id='skills' className='row-span-2 mt-5 md:mt-0'>
          <SimpleLabel name='skills'>Skills</SimpleLabel>
          <input
            className={cn(inputClassNames)}
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
        <fieldset id='role' className='mt-5 md:mt-0'>
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
          className='w-full mt-8 md:mt-0'
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
