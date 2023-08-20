'use client'

import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Toast() {
  return (
    <ToastContainer
      position='top-right'
      // position='bottom-right'
      // closeOnClick
      autoClose={5000}
      newestOnTop
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='dark'
    />
  )
}
