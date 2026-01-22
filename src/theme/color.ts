// src/constants/colors.ts

// Senin verdiğin baz renklerin en optimize halleri
const PALETTE = {
  neonGreen: "#69F0AE", // Onay, Para, Match (Dark modda parlar)
  deepBlue: "#2C0FBD",  // Ana marka rengi
  vividBlue: "#3D22D6", // Gradient için mavinin açığı
  darkNavy: "#12121E",  // Senin siyah dediğin, aslında çok koyu lacivert (Mükemmel dark bg)
  softGray: "#F3F4F6",  // Light mod background
  slateGray: "#6F7684", // Yardımcı metinler
  white: "#FFFFFF",
};

const light = {
  // --- METİN & İKON HİYERARŞİSİ (iOS Standartları) ---
  // Base renk: #12121E (Senin verdiğin koyu renk)
  primary: "#12121E",         // %100 - Başlıklar
  secondary: "#12121E99",     // %60  - Alt açıklamalar
  tertiary: "#12121E4D",      // %30  - Placeholder, disable iconlar
  quaternary: "#12121E2E",    // %18  - Çizgiler, dividerlar

  // --- ZEMİN RENKLERİ ---
  background: PALETTE.softGray, // #F3F4F6
  card: PALETTE.white,          // Kartların içi bembeyaz olsun

  // --- MARKA & AKSİYON ---
  tint: PALETTE.deepBlue,       // Butonlar, Linkler
  success: "#00C853",           // Light modda neon yeşil okunmaz, biraz koyulttum
  error: "#FF3B30",             // Standart hata kırmızısı

  // --- GRADIENTLER (Maviden Mora/Açık Maviye) ---
  linear1: PALETTE.deepBlue,    // #2C0FBD
  linear2: PALETTE.vividBlue,   // #3D22D6 (Hafif açığa doğru geçiş)
  
  // Radial genellikle highlight (parlama) efektlerinde kullanılır
  radial1: "#E0E7FF",           // Mavinini çok açığı (arkaplan baloncukları için)
  radial2: PALETTE.deepBlue,
};

const dark = {
  // --- METİN & İKON HİYERARŞİSİ ---
  // Base renk: #FFFFFF (Saf Beyaz)
  primary: "#FFFFFF",         // %100
  secondary: "#EBEBF599",     // %60 (Apple Dark Gray)
  tertiary: "#EBEBF54D",      // %30
  quaternary: "#EBEBF52E",    // %18

  // --- ZEMİN RENKLERİ ---
  background: PALETTE.darkNavy, // #12121E (Senin verdiğin renk burada ana zemin oldu)
  card: "#1E1E2C",              // Zeminden bir tık açık, kart olduğu belli olsun

  // --- MARKA & AKSİYON ---
  tint: "#5E43F3",              // Dark modda koyu mavi kaybolur, biraz açtık (Light Purple-ish Blue)
  success: PALETTE.neonGreen,   // #69F0AE (Burada neon yeşil ateş eder 🔥)
  error: "#FF453A",

  // --- GRADIENTLER ---
  linear1: "#5E43F3",           // Biraz daha parlak mavi
  linear2: PALETTE.deepBlue,    // Derin maviye doğru
  
  radial1: "#2C0FBD",           
  radial2: "#12121E",           // Siyaha sönümlenen glow efekti
};

// Uygulamanın o anki temasını buradan yönetebilirsin
// İleride burayı 'useColorScheme' hook'u ile dinamik yapacağız.
const COLORS = light;


export default COLORS;