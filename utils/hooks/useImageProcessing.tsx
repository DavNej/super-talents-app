'use client'

import imageCompression from 'browser-image-compression'
import { useState, useEffect, useCallback } from 'react'
import heic2any from 'heic2any'
import { toast } from 'react-toastify'
import type { DataUrlType } from '@/utils/data-url'

export default function useImageProcessing({ file }: { file: File | null }) {
  const [dataUrl, setDataUrl] = useState<DataUrlType>()

  const convertImage = useCallback((file: File) => {
    if (['image/heic', 'image/heif'].includes(file.type)) {
      return heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.92,
      })
        .then(blob => {
          const blobParts = Array.isArray(blob) ? blob : [blob]
          const newFile = new File(blobParts, file.name, {
            type: 'image/jpeg',
          })
          return newFile
        })
        .catch(error => {
          console.log(error)
          toast.error('Error converting HEIC/HEIF to JPEG')
          return file
        })
    }

    return file
  }, [])

  const compressImage = useCallback((file: File) => {
    const options = {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 512,
      useWebWorker: true,
    }

    return imageCompression(file, options)
      .then(compressedFile => compressedFile)
      .catch(error => {
        console.log(error)
        toast.error('Error compressing image')
        return file
      })
  }, [])

  const cropImage = useCallback(
    (file: File) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      const img = new Image()
      img.onload = () => {
        const side = Math.min(img.width, img.height)
        canvas.width = side
        canvas.height = side
        context?.drawImage(img, 0, 0, side, side, 0, 0, side, side)

        setDataUrl(canvas.toDataURL('image/jpeg', 0.92) as DataUrlType)
      }

      const reader = new FileReader()
      reader.onload = e => {
        if (!e.target?.result) return
        img.src = e.target.result as string
      }
      reader.readAsDataURL(file)

      return dataUrl as DataUrlType
    },
    [dataUrl]
  )

  useEffect(() => {
    if (!file) return

    async function processImage(f: File) {
      const convertedImage = await convertImage(f)
      const compressedImage = await compressImage(convertedImage)
      const resultDataUrl = cropImage(compressedImage)

      setDataUrl(resultDataUrl)
    }

    processImage(file)
  }, [compressImage, convertImage, cropImage, file])

  return dataUrl
}
