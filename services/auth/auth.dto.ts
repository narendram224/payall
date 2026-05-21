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