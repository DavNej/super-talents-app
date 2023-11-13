'use client'

import React from 'react'

import { SmartAccountContext } from './provider'

export default function useSmartAccount() {
  const context = React.useContext(SmartAccountContext)
  if (!context) {
    throw new Error('useSmartAccount must be used within the SmartAccountProvider')
  }
  return context
}
