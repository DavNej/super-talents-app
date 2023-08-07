import React from 'react'
import { useFormik } from 'formik'
import clsx from 'clsx'

import { initialValues, validationSchema } from './form-utils'
import Button from '@/app/components/Button'
import fetcher from '@/lib/fetcher'
import type { ChatCompletionResponseMessage } from 'openai'
import ChooseBioDialog from './components/ChooseBioDialog'
import Chip from '@/app/components/Chip'

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

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <fieldset>
          <label
            className={clsx(
              'text-sm font-light opacity-70',
              formik.errors.handle && 'text-red'
            )}
            htmlFor='handle'>
            {formik.errors.handle ? formik.errors.handle : 'Handle'}
          </label>
          <input
            className={clsx(inputClassNames)}
            onChange={formik.handleChange}
            type='text'
            name='handle'
            placeholder='Choose a profile handle (ex: alanturing)'
          />
        </fieldset>

        <fieldset>
          <label
            className={clsx(
              'text-sm font-light opacity-70',
              formik.errors.name && 'text-red'
            )}
            htmlFor='name'>
            {formik.errors.name ? formik.errors.name : 'Name'}
          </label>
          <input
            className={clsx(inputClassNames)}
            onChange={formik.handleChange}
            type='text'
            name='name'
            placeholder='Choose a Full Name (ex: Alan Turing)'
          />
        </fieldset>

        <fieldset className='flex flex-col'>
          <label
            className={clsx(
              'text-sm font-light opacity-70',
              formik.errors.bio && 'text-red'
            )}
            htmlFor='bio'>
            {formik.errors.bio ? formik.errors.bio : 'Bio'}
          </label>
          <div className={clsx(inputClassNames, 'flex flex-col')}>
            <textarea
              className=' h-52 bg-transparent outline-none flex-1'
              name='bio'
              onChange={formik.handleChange}
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

        <fieldset>
          <label
            className={clsx(
              'text-sm font-light opacity-70',
              formik.errors.skills && 'text-red'
            )}
            htmlFor='skills'>
            {formik.errors.skills ? formik.errors.skills : 'Add your skills'}
          </label>

          <input
            className={clsx(inputClassNames)}
            onChange={e => setSkill(e.currentTarget.value)}
            value={skill}
            onKeyDown={addSkill}
            type='text'
            name='skills'
            placeholder='Graphic design (then press Enter)'
          />

          <div className='flex gap-2 flex-wrap'>
            {formik.values.skills.map(skill => (
              <Chip
                key={skill}
                caption={skill}
                onDelete={() => removeSkill(skill)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <label
            className={clsx(
              'text-sm font-light opacity-70',
              formik.errors.portefolio && 'text-red'
            )}
            htmlFor='portefolio'>
            {formik.errors.portefolio ? formik.errors.portefolio : 'Link'}
          </label>
          <input
            className={clsx(inputClassNames)}
            type='text'
            onChange={formik.handleChange}
            name='portefolio'
            placeholder='Add portefolio'
          />
        </fieldset>
        <fieldset>
          {formik.errors.twitter && (
            <label
              className={clsx(
                'text-sm font-light opacity-70',
                formik.errors.twitter && 'text-red'
              )}
              htmlFor='twitter'>
              {formik.errors.twitter}
            </label>
          )}
          <input
            className={clsx(inputClassNames)}
            type='text'
            onChange={formik.handleChange}
            name='twitter'
            placeholder='Add Twitter link'
          />
        </fieldset>

        <fieldset>
          {formik.errors.github && (
            <label
              className={clsx(
                'text-sm font-light opacity-70',
                formik.errors.github && 'text-red'
              )}
              htmlFor='github'>
              {formik.errors.github}
            </label>
          )}
          <input
            className={clsx(inputClassNames)}
            type='text'
            onChange={formik.handleChange}
            name='github'
            placeholder='Add Github link'
          />
        </fieldset>

        <fieldset>
          {formik.errors.otherLink && (
            <label
              className={clsx(
                'text-sm font-light opacity-70',
                formik.errors.otherLink && 'text-red'
              )}
              htmlFor='otherLink'>
              {formik.errors.otherLink}
            </label>
          )}
          <input
            className={clsx(inputClassNames)}
            type='text'
            onChange={formik.handleChange}
            name='otherLink'
            placeholder='Add other link'
          />
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
