export const validateEmail = (value: string, t: (key: string) => string) =>
  /^\S+@\S+$/.test(value) ? null : t("emailInvalid");

export const validatePassword = (value: string, t: (key: string) => string) => {
  if (value.length < 8 || value.length > 12) {
    return t("passwordIncorrect");
  }
  if (
    !/[0-9]/.test(value) ||
    !/[a-z]/.test(value) ||
    !/[A-Z]/.test(value) ||
    !/[!@#$*&]/.test(value)
  ) {
    return t("passwordIncorrect");
  }
  return null;
};

export const validateConfirmPassword = (
  value: string,
  values: { password: string },
  t: (key: string) => string
) => (value !== values.password ? t("confirmPasswordInvalid") : null);

export const validateRequired = (value: string, t: (key: string) => string) =>
  value.length > 0 ? null : t("passwordInvalid");
