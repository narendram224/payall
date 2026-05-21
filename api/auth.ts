import apiClient from './client';
export { userService } from './user';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  first_name?: string;
  last_name?: string;
  email: string;
  mobile?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  // Add other properties if available
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('email', credentials.email);
    if (credentials.password) {
      formData.append('password', credentials.password);
    }

    const data = await apiClient.post<any, AuthResponse>('token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Response from API", data);

    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<any> => {
    // TODO: Replace with real API call once endpoint is available
    // Expected: POST /register with FormData { first_name, last_name, email, mobile, password }
    console.log("Mock Registering user...", credentials);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status_id: 1, message: "Registration successful" });
      }, 1000);
    });
  },

  forgotPassword: async (email: string): Promise<any> => {
    // TODO: Replace with real API call once endpoint is available
    // Expected: POST /forgot-password with FormData { email }
    console.log("Mock Forgot Password for...", email);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status_id: 1, message: "Reset link sent to your email" });
      }, 1000);
    });
  },

  resetPassword: async (password: string, token: string): Promise<any> => {
    // TODO: Replace with real API call once endpoint is available
    // Expected: POST /reset-password with FormData { password, token }
    console.log("Mock Reset Password with token...", token);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status_id: 1, message: "Password reset successful" });
      }, 1000);
    });
  },

  verifyEmail: async (code: string): Promise<any> => {
    // TODO: Replace with real API call once endpoint is available
    // Expected: POST /verify-email with FormData { code }
    console.log("Mock Verify Email with code...", code);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status_id: 1, message: "Email verified successfully" });
      }, 1000);
    });
  },
};
