import { NextResponse } from 'next/server'
import { checkJobStatus, createJob } from '@/features/avatar'
import { base64ToImgDataUrl } from '@/utils/data-url'

export async function POST(request: Request) {
  const body = await request.json()
  //TODO typecheck body with zod

  console.log('🎨 Generating avatars')

  try {
    const job = await createJob({ image: body.image })
    if (!job.id) return null
    return NextResponse.json({ jobId: job.id })
  } catch (err) {
    return new Response(String(err), { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) return new Response('No job id provided', { status: 400 })

  try {
    const res = await checkJobStatus({ jobId })

    if (res.status !== 'COMPLETED' || !res.output) {
      return NextResponse.json(null)
    } else if (res.output.length === 4) {
      const images = res.output?.map(o => base64ToImgDataUrl(o.image))
      return NextResponse.json(images)
    }

    console.error(res.output)
    return new Response('Something went wrong with the avatar generation', {
      status: 500,
    })
  } catch (err) {
    return new Response(`💥 ${String(err)}`, { status: 500 })
  }
}
