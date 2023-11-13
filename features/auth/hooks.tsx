'use client'

import React from 'react'

import { AuthContext } from './provider'

export default function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within the AuthProvider')
  }
  return context
}
