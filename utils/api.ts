import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { Storage } from "./storage";

// Extend InternalAxiosRequestConfig to support `skipAuth`
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token to all requests if available
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Storage.getToken();

    // Set default `skipAuth` to false if not explicitly defined
    config.skipAuth = config.skipAuth ?? false;

    // Redirect if no token (before making API calls)
    if (!token && !config.skipAuth) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    // Skip adding Authorization header if `skipAuth` is set to true
    if (token && !config.skipAuth) {
      config.headers = config.headers || {}; // Ensure headers object exists
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized access
      if (typeof window !== "undefined") {
        Storage.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

let hasShownTimeoutAlert = false;
const handleApiError = (error: any) => {
  if (error.code === "ECONNABORTED") {
    if (!hasShownTimeoutAlert) {
      alert("Request timed out. Please try again.");
      hasShownTimeoutAlert = true;

      setTimeout(() => {
        hasShownTimeoutAlert = false;
      }, 5000);
    }
  }

  if (error.response) {
    // API responded with an error status
    const data = error.response.data;
    let message = data?.message || data?.error || (typeof data === 'string' ? data : null) || error.message || "Something went wrong";

    if (typeof message === 'object') {
      try {
        message = JSON.stringify(message);
      } catch (e) {
        message = "An error occurred";
      }
    }
    throw new Error(message);
  } else {
    // Other errors
    throw new Error(error.message || "An unknown error occurred.");
  }
};

// Login
// export const login = async (email: string, password: string) => {
//   try {
//     const response = await api.post(
//       "/apv/auth/login",
//       {
//         userType: "USER",
//         authType: "EMAIL_PASSWORD",
//         email,
//         password,
//       },
//       { skipAuth: true } as CustomAxiosRequestConfig // Tell the interceptor to skip attaching the token
//     );
//     const token = response.data.sessionToken;
//     Storage.setToken(token); // Cache token

//     await getProfile();
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };

export const login = async (email: string, password: string) => {
  try{
    //1. send request
    const response = await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });

    //2. check response
    if(!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const result = await response.json();

    if(result.token){
      Storage.setToken(result.token);
    }

    return result;
  }
  catch (error){
    handleApiError(error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    const response = await api.post("/apv/auth/logout");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Forgot password - Request OTP
export const requestForgotPassword = async (email: string) => {
  try {
    const response = await api.post(
      "/apv/auth/request-reset-password",
      {
        userType: "USER",
        authType: "EMAIL_PASSWORD",
        email,
      },
      { skipAuth: true } as CustomAxiosRequestConfig
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Forgot password - Verify OTP
export const verifyForgotPasswordOtp = async (
  sessionId: string,
  secret: string
) => {
  try {
    const response = await api.post(
      "/apv/auth/verify-reset-password",
      {
        authType: "EMAIL_PASSWORD",
        sessionId,
        secret, // OTP
      },
      { skipAuth: true } as CustomAxiosRequestConfig
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Forgot password - Reset
export const resetPassword = async (
  sessionId: string,
  secret: string,
  newPassword: string
) => {
  try {
    const response = await api.post(
      "/apv/auth/reset-password",
      {
        authType: "EMAIL_PASSWORD",
        sessionId,
        secret,
        newPassword,
      },
      { skipAuth: true } as CustomAxiosRequestConfig
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Sign up - Request OTP
export const requestSignUpOtp = async (email: string) => {
  try {
    const response = await api.post(
      "/apv/registration/start",
      {
        email,
      },
      { skipAuth: true } as CustomAxiosRequestConfig
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Sign up - verify email
export const verifySignUpEmail = async (sessionToken: string, otp: string) => {
  try {
    const response = await api.post(
      "/apv/registration/verify-otp",
      {
        sessionToken,
        otp,
      },
      { skipAuth: true } as CustomAxiosRequestConfig
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Sign up - complete profile
export const completeSignUp = async (
  sessionToken: string,
  email: string,
  password: string
) => {
  try {
    const response = await api.post(
      "/apv/registration/complete",
      {
        sessionToken,
        email,
        password,
      },
      { skipAuth: true } as CustomAxiosRequestConfig
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Delete account
export const deleteAccount = async () => {
  try {
    const response = await api.post("/apv/profile/delete-account");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get profile
export const getProfile = async () => {
  try {
    const response = await api.get("/apv/profile");
    //console.log("Profile response:", response.data);
    Storage.setUsername(response.data.profile.firstName);
    Storage.setEmail(response.data.email);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
export const getTier = async () => {
  try {
    const response = await api.get("/account/check-tier-upgrade-eligibility");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const upgradeTier = async () => {
  try {
    const response = await api.post("/account/upgrade-tier");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
// Update profile
export const updateProfile = async (updatedProfile: any) => {
  try {
    const response = await api.put("/apv/profile", updatedProfile);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get country list
export const getCountryList = async () => {
  try {
    const response = await api.get("/apv/support/countries?all=true");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Change email/password - verify
export const verifySession = async (password: string) => {
  try {
    const response = await api.post("/apv/auth/verified-session/generate", {
      authType: "EMAIL_PASSWORD",
      password,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Change email - Request
export const requestChangeEmail = async (
  verifiedSessionId: string,
  verifiedSessionSecret: string,
  newEmail: string
) => {
  try {
    const response = await api.post("/apv/auth/request-update-email", {
      verifiedSessionId,
      verifiedSessionSecret,
      newEmail,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Change email
export const changeEmail = async (sessionId: string, secret: string) => {
  try {
    const response = await api.post("/apv/auth/update-email", {
      sessionId,
      secret, // OTP
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Change password
export const changePassword = async (
  verifiedSessionId: string,
  verifiedSessionSecret: string,
  newPassword: string
) => {
  try {
    const response = await api.post("/apv/auth/change-password", {
      authType: "EMAIL_PASSWORD",
      verifiedSessionId,
      verifiedSessionSecret,
      newPassword,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get wallet balance
export const getWalletBalance = async () => {
  try {
    const response = await api.get("apv/wallet?type=CREDIT");
    const walletId = response.data.id;
    Storage.setWalletId(walletId); // Cache wallet id
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get point history list
export const getPointHistoryList = async (
  page: number,
  dateRange?: [Date | null, Date | null],
  purpose?: string
) => {
  try {
    const walletId = Storage.getWalletId();
    let url = `/apv/wallet/${walletId}/transactions?page=${page}&pageSize=20`;

    // Add date filter parameters if dateRange is provided
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].toISOString();
      const endDate = dateRange[1].toISOString();
      url += `&createdDateAfter=${startDate}&createdDateBefore=${endDate}`;
    }

    // Add purpose filter if provided and not 'all'
    if (purpose && purpose !== "all") {
      url += `&purpose=${purpose}`;
    }

    const response = await api.get(url);
    if (response.data && response.data.items) {
      // Parse metadata for each item
      const parsedItems = response.data.items.map((item: any) => ({
        ...item,
        metadata: item.metadata ? JSON.parse(item.metadata) : null,
      }));
      return { ...response.data, items: parsedItems };
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Check top up eligibility
export const checkTopUpEligibility = async () => {
  try {
    const response = await api.get("/wallet/topup-eligibility");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get top up options
export const getTopUpOptions = async () => {
  try {
    const response = await api.get("/wallet/topup/options?page=1&pageSize=100");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Initiate top up
export const initiateTopUp = async (
  topUpOptionId: string,
  name: string,
  companyName: string,
  country: string,
  postalCode: string,
  address: string,
  gst: boolean
) => {
  try {
    const billingDetail: any = {
      country,
      postalCode,
      address,
      gst
    };
    if (name) {
      billingDetail.name = name;
    }
    if (companyName) {
      billingDetail.companyName = companyName;
    }
    const response = await api.post("/wallet/topup/initiate", {
      topUpOptionId,
      billingDetail,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Pre-checkout top up
export const preCheckoutTopUp = async (
  topUpOptionId: string,
  billingCountry: string,
  gst: boolean
) => {
  try {
    const response = await api.post("/wallet/topup/pre-checkout", {
      topUpOptionId,
      billingCountry,
      gst
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Checkout top up
export const checkoutTopUp = async (
  transactionId: string,
  paymentMethodId: string,
  paymentMethodType: string
) => {
  try {
    const requestData: Record<string, any> = {};
    if (paymentMethodId) {
      requestData.paymentMethodId = paymentMethodId;
    }
    if (paymentMethodType) {
      requestData.paymentType = paymentMethodType;
    }
    const response = await api.post(
      `/wallet/topups/${transactionId}/check-out`,
      requestData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Complete top up
export const completeTopUp = async (topUpId: string) => {
  try {
    const response = await api.post(`/wallet/topups/${topUpId}/complete`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get top up receipt
export const getTopUpReceipt = async (topUpId: string, password: string) => {
  try {
    const response = await api.get(
      `/wallet/topups/${topUpId}/receipt?password=${password}`,
      {
        responseType: "blob",
      }
    );
    const contentType = response.headers["content-type"];
    if (contentType && contentType.includes("pdf")) {
      return response.data;
    } else {
      throw new Error("Received content is not a PDF.");
    }
  } catch (error) {
    handleApiError(error);
  }
};

// Get top up transaction
export const getTopUpTransaction = async (topUpId: string) => {
  try {
    const response = await api.get(`/wallet/topups/${topUpId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get customer support session
export const getCustomerSupportSession = async () => {
  try {
    const response = await api.get("/apv/customer-support/sessions/current");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get customer support session messages
export const getMessagesForSession = async (
  sessionId: string,
  page: number
) => {
  try {
    const response = await api.get(
      `/apv/customer-support/sessions/${sessionId}/messages?page=${page}&pageSize=20`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Send message
export const sendMessage = async (sessionId: string, message: string) => {
  try {
    const response = await api.post(
      `/apv/customer-support/sessions/${sessionId}/messages`,
      {
        message,
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get upcoming charges
export const getUpcomingCharges = async () => {
  try {
    const response = await api.get("/bill/upcoming-charge");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get server upcoming charges
export const getServerUpcomingCharges = async (serverId: string) => {
  try {
    const response = await api.get(
      `/bill/upcoming-charge?serverId=${serverId}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get server list
export const getServerList = async (page: number) => {
  try {
    const response = await api.get(`/servers?page=${page}&pageSize=20`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get server details
export const getServerDetails = async (serverId: string) => {
  try {
    const response = await api.get(`/servers/${serverId}?t=${new Date().getTime()}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update server name

// Update server name
export const updateServerName = async (serverId: string, name: string) => {
  try {
    const response = await api.put(`/servers/${serverId}`, {
      name,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get server activities
export const getServerActivities = async (
  page: number,
  filters?: {
    search?: string;
    status?: string | null;
    type?: string | null;
    dateRange?: string | null;
  }
) => {
  try {
    let url = `/server-activities?page=${page}&pageSize=20`;

    // Add search parameter if provided
    if (filters?.search && filters.search.trim() !== "") {
      url += `&search=${encodeURIComponent(filters.search)}`;
    }

    // Add status filter if provided
    if (filters?.status) {
      url += `&status=${encodeURIComponent(filters.status)}`;
    }

    // Add type filter if provided
    if (filters?.type) {
      url += `&type=${encodeURIComponent(filters.type)}`;
    }

    // Add date filter if provided
    if (filters?.dateRange) {
      // Convert date range string to actual date parameters
      // This depends on how your date ranges are defined
      const now = new Date();
      let createdDateAfter;

      switch (filters.dateRange) {
        case "today":
          // Last 24 hours
          createdDateAfter = new Date(
            now.getTime() - 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "thisWeek":
          // Last 7 days
          createdDateAfter = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
        case "thismonth":
          // Last 30 days
          createdDateAfter = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
          ).toISOString();
          break;
      }

      if (createdDateAfter) {
        url += `&createdDateAfter=${encodeURIComponent(createdDateAfter)}`;
      }
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get server template list
// For the first phase, there is only one template available.
export const getServerTemplate = async () => {
  try {
    const response = await api.get(`/server/templates?page=1&pageSize=20`);
    return response.data.items?.length > 0 ? response.data.items[0] : null;
  } catch (error) {
    handleApiError(error);
  }
};

// Get vps region list
export const getVpsRegionList = async () => {
  try {
    const response = await api.get(`/vps/regions?page=1&pageSize=100`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get operating system list
export const getOperatingSystemList = async () => {
  try {
    const response = await api.get(
      `/server/operating-systems?page=1&pageSize=100`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Check launch server eligibility
export const checkLaunchServerEligibility = async () => {
  try {
    const response = await api.get("/server/launch-server-eligibility");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Launch server
export const launchServer = async (
  serverTemplateId: string,
  operatingSystemId: string,
  regionId: string,
  name: string
) => {
  try {
    const response = await api.post("/server/launch", {
      serverTemplateId,
      operatingSystemId,
      regionId,
      name,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Terminate server - request otp
export const requestTerminateServerOtp = async () => {
  try {
    const response = await api.post("/apv/auth/verified-session/request", {
      authType: "EMAIL_OTP",
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Terminate server - verify otp
export const verifyTerminateServerOtp = async (
  sessionId: string,
  secret: string
) => {
  try {
    const response = await api.post("/apv/auth/verified-session/generate", {
      authType: "EMAIL_OTP",
      sessionId,
      secret, // otp
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Power on / off server
export const powerOnOffServer = async (serverId: string, enable: boolean) => {
  try {
    const response = await api.post(`/servers/${serverId}/manipulate`, {
      action: enable ? "START" : "POWER_OFF",
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Reboot server
export const rebootServer = async (serverId: string) => {
  try {
    const response = await api.post(`/servers/${serverId}/manipulate`, {
      action: "REBOOT",
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Start / Shutdown server
export const startShutdownServer = async (
  serverId: string,
  enable: boolean
) => {
  try {
    const response = await api.post(`/servers/${serverId}/manipulate`, {
      action: enable ? "START" : "STOP",
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Enable / Disable rescue mode
export const enableDisableRescueMode = async (
  serverId: string,
  enable: boolean
) => {
  try {
    const response = await api.post(`/servers/${serverId}/manipulate`, {
      action: enable ? "ENABLE_RESCUE_MODE" : "DISABLE_RESCUE_MODE",
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Enable / Disable console access
export const enableDisableConsoleAccess = async (
  serverId: string,
  enable: boolean
) => {
  try {
    const response = await api.post(`/servers/${serverId}/manipulate`, {
      action: enable ? "ENABLE_CONSOLE_ACCESS" : "DISABLE_CONSOLE_ACCESS",
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Terminate server
export const terminateServer = async (
  serverId: string,
  verifiedSessionId: string,
  secret: string
) => {
  try {
    const response = await api.post(`/servers/${serverId}/manipulate`, {
      action: "TERMINATE",
      verifiedSessionId,
      secret,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get notification list
export const getTransactionList = async (page: number) => {
  try {
    const response = await api.get(`/apv/payments?page=${page}&pageSize=20`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get notification unread count
export const getNotificationUnreadCount = async () => {
  try {
    const response = await api.get("/apv/notification/count");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get notification list
export const getNotificationList = async (page: number) => {
  try {
    const response = await api.get(
      `/apv/notification/list?page=${page}&pageSize=20`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Mark all notifications read
export const markAllNotificationRead = async (ids: string[]) => {
  try {
    const response = await api.post("/apv/notification/mark-as-read", {
      notificationIds: ids,
      readAll: true,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get notification detail
export const getNotificationDetail = async (notificationId: string) => {
  try {
    const response = await api.get(`/apv/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Mark notification read
export const markNotificationRead = async (notificationId: string) => {
  try {
    const response = await api.post("/apv/notification/mark-as-read", {
      notificationIds: [notificationId],
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get notification setting
export const getNotificationSetting = async () => {
  try {
    const response = await api.get("/apv/notification/setting");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update notification setting
export const updateNotificationSetting = async (updatedMetadata: any) => {
  try {
    const response = await api.put(
      "/apv/notification/setting",
      updatedMetadata
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get payment method list
export const getPaymentMethodList = async () => {
  try {
    const response = await api.get("/apv/payment/payment-methods");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Request payment method setup
export const requestPaymentMethodSetup = async () => {
  try {
    const response = await api.post(
      "/apv/payment/payment-methods/request-setup",
      {
        // paymentMethodType,
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Mark payment method default
export const markPaymentMethodDefault = async (paymentMethodId: string) => {
  try {
    const response = await api.post(
      "/apv/payment/payment-methods/mark-as-default",
      {
        paymentMethodId,
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Remove payment method
export const removePaymentMethod = async (paymentMethodId: string) => {
  try {
    const response = await api.post("/apv/payment/payment-methods/remove", {
      paymentMethodId,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

//get server status filter list
export const getServerStatusFilterList = async () => {
  try {
    const response = await api.get(
      "server-activity/status-options?page=1&pageSize=100"
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getServerActivityList = async () => {
  try {
    const response = await api.get(
      `/server-activity/type-options?page=1&pageSize=100`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getNotices = async (
  page: number,
  filters?: {
    lang?: string;
  }
) => {
  try {
    let url = `/cms/home/messages?page=${page}&pageSize=20`;

    if (filters?.lang) {
      url += `&lang=${encodeURIComponent(filters.lang)}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
export const getServerUpgradeDetails = async (serverId: string) => {
  try {
    const response = await api.get(`/servers/${serverId}/plans?page=1&pageSize=10`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Upgrade Server
export const upgradeServer = async (serverId: string, planId: string) => {
  try {
    const response = await api.post(`/servers/${serverId}/upgrade`, {
      planId,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Check server upgrade eligibility
export const checkServerUpgradeEligibility = async (serverId: string, planId: string) => {
  try {
    const response = await api.get(`/servers/${serverId}/upgrade/${planId}/eligibility?t=${new Date().getTime()}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Check system configuration
export const checkSystemConfig = async () => {
  try {
    const response = await api.get(`/system/config`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};