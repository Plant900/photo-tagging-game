const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

// Uploads an image with an unsigned upload preset and returns its public HTTPS URL.
export const uploadImage = async (file: File): Promise<string> => {
  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET in .env.local'
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )
  const result = await response.json()

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${result.error?.message}`)
  }
  return result.secure_url
}
