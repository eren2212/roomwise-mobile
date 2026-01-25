export interface VerifyIdentityDto {
  selfie: File | Blob;
  idPhoto: File | Blob;
}

export interface VerifyIdentityResponse {
  success: boolean;
  message: string;
  confidence?: number;
  verificationStatus: 'verified' | 'rejected' | 'pending';
  details?: {
    faceMatches?: number;
    similarity?: number;
    timestamp: string;
  };
}

export interface IdentityStatusResponse {
  isVerified: boolean;
  verificationStatus: 'verified' | 'rejected' | 'pending';
  verifiedAt?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  error?: string;
}

// Image data type (from camera)
export interface CapturedImage {
  uri: string;
  type: 'image/jpeg' | 'image/png';
  name: string;
}

// Verification step type
export type VerificationStep = 'intro' | 'scan-id' | 'take-selfie' | 'processing' | 'result';

// Verification state
export interface VerificationState {
  currentStep: VerificationStep;
  idPhoto: CapturedImage | null;
  selfie: CapturedImage | null;
  result: VerifyIdentityResponse | null;
  isLoading: boolean;
  error: string | null;
}
