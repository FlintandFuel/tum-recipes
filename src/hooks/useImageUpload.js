import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../lib/firebase'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)

  const upload = async (file, path) => {
    setUploading(true)
    try {
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      return url
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}
