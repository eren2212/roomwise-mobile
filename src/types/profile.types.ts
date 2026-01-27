// Profile Types - Backend API ile uyumlu

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum OccupationStatus {
  STUDENT = 'student',
  PROFESSIONAL = 'professional',
}

// Preferences Enums
export enum Smoking {
  NO_SMOKE = 'no_smoke',
  BALCONY = 'balcony',
  SMOKER = 'smoker',
}

export enum Alcohol {
  NO_ALCOHOL = 'no_alcohol',
  SOCIAL = 'social',
  FREQUENT = 'frequent',
}

export enum Pets {
  NO_PETS = 'no_pets',
  HAVE_PETS = 'have_pets',
  PET_FRIENDLY = 'pet_friendly',
  NO_TOLERANCE = 'no_tolerance',
}

export enum Sleep {
  EARLY_BIRD = 'early_bird',
  NIGHT_OWL = 'night_owl',
  FLEXIBLE = 'flexible',
}

export enum Guest {
  NO_GUESTS = 'no_guests',
  RARELY = 'rarely',
  FREQUENT = 'frequent',
}

export enum Cleanliness {
  RELAXED = 'relaxed',
  MODERATE = 'moderate',
  METICULOUS = 'meticulous',
}

export enum Communication {
  QUIET = 'quiet',
  CHATTY = 'chatty',
  BALANCED = 'balanced',
}

export enum Cooking {
  ORDERING_OUT = 'ordering_out',
  BASIC_COOK = 'basic_cook',
  MASTER_CHEF = 'master_chef',
}

// Profile Interface
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  birth_date: string | null;
  gender: Gender | null;
  occupation: string | null;
  trust_score: number | null;
  is_verified: boolean | null;
  verification_status: string | null;
  location: unknown | null;
  preferred_district_text: string | null; // ← YENİ: Seçilen ilçe adı
  created_at: string | null;
  updated_at: string | null;
  has_seen_onboarding: boolean | null;
  occupation_status: OccupationStatus | null;
  university: string | null;
  department: string | null;
}

// User Preferences Interface
export interface UserPreferences {
  user_id: string;
  smoking: Smoking | null;
  alcohol: Alcohol | null;
  pets: Pets | null;
  sleep: Sleep | null;
  guests: Guest | null;
  cleanliness: Cleanliness | null;
  communication: Communication | null;
  cooking: Cooking | null;
  updated_at: string | null;
}

// Question Catalog Interface
export interface QuestionOption {
  label: string;
  value: string;
}

export interface QuestionCatalog {
  id: number;
  category: string | null;
  question_text: string;
  icon_name: string;
  target_column: string;
  options: QuestionOption[];
}

// DTOs
export interface CreateProfileDto {
  full_name: string;
  nickname?: string;
  avatar_url?: string;
  bio?: string;
  birth_date: string;
  gender: Gender;
  occupation_status: OccupationStatus;
  university?: string;
  department?: string;
  occupation?: string;
}

export interface UpdateProfileDto {
  bio?: string;
  birth_date?: string;
  gender?: Gender;
  occupation_status?: OccupationStatus;
  university?: string;
  department?: string;
  occupation?: string;
}

export interface UpdatePreferencesDto {
  smoking?: Smoking;
  alcohol?: Alcohol;
  pets?: Pets;
  sleep?: Sleep;
  guests?: Guest;
  cleanliness?: Cleanliness;
  communication?: Communication;
  cooking?: Cooking;
}

// Profile Completion Status
export interface ProfileCompletionStatus {
  hasProfile: boolean;
  profileComplete: boolean;
  hasPreferences: boolean;
  onboardingComplete: boolean;
  nextStep: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
