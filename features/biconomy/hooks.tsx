'use client'

import React from 'react'

import { BiconomyContext } from './provider'

export default function useBiconomy() {
  const context = React.useContext(BiconomyContext)
  if (!context) {
    throw new Error('useBiconomy must be used within the BiconomyProvider')
  }
  return context
}
