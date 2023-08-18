export type TLoginProvider =
  | 'github'
  | 'google'
  | 'twitter'
  | 'linkedin'
  | 'email_passwordless'

export interface ILoginParams {
  loginProvider: TLoginProvider
  email?: string
}
