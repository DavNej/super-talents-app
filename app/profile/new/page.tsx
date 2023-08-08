'use client'

import { redirect } from 'next/navigation'

export default function NewProfilePage() {
  return redirect('profile/new/avatar')
}
