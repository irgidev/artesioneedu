const STORAGE_PREFIX = 'artesioneedu_';

// Safe localStorage operations with error handling
export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`Error writing ${key} to localStorage:`, e);
      // If quota exceeded, try to free space
      if (e.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded');
      }
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (e) {
      console.warn(`Error removing ${key} from localStorage:`, e);
      return false;
    }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(STORAGE_PREFIX)
      );
      keys.forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (e) {
      console.warn('Error clearing ArtesionEdu data:', e);
      return false;
    }
  },
};

// Cookie helpers
export const cookies = {
  get(name) {
    try {
      const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)')
      );
      return match ? decodeURIComponent(match[2]) : null;
    } catch {
      return null;
    }
  },

  set(name, value, days = 365) {
    try {
      const expires = new Date(
        Date.now() + days * 864e5
      ).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
      return true;
    } catch {
      return false;
    }
  },
};
