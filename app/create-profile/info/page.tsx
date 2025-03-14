'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useLocalStorage } from 'usehooks-ts'

import { BackLink, Chip, Button, inputClassNames } from '@/app/components'
import {
  roleCaptions,
  type ProfileWithHandleType,
  type SkillsType,
  type FormProfileType,
} from '@/features/profile'
import { ProfileWithHandle } from '@/features/profile/schemas'
import { profileIdOfHandle } from '@/features/talent-layer'
import { cn } from '@/utils'
import { useChatGPT } from '@/utils/chat-gpt'

import { ChooseAboutDialog } from '../components'

const initialValues: FormProfileType = {
  handle: '',
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
  const [newProfile, setNewProfile] =
    useLocalStorage<ProfileWithHandleType | null>('newProfile', null)

  const chatGPT = useChatGPT()
  const formik = useFormik<FormProfileType>({
    initialValues: newProfile ? newProfile : initialValues,
    validationSchema: toFormikValidationSchema(ProfileWithHandle),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const profileId = await profileIdOfHandle(values.handle)
        if (!!profileId) {
          setFieldError('handle', 'Handle is taken')
          setSubmitting(false)
          return
        }
      } catch (err) {
        toast.error('Could not parse newProfile')
        console.error(err)
        setSubmitting(false)
        return
      }

      const result = ProfileWithHandle.safeParse({
        handle: values.handle,
        name: values.name,
        about: values.about,
        skills: values.skills,
        github: values.github || undefined,
        otherLink: values.otherLink || undefined,
        linkedin: values.linkedin || undefined,
        twitter: values.twitter || undefined,
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

  React.useEffect(() => {
    if (chatGPT.data?.content) {
      let options: string[]
      const regex = /(Option \d:)/

      try {
        options = chatGPT.data.content
          .split(regex)
          .map(opt => opt.trim())
          .filter(opt => Boolean(opt) && !regex.test(opt))
      } catch (err) {
        toast.warn('Could not parse options')
        console.log(chatGPT.data)
        options = chatGPT.data.content.split('Option')
      }

      setGPTOptions(options)
      setOpenDialog(true)
    }
  }, [chatGPT.data])

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

  function fieldError(fieldName: keyof ProfileWithHandleType) {
    return formik.touched[fieldName] && formik.errors[fieldName]
  }

  function SimpleLabel({
    name,
    children,
  }: {
    name: keyof ProfileWithHandleType
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
    <main className='px-6 pb-6 md:pb-12 md:px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-cover'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <h3 className='font-semibold text-4xl md:text-5xl my-3 md:my-7 md:mb-12 whitespace-nowrap'>
          Add Profile Info
        </h3>
        <form
          onSubmit={formik.handleSubmit}
          className='md:grid md:grid-cols-2 md:gap-8'>
          <fieldset id='handle' className='mt-5 md:mt-0'>
            <SimpleLabel name='handle'>
              <div className='flex justify-between'>
                <span>Handle</span>
                {/* {formik.touched.handle && !formik.errors.handle && (
                  <span className='text-sm text-green'>Handle available</span>
                )} */}
              </div>
            </SimpleLabel>
            <input
              className={cn(inputClassNames)}
              onChange={e => {
                formik.setFieldValue('handle', e.target.value.toLowerCase())
              }}
              value={formik.values.handle}
              onBlur={formik.handleBlur}
              type='text'
              name='handle'
              placeholder='Choose a profile handle (ex: alanturing)'
            />
          </fieldset>
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
                isLoading={chatGPT.isLoading}
                onClick={() => {
                  const prompt = formik.values.about
                  if (prompt) chatGPT.mutate(prompt)
                }}>
                Improve bio with AI
              </Button>
            </div>
          </fieldset>
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
      </div>
    </main>
  )
}
