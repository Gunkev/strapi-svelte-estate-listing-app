import axios from "axios";
import {authStorePersist, clearAuth, setAuth} from "./authStore";
import {get} from "svelte/store";

const api = axios.create({
  baseURL: "http://localhost:1337/api",
});

// Get an estate by id
export const getEstateById = async (id: string) => {
  try {
    const response = await api
      .get(`/estates/${id}?populate=*`)
      .then((res) => (res?.data ? res.data.data : []));

    return response;
  } catch (error) {
    console.error("Error fetching estate:", error);
    throw new Error("Server error");
  }
};

// delete an estate
export async function deleteEstateById(id: string) {
  try {
    const response = await api.delete(`/estates/${id}?populate=*`);
    return response.status === 200;
  } catch (error) {
    console.error("Failed to delete estate:", error);
    return false;
  }
}

// Update an estate
export function updateEstate(id: string, estateData: FormData) {
  return api.put(`/estates/${id}?populate=*`, estateData);
}

api.interceptors.request.use((config) => {
  const store = get(authStorePersist);
  if (store.isAuthenticated) {
    config.headers.Authorization = `Bearer ${store.token}`;
  }
  return config;
});

// get list of estate order by creation date and display 5 per page
export async function getPaginatedEstates(page = 1, limit = 5) {
  try {
    const response = await api.get("/estates?populate=*", {
      params: {
        pagination: {
          page: page,
          pageSize: limit,
        },
        sort: "createdAt:desc",
      },
    });
    return {
      data: response.data,
      pagination: response.data.meta.pagination,
    };
  } catch (error) {
    console.error("Error fetching paginated estates:", error);
    return {
      data: [],
      pagination: {page: 1, pageSize: limit, pageCount: 0, total: 0},
    };
  }
}

// send and set user credentials
export async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/local", {
      identifier: email,
      password,
    });
    setAuth(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response);
    throw error;
  }
}

// Clear authentication state
export async function logout() {
  clearAuth();
}

export default api;
