# Servis Katmanı (Services Layer)

Bu klasör, API isteklerini yöneten servis dosyalarını içerir.

## Dosyalar

### `api.ts`
- Axios instance konfigürasyonu
- Request/Response interceptor'ları
- Base URL ve timeout ayarları

### `auth.service.ts`
- Kimlik doğrulama işlemleri
- Kayıt olma (register)
- Giriş yapma (login)
- Çıkış yapma (logout)
- Profil bilgisi getirme (getProfile)
- Google ile giriş (yakında)

## Kullanım

```typescript
import authService from './services/auth.service';

// Kayıt ol
const response = await authService.register({
  fullName: 'Ad Soyad',
  email: 'ogrenci@universite.edu',
  password: 'sifre123'
});

// Giriş yap
const response = await authService.login({
  email: 'ogrenci@universite.edu',
  password: 'sifre123'
});
```

## API Base URL

Development için: `http://localhost:3000`

Production için `api.ts` dosyasındaki `API_BASE_URL` değişkenini güncellemeyi unutmayın!
