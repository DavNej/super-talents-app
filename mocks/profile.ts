import { BaseProfileType, SkillsType } from '@/features/profile'
import aboutOptions from './about-options'

export const pinataCid = 'QmWMFye4DRbqDqJ1SRPHjhJPoUXLY6d53wScwiqrB2Han3'
export const handle = 'noah_the_wise'

const skills: SkillsType = [
  'HTML',
  'CSS',
  'JavaScript',
  'Python',
  'Node.js',
  'Responsive Design',
  'Security',
  'Authentication',
  'Fullstack',
  'Scalability',
]

const profile: BaseProfileType = {
  name: 'Noah The Wise',
  about: aboutOptions[0],
  skills,
  role: 'seller',
  linkedin: 'htttps://linkedin.com/noah-the-wise',
  github: 'htttps://github.com/noah-the-wise',
  twitter: 'htttps://x.com/noah_the_wise',
  otherLink: 'htttps://noah-the-wise.com/',
}

export default profile
