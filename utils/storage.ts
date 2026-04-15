export const Storage = {
  // Locale
  getLocale: () =>
    typeof window !== "undefined" ? localStorage.getItem("locale") : null,
  setLocale: (locale: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
    }
  },
  removeLocale: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("locale");
    }
  },

  // Token handling
  getToken: () =>
    typeof window !== "undefined" ? localStorage.getItem("sessionToken") : null,
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sessionToken", token);
    }
  },
  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sessionToken");
    }
  },

  // Wallet ID
  getWalletId: () =>
    typeof window !== "undefined" ? localStorage.getItem("walletId") : null,
  setWalletId: (walletId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("walletId", walletId);
    }
  },
  removeWalletId: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("walletId");
    }
  },

  // Username
  getUsername: () =>
    typeof window !== "undefined" ? localStorage.getItem("username") : null,
  setUsername: (username: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("username", username);
    }
  },
  removeUsername: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("username");
    }
  },

  // Email
  getEmail: () =>
    typeof window !== "undefined" ? localStorage.getItem("email") : null,
  setEmail: (email: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("email", email);
    }
  },
  removeEmail: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("email");
    }
  },
  // Welcome Modal Flag
  getWelcomeShown: () =>
    typeof window !== "undefined" ? localStorage.getItem("welcomeShown") : null,
  setWelcomeShown: (value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("welcomeShown", value);
    }
  },
  // Clear all stored data (for logout)
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", "en");
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("walletId");
      //   localStorage.removeItem("username");
      //   localStorage.removeItem("email");
    }
  },
};
