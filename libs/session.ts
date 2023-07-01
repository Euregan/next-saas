import { create } from "zustand";
import { persist } from "zustand/middleware";
import jwt from "jsonwebtoken";
import { JwtUser } from "./jwt";
import { api } from "./api";
import { ApiKey, Group, Log } from "@prisma/client";

type RawApiKey = Omit<ApiKey, "createdAt" | "lastUsedAt"> & {
  createdAt: string;
  lastUsedAt: string;
};

interface SessionState {
  /**
   * The currently logged in user, or `null` if there is none.
   */
  user: JwtUser | null;
  /**
   * The user's JWT. You probably never need to access it.
   */
  jwt: string | null;
  /**
   * A function to log a user in through their JWT
   *
   * @param token The JWT to use to log the user in
   */
  login: (token: string) => void;
  /**
   * A function to log a user out
   */
  logout: () => void;

  /**
   * A list of available API keys.
   */
  apiKeys: Array<ApiKey>;
  /**
   * A function to call when a user creates a new API key
   *
   * @param key
   * @returns
   */
  addApiKey: (key: ApiKey) => void;
  removeApiKey: (key: ApiKey) => void;
}

/**
 * A global hook to handle session data. You can extend
 * it with any data you need globally. Out of the box
 * it manages user session.
 */
export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      jwt: null,
      login: (token) => {
        set({ jwt: token, user: jwt.decode(token) as JwtUser });

        document.cookie = `jwt=${token};path=/`;

        api<Array<RawApiKey>, never>("/api/api-keys", "GET")
          .then((keys) =>
            set({
              apiKeys: keys.map((key) => ({
                ...key,
                createdAt: new Date(key.createdAt),
                lastUsedAt: new Date(key.lastUsedAt),
              })),
            })
          )
          .catch((error) => {
            if (error?.status === 401) {
              get().logout();
              window.history.pushState(null, "", "/signin");
            }
          });
      },
      logout: () => {
        set({ jwt: null, user: null });
        document.cookie = `jwt=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      },

      apiKeys: [],
      addApiKey: (key) =>
        set({
          apiKeys: [...get().apiKeys, key],
        }),
      removeApiKey: (key) =>
        set({
          apiKeys: get().apiKeys.filter((storeKey) => storeKey.key !== key.key),
        }),
    }),
    {
      name: "next-saas",
      partialize: (state) => ({
        jwt: state.jwt,
      }),
    }
  )
);
