
// Form Data
export interface RegistrationFormData {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

// Response Data (API Call)
export interface AuthResponseType {
  jwtToken: string;
  user: {
    Guid: string;
    FirstName: string;
    LastName: string;
    Email: string;
  };
  error: string;
}