import { apiClient, nonAuthApiClient } from './apiClient';
import paths from './paths';
import { UserDetails } from '../types/user';

const GOOGLE_REDIRECT_URI = 'https://www.wavezgoa.com/auth/google/callback';
console.log("Hey Just adding random things")

interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

interface OTPData {
  otp: string;
}

interface EmailData {
  otp: string;
}

interface AgentProfileData {
  age: number;
  address: string;
  experience: number;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  imgUrl?: string[];
}

interface GoogleProfileData {
  phone: string;
  role: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await nonAuthApiClient.post(paths.login, credentials);
    return response.data;
  },

  // signup: async (userData: SignupData,referralCode?: string) => {
  //   const response = await nonAuthApiClient.post(`${paths.signup}/${userData.role}`, userData);
  //   return response.data;
  // },
  signup: async (userData: SignupData, referralCode?: string) => {
    let endpoint = `${paths.signup}/${userData.role}`;
    if (referralCode) {
      endpoint += `/${referralCode}`;
    }
    const response = await nonAuthApiClient.post(endpoint, userData);
    return response.data;
  },

  generateOTP: async (email: EmailData) => {
    const response = await nonAuthApiClient.post(paths.generateOtp, email);
    return response.data;
  },

  verifyOTP: async (otp: OTPData) => {
    const response = await nonAuthApiClient.post(paths.verifyOtp, otp);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post(paths.logout);
    return response.data;
  },

  registerAgent: async (profileData: AgentProfileData) => {
    console.log('profileData', profileData);
    const response = await apiClient.post(paths.updateProfile, profileData);
    console.log('response', response);
    return response.data;
  },

  getUserProfile: async (): Promise<UserDetails> => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get(paths.superagenProfile,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  updateUserProfile: async (userData: Partial<UserDetails>) => {
    const response = await apiClient.put(paths.updateUserProfile, userData);
    return response.data;
  },

  initiateGoogleAuth: () => {
    window.location.href = `${paths.googleAuth}?redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}`;
  },
  // Google authentication
  completeGoogleProfile: async (data: GoogleProfileData) => {
    const response = await apiClient.post('/auth/complete-profile', data);
    return response.data;
  },
  
  checkGoogleAuth: async (email: string) => {
    const response = await nonAuthApiClient.post('/auth/check-google-auth', { email });
    return response.data;
  },
};