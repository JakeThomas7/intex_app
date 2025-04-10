import User from "../types/User";


//const API_URL = 'https://localhost:5000';
const API_URL = 'https://api2.byjacobthomas.com'

export const register = async (email: string, password: string): Promise<void> => {
  const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
      let errorMessage = "Registration failed";

      try {
          const data = await response.json();
          console.log(data);

          if (data.errors) {
              errorMessage = Object.values(data.errors).flat().join('\n');
          }
      } catch (error) {
          console.warn("Failed to parse error response", error);
      }

      throw new Error(errorMessage);
  }
};

export const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {

    const queryParams = rememberMe
    ? 'useCookies=true'
    : 'useSessionCookies=true';

    const response = await fetch(`${API_URL}/login?${queryParams}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({email, password})
    });

    let data = null;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json') || contentType?.includes('application/problem+json')) {
        data = await response.json();
    }

    if (response.status === 401) {
        if (data && data.detail && data.detail == "LockedOut") {
            throw new Error("Too many attempts. Locked Out.")
        }
        throw new Error('Invalid email or password.');
    } else if (!response.ok) {
        throw new Error('There was an unexpected error.');
    }

}

export const logout = async (): Promise<void> => {

    try {
        const response = await fetch(`${API_URL}/Identity/logout`, {
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent
            headers: {
            'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log('logged out');
        } else {
            console.error('Logout failed:', response.status);
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}   


export const pingauth = async (
    maxRetries: number = 0, 
    retryDelay: number = 250
  ): Promise<User> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(`${API_URL}/Identity/pingauth`, {
          method: 'GET',
          credentials: 'include',
        });
  
        // Handle HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Ping authentication failed`);
        }
  
        // Validate response format
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Invalid response format');
        }
  
        const data = await response.json();
        
        // Validate response data
        if (!data.email) {
          throw new Error('Invalid user session: No email found');
        }
  
        return data;
  
      } catch (error) {
        lastError = error as Error;
        
        // Only delay if we're going to retry
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  
    throw lastError || new Error('Authentication failed after retries');
  };

  export const sendOtp = async (UserEmail: string): Promise<void> => {
    await fetch(`${API_URL}/Auth/send-otp`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ UserEmail }),
    });
  };

  export const verifyOtp = async (UserEmail: string, otp: string): Promise<void> => {
    const response = await fetch(`${API_URL}/Auth/verify-otp`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ UserEmail, otp }),
    });
  
    if (!response.ok) {
      throw new Error('Invalid or expired OTP.');
    }
  };