import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'

type DropEvent = React.DragEvent<HTMLDivElement>

export default function useDropzone() {
  const [file, setFile] = useState<File | null>(null)

  const validateFile = useCallback((file: File) => {
    const maxFileSize = 24 * 1024 * 1024 // 24MB
    const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']

    if (file.size > maxFileSize) {
      toast.error('File is too large, maximum size is 24MB.')
      return false
    }

    if (!validTypes.includes(file.type)) {
      toast.error(
        'Unsupported file type. Supported types are: JPEG, PNG, HEIC, HEIF.'
      )
      return false
    }

    return true
  }, [])

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file || !validateFile(file)) return
      setFile(file)
    },
    [validateFile]
  )

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
