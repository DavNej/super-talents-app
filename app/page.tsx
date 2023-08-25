import { redirect } from 'next/navigation'

export default function IndexPage() {
  //TODO reddirect to profile page if has TL user
  return redirect('/login')
}
