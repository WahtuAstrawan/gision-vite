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

export const getUser = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Get user failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Get user failed:", error);
    throw error;
  }
};

export const getAllRegion = async (token: string) => {
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

export const getAllRoads = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/ruasjalan`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Fetch all roads failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch all roads error:", error);
    throw error;
  }
};

export const getRoadMaterial = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/meksisting`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Fetch road material failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch road material error:", error);
    throw error;
  }
};

export const getRoadType = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/mjenisjalan`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Fetch road type failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch road type error:", error);
    throw error;
  }
};

export const getRoadCondition = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/mkondisi`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Fetch road condition failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch road condition error:", error);
    throw error;
  }
};

export const addRoad = async (roadData: AddRoadRequest, token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/ruasjalan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roadData),
    });

    if (!response.ok) {
      throw new Error("Add road failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Add road error:", error);
    throw error;
  }
};

export const updateRoadById = async (
  roadId: number,
  roadData: AddRoadRequest,
  token: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/ruasjalan/${roadId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roadData),
    });

    if (!response.ok) {
      throw new Error("Update road failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Update road error:", error);
    throw error;
  }
};

export const deleteRoadById = async (roadId: number, token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/ruasjalan/${roadId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Delete road failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Delete road error:", error);
    throw error;
  }
};
