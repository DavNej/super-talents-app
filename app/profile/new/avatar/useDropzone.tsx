import { useState, useCallback } from 'react'
import heic2any from 'heic2any'

type DropEvent = React.DragEvent<HTMLDivElement>

function validateFile(file: File) {
  const maxFileSize = 24 * 1024 * 1024 // 24MB
  const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']

  if (file.size > maxFileSize) {
    alert('File is too large, maximum size is 24MB.')
    return false
  }

  if (!validTypes.includes(file.type)) {
    alert(
      'Unsupported file type. Supported types are: JPEG, JPG, PNG, HEIC, HEIF.'
    )
    return false
  }

  return true
}

export default function useDropzone({
  onSuccess,
}: {
  onSuccess: (f: File) => unknown
}) {
  const [file, setFile] = useState<File | null>(null)

  const handleFile = useCallback((file: File | null) => {
    if (!file || !validateFile(file)) return

    if (!['image/heic', 'image/heif'].includes(file.type)) {
      setFile(file)
      onSuccess(file)
      return
    }

    heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.92,
    })
      .then((blob: Blob | Blob[]) => {
        const blobParts = Array.isArray(blob) ? blob : [blob]
        const newFile = new File(blobParts, file.name, { type: 'image/jpeg' })
        setFile(newFile)
        onSuccess(newFile)
      })
      .catch(e => {
        console.error(e)
        alert('Error converting HEIC/HEIF to JPEG')
      })
  }, [])

  const handleDrop = useCallback(
    (event: DropEvent) => {
      event.preventDefault()

      let files = event.dataTransfer.files
      if (!files.length) return

      handleFile(files.item(0))
    },
    [handleFile]
  )

  const handleDragOver = useCallback((event: DropEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null
      handleFile(file)
    },
    [handleFile]
  )

  return {
    file,
    handleDrop,
    handleDragOver,
    handleFileChange,
  }
}
