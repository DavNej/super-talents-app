export type LoginProvider =
  | 'github'
  | 'google'
  | 'twitter'
  | 'linkedin'
  | 'email_passwordless'

export interface Web3AuthLoginParams {
  loginProvider: LoginProvider
  email?: string
}
