import { useState, useEffect } from 'react'

type useImageCropProps = {
  file: File | null
}

export default function useImageCrop({ file }: useImageCropProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return

    const reader = new FileReader()
    const img = new Image()
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    reader.onload = e => {
      if (!e.target?.result) return
      img.src = e.target.result as string
    }

    img.onload = () => {
      const side = Math.min(img.width, img.height)
      canvas.width = side
      canvas.height = side
      context?.drawImage(img, 0, 0, side, side, 0, 0, side, side)

      setDataUrl(canvas.toDataURL('image/jpeg', 0.92))
    }

    reader.readAsDataURL(file)
  }, [file])

  return dataUrl
}
