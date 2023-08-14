'use client'

import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Toast() {
  return (
    <ToastContainer
      // className='fixed'
      position='bottom-right'
      autoClose={5000}
      // hideProgressBar={false}
      newestOnTop
      closeOnClick
      // rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='dark'
    />
  )
}
