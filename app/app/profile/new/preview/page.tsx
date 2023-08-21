'use client'

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

export default function ProfilePreviewPage() {
  const [newProfile] = useLocalStorage('newProfile', null)

  return <pre>{JSON.stringify(newProfile, null, 2)}</pre>
}
