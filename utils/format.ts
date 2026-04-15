import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

const getLocale = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("locale") ?? "en";
  }
  return "en";
};

export const maskEmail = (email: string = ""): string => {
  if (!email || !email.includes("@")) return "your email";
  const [username, domain] = email.split("@");
  // Show only first character of username + asterisks
  const maskedUsername =
    username.charAt(0) + "*".repeat(Math.min(username.length - 1, 4));
  return `${maskedUsername}@${domain}`;
};

export const formatBalance = (balance: number): string => {
  return new Intl.NumberFormat("en-US").format(balance / 100); // Converts cents to whole number
};

export const formatPoint = (point: number): string => {
  return new Intl.NumberFormat("en-US", {
    useGrouping: false, // Disables thousand separator
  }).format(point / 100);
};

export const formatCurrency = (
  amount: number,
  currency: string,
  minimumFractionDigits: number
): string => {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(amount / 100); // Converts cents to decimal format
  return `${formattedAmount} ${currency}`; // Amount first, then currency code
};

export function formatDate(dateString: string) {
  const locale = getLocale();
  if (locale === "zh") {
    return dayjs(dateString).format("YYYY年MM月DD日");
  }
  return dayjs(dateString).format("DD MMM YYYY");
}

export function formatDateFullMonth(dateString: string) {
  const locale = getLocale();
  if (locale === "zh") {
    return dayjs(dateString).format("YYYY年MM月DD日");
  }
  return dayjs(dateString).format("DD MMMM YYYY");
}

export function formatDateTime(dateString: string) {
  const locale = getLocale();
  if (locale === "zh") {
    return dayjs(dateString).format("YYYY年MM月DD日，HH:mm");
  }
  return dayjs(dateString).format("DD MMM YYYY, HH:mm");
}

export function formatTime(dateString: string) {
  const locale = getLocale();
  if (locale === "zh") {
    return dayjs(dateString).format("HH:mm");
  }
  return dayjs(dateString).format("hh:mm a");
}

export function formatMonthYear(dateString: string) {
  const locale = getLocale();
  if (locale === "zh") {
    return dayjs(dateString).format("YYYY年MM月");
  }
  return dayjs(dateString).format("MMMM YYYY");
}
