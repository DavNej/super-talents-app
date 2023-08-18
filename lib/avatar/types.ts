export type TImageOutput = string[]

export interface IRunpodRes {
  id: string
  status: string
  output?: { image: string }[]
}
