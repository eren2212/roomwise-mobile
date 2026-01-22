import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';

    // Kendi bilgilerini buraya gir (Supabase Dashboard -> Settings -> API)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage, // Token'ı telefonda sakla
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Mobilde URL yakalamayı manuel yapacağız
  },
});

// Uygulama kapandığında veya arka plana atıldığında Supabase'e haber ver
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});