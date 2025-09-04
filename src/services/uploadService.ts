import { cloudinaryUrl, cloudinaryConfig } from '../config/cloudinary'

export interface UploadResponse {
  url: string
  publicId: string
  width: number
  height: number
}

export class UploadService {
  // Upload de imagem para Cloudinary
  static async uploadImage(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', cloudinaryConfig.uploadPreset)
      formData.append('cloud_name', cloudinaryConfig.cloudName)

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload da imagem')
      }

      const data = await response.json()
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
      }
    } catch (error) {
      throw new Error('Falha no upload da imagem: ' + error)
    }
  }

  // Upload de múltiplas imagens
  static async uploadMultipleImages(files: File[]): Promise<UploadResponse[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file))
      return await Promise.all(uploadPromises)
    } catch (error) {
      throw new Error('Falha no upload de múltiplas imagens: ' + error)
    }
  }

  // Deletar imagem do Cloudinary (opcional)
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/cloudinary/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      })

      return response.ok
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      return false
    }
  }
}






