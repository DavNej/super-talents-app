import { ApiError } from '@/lib/error-utils'

export type ImageOutput = { image: string }

export interface RunpodResponse {
  id: string
  status: string
  output?: ImageOutput[]
}

export interface RouteResponse {
  id?: string
  status?: string
  results?: string[]
  error?: ApiError
}

export const AVATAR_SERVICE_BASE_URL = process.env
  .AVATAR_SERVICE_BASE_URL as string
export const AVATAR_SERVICE_API_KEY = process.env
  .AVATAR_SERVICE_AVATAR_SERVICE_API_KEY as string

export const headers = { Authorization: `Bearer ${AVATAR_SERVICE_API_KEY}` }

export function buildPayload(image: string) {
  return {
    input: {
      prompt:
        '(RAW PHOTO), (black domino mask:2), (superhero:2), (laser eyes:5), good looking, (blue, purple, red neon background colors:0.8), (high detailed skin:1.2), (8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3)',
      nprompt:
        'face mask, covered nose, whole face mask, ugly mask, (((background colors on subject)), ((bad lighting, dim lighting)), ((nsfw)), ((covered nose)), ((face paint)), weird eyes, ugly, windows, canvas frame, cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)),((extra limbs)),((close up)),((b&w, black and white)), weird colors, blurry, (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, bad anatomy, 3d render',
      width: '512',
      height: '512',
      num_inference_steps: '30',
      low_threshold: '100',
      high_threshold: '200',
      guidance_scale: '10',
      seed: '4389562978424',
      no_of_images: 4,
      image,
    },
  }
}
