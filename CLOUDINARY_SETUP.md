# Configuração do Cloudinary para SocializeNow

## 1. Criar conta no Cloudinary

1. Acesse [cloudinary.com](https://cloudinary.com)
2. Clique em "Sign Up For Free"
3. Preencha seus dados e crie uma conta

## 2. Obter credenciais

Após fazer login, você encontrará suas credenciais no Dashboard:

1. **Cloud Name**: Nome da sua nuvem (ex: `socializenow`)
2. **API Key**: Sua chave de API
3. **API Secret**: Seu segredo de API

## 3. Configurar Upload Preset

1. No Dashboard, vá para **Settings** > **Upload**
2. Role até **Upload presets**
3. Clique em **Add upload preset**
4. Configure:
   - **Preset name**: `socializenow_preset` (ou o nome que preferir)
   - **Signing Mode**: `Unsigned` (para uploads do frontend)
   - **Folder**: `socializenow` (opcional, para organizar)
5. Clique em **Save**

## 4. Atualizar arquivo de configuração

Edite o arquivo `src/config/cloudinary.ts` e substitua os valores:

```typescript
export const cloudinaryConfig = {
  cloudName: 'SEU_CLOUD_NAME_AQUI', // Ex: 'socializenow'
  apiKey: 'SUA_API_KEY_AQUI', // Ex: '123456789012345'
  apiSecret: 'SEU_API_SECRET_AQUI', // Ex: 'abcdefghijklmnopqrstuvwxyz'
  uploadPreset: 'SEU_UPLOAD_PRESET_AQUI' // Ex: 'socializenow_preset'
}
```

## 5. Configurações recomendadas

### Transformações automáticas
No preset de upload, você pode configurar:
- **Format**: `auto` (formato automático)
- **Quality**: `auto:good` (qualidade automática)
- **Width**: `1920` (largura máxima)
- **Height**: `1080` (altura máxima)
- **Crop**: `limit` (não cortar, apenas redimensionar)

### Pastas organizadas
Configure pastas para diferentes tipos de conteúdo:
- `socializenow/avatars` - Fotos de perfil
- `socializenow/posts` - Imagens de posts
- `socializenow/stories` - Stories
- `socializenow/temp` - Uploads temporários

## 6. Testar configuração

Após configurar, teste fazendo upload de uma imagem:

```typescript
import { UploadService } from '../services/uploadService'

// Teste
const file = new File([''], 'test.jpg')
try {
  const result = await UploadService.uploadImage(file)
  console.log('Upload bem-sucedido:', result.url)
} catch (error) {
  console.error('Erro no upload:', error)
}
```

## 7. Segurança

⚠️ **IMPORTANTE**: Nunca exponha sua API Secret no frontend!
- Use apenas `cloudName` e `uploadPreset` no frontend
- Mantenha `apiKey` e `apiSecret` apenas no backend
- Configure CORS no Cloudinary se necessário

## 8. Limites gratuitos

- **Upload**: 25 GB/mês
- **Transformações**: 25.000/mês
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/mês

Para projetos maiores, considere um plano pago.

## 9. Suporte

- [Documentação oficial](https://cloudinary.com/documentation)
- [Fórum da comunidade](https://support.cloudinary.com)
- [Exemplos de código](https://cloudinary.com/documentation/examples)






