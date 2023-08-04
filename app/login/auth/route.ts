import { NextResponse } from 'next/server'
export async function POST(request: Request) {
  const body = await request.json()
  const loginProvider = body.loginProvider
  const email = body.email

  const loginParams =
    loginProvider === 'email_passwordless'
      ? { loginProvider, extraLoginOptions: { login_hint: email } }
      : { loginProvider }

  console.log('🦋 | POST | loginParams', loginParams)


  return NextResponse.json({ loginParams })
}
