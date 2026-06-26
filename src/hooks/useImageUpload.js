import { useState } from 'react'

const MAX_SIZE = 300

function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > height) {
        if (width > MAX_SIZE) { height = Math.round(height * MAX_SIZE / width); width = MAX_SIZE }
      } else {
        if (height > MAX_SIZE) { width = Math.round(width * MAX_SIZE / height); height = MAX_SIZE }
      }
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = URL.createObjectURL(file)
  })
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)

  const upload = async (file) => {
    setUploading(true)
    try {
      return await compressImage(file)
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}
