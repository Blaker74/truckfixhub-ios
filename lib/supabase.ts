import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";

// These are the same public endpoint and publishable client key already used by
// truckfixhub.com/auth.js. They are intentionally client-visible; never add a
// Supabase service-role key to this app or its separate public GitHub repository.
export const TRUCKFIXHUB_SUPABASE_URL = "https://bncqcdlzmawlmfworalq.supabase.co";
const TRUCKFIXHUB_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yz-vrCD_has1enE2Zh5qyQ_IAz7gk80";

const browserSessionCache = new Map<string, string>();
const webStorage = {
  getItem: async (key: string) => {
    if (typeof window === "undefined") return browserSessionCache.get(key) ?? null;
    try {
      const value = window.localStorage.getItem(key);
      if (value !== null) browserSessionCache.set(key, value);
      return value ?? browserSessionCache.get(key) ?? null;
    } catch {
      return browserSessionCache.get(key) ?? null;
    }
  },
  setItem: async (key: string, value: string) => {
    browserSessionCache.set(key, value);
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, value); } catch { /* retain the in-memory session fallback */ }
  },
  removeItem: async (key: string) => {
    browserSessionCache.delete(key);
    if (typeof window === "undefined") return;
    try { window.localStorage.removeItem(key); } catch { /* storage may be unavailable in embedded Preview */ }
  },
};

const authStorage = {
  getItem: (key: string) => Platform.OS === "web" ? webStorage.getItem(key) : SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => Platform.OS === "web" ? webStorage.setItem(key, value) : SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => Platform.OS === "web" ? webStorage.removeItem(key) : SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(TRUCKFIXHUB_SUPABASE_URL, TRUCKFIXHUB_SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: authStorage,
    storageKey: "tfh-auth-session",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
  },
});
