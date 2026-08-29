/**
 * Authentication Utility Module with .env JWT Token Support
 * 
 * You can place your JWT token in Frontend/.env file:
 * VITE_JWT_TOKEN=your_jwt_token_here
 */

const TOKEN_KEY = "soledeal_jwt_token";
const USER_KEY = "soledeal_user";

// API Base URL from .env (defaults to http://localhost:5000/api)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// =========================================================================
// JWT TOKEN HELPER FUNCTIONS
// =========================================================================

/**
 * Retrieve stored JWT token:
 * 1. Checks localStorage session
 * 2. Fallbacks to VITE_JWT_TOKEN from Frontend/.env if set
 */
export function getAuthToken() {
  // Check localStorage first
  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) return localToken;

  // Fallback to JWT Token defined in .env file (if configured by developer)
  const envToken = import.meta.env.VITE_JWT_TOKEN;
  if (envToken && envToken !== "your_jwt_token_here") {
    return envToken;
  }

  return null;
}

/**
 * Save JWT token into localStorage
 * @param {string} token - The JWT token string received from backend
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Remove JWT token upon logout
 */
export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Generate Authorization Header object for fetch/axios requests
 * Example usage: fetch(`${API_BASE_URL}/user`, { headers: getAuthHeaders() })
 */
export function getAuthHeaders() {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// =========================================================================
// AUTHENTICATION STATE & ACTIONS
// =========================================================================

/**
 * Get current logged in user from local session
 */
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    console.error("Error reading user session:", err);
    return null;
  }
}

/**
 * Login user (with API_BASE_URL & .env JWT Token fallback)
 * @param {Object} credentials - { email, password }
 */
export async function loginUser({ email, password }) {
  // =======================================================================
  // REAL BACKEND JWT LOGIN INTEGRATION:
  // UNCOMMENT THIS BLOCK WHEN YOUR BACKEND AUTH API IS READY:
  /*
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Authentication failed");
  }

  // Save JWT Token received from API response
  setAuthToken(data.token);

  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
  */
  // =======================================================================

  // Mock Login with .env Token fallback:
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        reject(new Error("Email and password are required"));
        return;
      }
      if (password.length < 4) {
        reject(new Error("Password must be at least 4 characters"));
        return;
      }

      const mockUser = {
        id: "usr_" + Date.now(),
        name: email.split("@")[0] || "Sneakerhead",
        email: email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      };

      // Use .env token if defined, otherwise generate a mock session token
      const envJwtToken = import.meta.env.VITE_JWT_TOKEN;
      const activeJwtToken = (envJwtToken && envJwtToken !== "your_jwt_token_here")
        ? envJwtToken
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder_token";

      setAuthToken(activeJwtToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      resolve(mockUser);
    }, 500);
  });
}

/**
 * Register new user
 */
export async function registerUser({ name, email, password }) {
  // Real API call setup:
  /*
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");

  setAuthToken(data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
  */

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!name || !email || !password) {
        reject(new Error("All fields are required"));
        return;
      }

      const mockUser = {
        id: "usr_" + Date.now(),
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      };

      const envJwtToken = import.meta.env.VITE_JWT_TOKEN;
      const activeJwtToken = (envJwtToken && envJwtToken !== "your_jwt_token_here")
        ? envJwtToken
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder_token";

      setAuthToken(activeJwtToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      resolve(mockUser);
    }, 500);
  });
}

/**
 * Logout current user
 */
export function logoutUser() {
  removeAuthToken();
  localStorage.removeItem(USER_KEY);
}
