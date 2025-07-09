import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Update stored value when localStorage changes (useful for cross-tab communication)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
};

// Specific hooks for commonly used localStorage items
export const useUserPreferences = () => {
  return useLocalStorage("userPreferences", {
    theme: "dark",
    language: "en",
    notifications: true,
    autoConnect: false,
  });
};

export const useWalletHistory = () => {
  return useLocalStorage("walletHistory", []);
};

export const useJobFilters = () => {
  return useLocalStorage("jobFilters", {
    category: "",
    minBudget: "",
    maxBudget: "",
    skills: [],
    sortBy: "newest",
  });
};

export const useDraftJobs = () => {
  return useLocalStorage("draftJobs", []);
};

export const useRecentSearches = () => {
  const [searches, setSearches] = useLocalStorage("recentSearches", []);

  const addSearch = (search) => {
    setSearches((prev) => {
      const filtered = prev.filter((s) => s !== search);
      return [search, ...filtered].slice(0, 10); // Keep only last 10 searches
    });
  };

  const clearSearches = () => {
    setSearches([]);
  };

  return [searches, addSearch, clearSearches];
};

export default useLocalStorage;
