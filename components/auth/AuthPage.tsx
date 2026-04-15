"use client";

import {
  Box,
  Container,
  SegmentedControl,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Flex,
  Center,
  Text,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { IconXboxXFilled, IconMail, IconKey } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import classes from "./AuthPage.module.css";

import { EmailVerificationModal } from "../modal/EmailVerificationModal";
import { CompleteProfileModal } from "../modal/CompleteProfileModal";
import { ForgetPasswordFlow } from "../ForgetPasswordFlow";
import { PasswordStrengthBar } from "../common/PasswordStrengthBar";
import { TermsCheckboxGroup } from "./TermsCheckboxGroup";
import { NoticeModal } from "../modal/NoticeModal";
import ToastMessage from "../common/ToastMessage";

import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "../../utils/validation";
import {
  login,
  requestSignUpOtp,
  verifySignUpEmail,
  completeSignUp,
} from "../../utils/api";
import { Storage } from "../../utils/storage";

export function AuthPage() {
  const t = useTranslations('auth');
  const tValidation = useTranslations("validate");
  const router = useRouter();

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [rememberedUser, setRememberedUser] = useState<string | null>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [verificationModalOpened, setVerificationModalOpened] =
    useDisclosure(false);
  const [completeProfileModalOpened, setCompleteProfileModalOpened] =
    useDisclosure(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const theme = useMantineTheme();
  const [signUpSessionToken, setSignUpSessionToken] = useState<string | null>(
    null
  );
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  const [showFailToast, setShowFailToast] = useState(false);
  const [FailToastMessage, setFailToastMessage] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>([
    false, // smtpRestriction
    //false, // countryRestriction
    false, // terms
  ]);

  // Use Mantine's form hook for validation and form state management
  const form = useForm({
    initialValues: {
      loginEmail: "",
      loginpassword: "",
      signupEmail: "",
      signupPassword: ""
    },
    validate: {
      loginEmail: (value) =>
        authMode === "login" ? validateEmail(value, tValidation) : null,
      loginpassword: (value) =>
        authMode === "login" ? validateRequired(value, tValidation) : null,
      signupEmail: (value) =>
        authMode === "signup" ? validateEmail(value, tValidation) : null,
      signupPassword: (value) =>
        authMode === "signup" ? validatePassword(value, tValidation) : null
    },
  });

  // Check cached username on component mount
  useEffect(() => {
    // Only run in browser environment
    const storedUsername = Storage.getUsername();
    const storedEmail = Storage.getEmail();
    if (storedUsername && storedEmail) {
      setRememberedUser(storedUsername);
      setShowEmailInput(!storedUsername);
      form.setFieldValue("loginEmail", storedEmail);
    }
  }, []);

  // Function to handle "Not you?" click
  const handleNotYouClick = () => {
    setShowEmailInput(true);
  };

  const handleAuthButtonClick = async () => {
    // Validate form before proceeding
    const validation = form.validate();
    if (validation.hasErrors) {
      console.log(validation.errors);
      return;
    }

    if (authMode === "signup") {
      try {
        const email = form.values.signupEmail;
        const data = await requestSignUpOtp(email);
        setSignUpSessionToken(data.sessionToken);
        setVerificationModalOpened.open();
      } catch (error: any) {
        if (error.message && error.message.toLowerCase().includes("account is inactive")) {
          setNoticeModalOpen(true);
        } else {
          showFail(error.message || t('sendOtpFailed'));
          console.log(error.message || "Send OTP failed");
        }
      }
    } else {
      // Handle login logic
      try {
        const email = form.values.loginEmail;
        const password = form.values.loginpassword;
        await login(email, password);
        router.replace("home");
      } catch (error: any) {
        showFail(error.message || t('invalidCredentials'));
        console.log(error.message || "Invalid credentials");
      }
    }
  };

  const handleVerify = async (signUpSessionToken: string, pin: string) => {
    // Clear previous error before making a new verification attempt
    setVerificationError(null);

    // API Call to verify
    try {
      const email = form.values.signupEmail;
      const password = form.values.signupPassword;

      await verifySignUpEmail(signUpSessionToken, pin);
      await completeSignUp(signUpSessionToken, email, password);
      await login(email, password);

      // Close verification modal and open profile modal
      setVerificationModalOpened.close();
      setCompleteProfileModalOpened.open();

      // Don't navigate to home yet - wait for profile completion
    } catch (error: any) {
      // Set the error message
      setVerificationError(t('invalidOtp'));
      showFail(error.message || t('verifyOtpFailed'));
      console.log(error.message || "Verify OTP failed");
    }
  };

  const handleResend = async () => {
    // API Call to resend otp
    try {
      const email = form.values.signupEmail;
      const data = await requestSignUpOtp(email);
      setSignUpSessionToken(data.sessionToken);
    } catch (error: any) {
      showFail(error.message || t('resendOtpFailed'));
      console.log(error.message || "Resend OTP failed");
    }
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const updated = [...checkboxValues];
    updated[index] = checked;
    setCheckboxValues(updated);

    const allChecked = updated.every((value) => value === true);
    setIsFormValid(allChecked);
  };

  const showFail = (message: string) => {
    setFailToastMessage(message);
    setShowFailToast(true);
  };

  return (
    <Container size="sm">
      <Box className={classes.centerContainer}>
        <Stack>
          <Center>
            <SegmentedControl
              radius="xl"
              size="md"
              data={[
                { value: "login", label: t('login') },
                { value: "signup", label: t('signUp') },
              ]}
              value={authMode}
              onChange={(value) => {
                setAuthMode(value as "login" | "signup");
                // Reset terms agreement when switching modes
                if (value === "login") form.setFieldValue("terms", false);
                // Always show email input in signup mode
                if (value === "signup") {
                  setShowEmailInput(true);
                } else {
                  // In login mode, check if we have a remembered user
                  setShowEmailInput(!rememberedUser);
                }
              }}
              mt={50}
              classNames={classes}
              className={classes.segmentedControl}
            />
          </Center>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuthButtonClick();
            }}
          >
            <Stack mt="lg" gap="md">
              {authMode === "login" && rememberedUser && !showEmailInput ? (
                <Group justify="space-between" align="flex-start">
                  <Stack align="flex-start" gap="xs">
                    <Text style={theme.other.textSmall} ta="center">
                      {t('welcome')}
                    </Text>
                    <Text style={theme.headings.sizes.h3} ta="center">
                      {rememberedUser}
                    </Text>
                  </Stack>

                  <Anchor
                    size="sm"
                    className={classes.notYouLink}
                    onClick={handleNotYouClick}
                  >
                    {t('notyou')}
                  </Anchor>
                </Group>
              ) : (
                <TextInput
                  radius="xl"
                  size="md"
                  leftSection={
                    <IconMail
                      size={20}
                      color={
                        form.errors[
                          authMode === "login" ? "loginEmail" : "signupEmail"
                        ]
                          ? "var(--mantine-color-red-9)"
                          : "var(--mantine-color-blue-9)"
                      }
                    />
                  }
                  rightSection={
                    (
                      authMode === "login"
                        ? form.values.loginEmail
                        : form.values.signupEmail
                    ) ? (
                      <IconXboxXFilled
                        size={16}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          form.setFieldValue(
                            authMode === "login" ? "loginEmail" : "signupEmail",
                            ""
                          )
                        }
                      />
                    ) : null
                  }
                  placeholder={
                    authMode === "login"
                      ? t('email')
                      : t('email')
                  }
                  classNames={{
                    input: classes.inputField,
                    error: classes.inputError,
                    wrapper: form.errors[
                      authMode === "login" ? "loginEmail" : "signupEmail"
                    ]
                      ? classes.inputErrorWrapper
                      : undefined,
                  }}
                  {...form.getInputProps(
                    authMode === "login" ? "loginEmail" : "signupEmail"
                  )}
                  required
                />
              )}

              <PasswordInput
                radius="xl"
                size="md"
                leftSection={
                  <IconKey
                    size={20}
                    color={
                      form.errors[
                        authMode === "login"
                          ? "loginpassword"
                          : "signupPassword"
                      ]
                        ? "var(--mantine-color-red-9)"
                        : "var(--mantine-color-blue-9)"
                    }
                  />
                }
                placeholder={t('password')}
                classNames={{
                  input: classes.inputField,
                  error: classes.inputError,
                  wrapper: form.errors[
                    authMode === "login" ? "loginpassword" : "signupPassword"
                  ]
                    ? classes.inputErrorWrapper
                    : undefined,
                }}
                required
                {...form.getInputProps(
                  authMode === "login" ? "loginpassword" : "signupPassword"
                )}
              />

              {/* Password strength indicator (only show in signup mode) */}
              {authMode === "signup" &&
                form.values.signupPassword.length > 0 && (
                  <PasswordStrengthBar
                    password={form.values["signupPassword"]}
                  />
                )}

              {authMode === "login" && (
                <Flex justify="flex-start">
                  <Anchor
                    mt="xl"
                    ml="sm"
                    size="sm"
                    className={classes.forgotPassword}
                    onClick={() => setForgotPasswordOpen(true)}
                  >
                    {t('forgotPass')}
                  </Anchor>
                </Flex>
              )}

              {authMode === "signup" && (
                <TermsCheckboxGroup
                  values={checkboxValues}
                  onChange={handleCheckboxChange}
                />
              )}

              <Button
                radius="xl"
                size="md"
                className={classes.authButton}
                disabled={authMode === "signup" && !isFormValid}
                type="submit"
              >
                {authMode === "login" ? t('login') : t('signUp')}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>

      <EmailVerificationModal
        opened={verificationModalOpened}
        onClose={setVerificationModalOpened.close}
        email={form.values.signupEmail}
        password={form.values.signupPassword}
        sessionToken={signUpSessionToken || undefined}
        onVerify={handleVerify}
        onResend={handleResend}
        title={t('verifyEmail')}
        description={t('placeHolderemail')}
        verificationError={verificationError}
      />

      <CompleteProfileModal
        opened={completeProfileModalOpened}
        onClose={setCompleteProfileModalOpened.close}
      />

      <ForgetPasswordFlow
        opened={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />

      <NoticeModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        title={t('accdeletedNotice')}
        content={t('delNoticeDes')?.replace(/<br\s*\/?>/gi, '\n')}
      />

      <ToastMessage
        message={FailToastMessage}
        visible={showFailToast}
        onClose={() => setShowFailToast(false)}
        isSuccess={false}
      />
    </Container>
  );
}
