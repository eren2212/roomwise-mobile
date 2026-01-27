# 🚀 Matching Modülü Kurulum Rehberi

## 1️⃣ Supabase Migration (Database)

Supabase Dashboard'a git ve SQL Editor'da şunu çalıştır:

```sql
-- Profiles tablosuna preferred_district_text kolonu ekle
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_district_text TEXT;

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_district 
ON public.profiles(preferred_district_text);
```

## 2️⃣ NPM Paketleri Kur

```bash
cd mobile

# Gesture Handler ve Reanimated (swipe için)
npx expo install react-native-gesture-handler react-native-reanimated

# Linear Gradient (kartlarda gradient için)
npx expo install expo-linear-gradient

# Axios (API çağrıları için - zaten var olabilir)
npm install axios
```

## 3️⃣ babel.config.js Güncelle

`mobile/babel.config.js` dosyasına reanimated plugin ekle:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // ← Bu satırı ekle (EN SONDA OLMALI!)
    ],
  };
};
```

## 4️⃣ Database Types Güncelle

Supabase CLI ile type'ları yeniden generate et:

```bash
cd api
npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/database.types.ts
```

Veya Supabase Dashboard'dan manuel olarak:
- Settings → API → Project URL & API Keys
- TypeScript types'ı kopyala

## 5️⃣ Profile Types Güncelle

`mobile/src/types/profile.types.ts` dosyasındaki `Profile` interface'ine ekle:

```typescript
export interface Profile {
  // ... diğer alanlar
  preferred_district_text?: string | null; // ← Bunu ekle
}
```

## 6️⃣ Profile Service Güncelle

`mobile/src/services/profile.service.ts` dosyasında location güncelleme endpoint'i ekle:

```typescript
// Location güncelle
async updateLocation(districtText: string, lat: number, lng: number, token: string) {
  return await api.patch(
    '/profile/location',
    { 
      preferred_district_text: districtText,
      latitude: lat,
      longitude: lng,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
```

## 7️⃣ Backend'de Location Endpoint Ekle (api/src/profile/)

`profile.controller.ts`:

```typescript
@Patch('location')
async updateLocation(@Req() req: RequestWithUser, @Body() data: UpdateLocationDto) {
  const userId = req.user?.id;
  if (!userId) throw new UnauthorizedException();
  
  return await this.profileService.updateLocation(
    userId,
    data.preferred_district_text,
    data.latitude,
    data.longitude
  );
}
```

## 8️⃣ App Yeniden Başlat

```bash
# Cache temizle
npx expo start --clear

# Veya direkt başlat
npx expo start
```

## ✅ Test Et

1. **Verification Status**: Profile tablosunda `verification_status = 'verified'` yap
2. **Location**: İstanbul → Kadıköy seç
3. **Swipe**: Kartları sağa/sola kaydır
4. **Match**: İki kullanıcı birbirini beğenince eşleşme oluşmalı

## 🎨 Ekstra Özelleştirmeler

### Yarıçap Değiştir
`matchingStore.ts` dosyasında:
```typescript
const matches = await matchingService.getPotentialMatches(
  selectedLocation.latitude,
  selectedLocation.longitude,
  50, // ← Buradan değiştir (km)
  token
);
```

### Uyumluluk Skoru Renkleri
`SwipeCard.tsx` dosyasında:
```typescript
<View className={`rounded-full px-4 py-2 ${
  match_score >= 80 ? 'bg-green-500' :
  match_score >= 60 ? 'bg-indigo-500' :
  'bg-orange-500'
}`}>
```

## 🐛 Sorun Giderme

### 1. "RPC function not found"
- Supabase'de `get_nearby_candidates` fonksiyonunun oluşturulduğundan emin ol

### 2. "Gesture handler not initialized"
- `babel.config.js`'de reanimated plugin'i en sona ekle
- Cache temizle: `npx expo start --clear`

### 3. "401 Unauthorized"
- Token'ın doğru gönderildiğinden emin ol
- Guard'ın controller'da aktif olduğunu kontrol et

## 📱 Ekran Görüntüleri

- **Verification Blocker**: Doğrulanmamış kullanıcılar için
- **Location Picker**: Şehir/İlçe seçimi
- **Swipe Cards**: Tinder-style kartlar
- **Match Alert**: Eşleşme bildirimi

Hepsi hazır! 🚀
