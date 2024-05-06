import {persisted} from "svelte-persisted-store";
import type {Writable} from "svelte/store";
interface AuthStoreData {
  isAuthenticated: boolean;
  user: {
    id: number;
    username: string;
    email: string;
  } | null;
  token: string | null;
}

// manage auth state
export const authStorePersist: Writable<AuthStoreData> = persisted("strapi", {
  isAuthenticated: false,
  user: null,
  token: null,
});

// update an authentication store with new user data
export function setAuth(data: {user: AuthStoreData["user"]; jwt: string}) {
  authStorePersist.set({
    isAuthenticated: true,
    user: data.user,
    token: data.jwt,
  });
}
// mark user as not authenticated and clear the user details and token
export function clearAuth() {
  authStorePersist.set({
    isAuthenticated: false,
    user: null,
    token: null,
  });
}
