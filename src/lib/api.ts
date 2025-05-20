import type { LoginRequest, RegisterRequest } from "./types";

const BASE_URL = "https://gisapis.manpits.xyz/api";

export const loginUser = async (credentials: LoginRequest) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (userData: RegisterRequest) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const fetchAllRegion = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/mregion`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Fetch all region failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch all region error:", error);
    throw error;
  }
};

export const logout = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
