import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

const Handle = z
  .string({
    required_error: 'Handle is required',
    invalid_type_error: 'Handle must be a string',
  })
  .regex(/^[a-z]+[a-z\-\_]*$/, {
    message:
      'Handle must contain only letters, - or _ and should start with a letter',
  })
  .min(5, { message: 'Handle too short' })
  .max(31, { message: 'Handle cannot exceed 31 characters' })

const HandleFormSchema = z.object({ handle: Handle, confirmed: z.boolean() })

export type HandleFormType = z.infer<typeof HandleFormSchema>

export const validationSchema = toFormikValidationSchema(HandleFormSchema)
