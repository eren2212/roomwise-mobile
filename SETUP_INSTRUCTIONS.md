# 🚀 Kurulum Talimatları

## 1️⃣ Eksik Paketleri Yükle

```bash
cd mobile
npm install expo-image-picker @react-native-community/datetimepicker
```

## 2️⃣ .env Dosyasını Güncelle

`mobile/.env` dosyasına API URL'ini ekle:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.X:3000
```

**NOT:** `192.168.1.X` kısmını kendi bilgisayarının local IP'si ile değiştir!

### Local IP Nasıl Bulunur?

**Windows:**
```bash
ipconfig
# IPv4 Address'i kopyala
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

## 3️⃣ Backend'i Çalıştır

```bash
cd api
npm start
```

## 4️⃣ Uygulamayı Çalıştır

```bash
cd mobile
npm start
```

---

## 📱 Onboarding Akışı Test

1. Kullanıcı giriş yaptıktan sonra otomatik olarak onboarding'e yönlendirilecek
2. **Step 1:** Fotoğraf + İsim Soyisim
3. **Step 2:** Doğum Tarihi + Cinsiyet
4. **Step 3:** Öğrenci/Profesyonel seçimi
5. **Preferences Step 1:** İlk 4 soru
6. **Preferences Step 2:** Son 4 soru
7. ✅ Profil tamamlandı!

---

## 🎨 Özellikler

✅ **Progress Bar** - Her adımda ilerleme gösterir  
✅ **Avatar Upload** - Supabase Storage'a yükler  
✅ **Validation** - Her adımda kontroller  
✅ **State Management** - Zustand ile tek merkezden yönetim  
✅ **Backend Entegrasyonu** - API ile senkronize  
✅ **Animasyonlar** - Smooth geçişler  
✅ **NativeWind** - Tailwind CSS ile styling  

---

## 🐛 Sorun Giderme

### Eğer "Cannot find module 'expo-image-picker'" hatası alırsan:
```bash
npm install expo-image-picker
```

### Eğer "Cannot find module '@react-native-community/datetimepicker'" hatası alırsan:
```bash
npm install @react-native-community/datetimepicker
```

### Eğer API bağlantı hatası alırsan:
- Backend'in çalıştığından emin ol (`http://localhost:3000`)
- `.env` dosyasındaki IP'nin doğru olduğundan emin ol
- Telefon ve bilgisayar aynı WiFi'ye bağlı olmalı

---

## 📂 Oluşturulan Dosyalar

### Types & Services
- `src/types/profile.types.ts`
- `src/services/profile.service.ts`
- `src/stores/profileStore.ts`

### Components
- `src/components/ProgressBar.tsx`
- `src/components/OptionButton.tsx`
- `src/components/AvatarPicker.tsx`
- `src/components/GenderButton.tsx`

### Onboarding Screens
- `src/app/(protected)/onboarding/step1.tsx`
- `src/app/(protected)/onboarding/step2.tsx`
- `src/app/(protected)/onboarding/step3.tsx`

### Preferences Screens
- `src/app/(protected)/preferences/step1.tsx`
- `src/app/(protected)/preferences/step2.tsx`

---

🎉 **HAZIR!** Artık uygulamayı test edebilirsin!
