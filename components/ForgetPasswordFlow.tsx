import { useState } from "react";
import { useTranslations } from "next-intl";

// import { ForgetPasswordModal } from "./modal/ForgetPasswordModal/ForgetPasswordModal";
// import { ResetPasswordOTPModal } from "./modal/ResetPasswordOTPModal";
// import { SetNewPasswordModal } from "./modal/SetNewPasswordModal/SetNewPasswordModal";
import { requestForgotPassword, verifyForgotPasswordOtp, resetPassword } from "../utils/api";
import ToastMessage from "./common/ToastMessage";

interface ForgetPasswordFlowProps {
    opened: boolean;
    onClose: () => void;
}

export function ForgetPasswordFlow({ opened, onClose }: ForgetPasswordFlowProps) {
    const t = useTranslations('forgotPassword');
    const [step, setStep] = useState(1);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");

    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [toastIsSuccess, setToastIsSuccess] = useState(true);
    const showToast = (message: string, isSuccess = true) => {
        setToastMessage(message);
        setToastIsSuccess(isSuccess);
        setToastVisible(true);
    };

    const resetState = (close: boolean) => {
        setSessionId(null);
        setSecret(null);
        setEmail(null);
        setStep(1);
        if (close) {
            onClose();
        }
    };

    const handleRequestForgotPassword = async (email: string) => {
        try {
            const response = await requestForgotPassword(email);
            setEmail(email);
            setSessionId(response.sessionId);
            setStep(2); // Move to OTP modal
        } catch (error: any) {
            showToast(error.message, false);
        }
    };

    const handleUseAnotherEmail = () => {
        resetState(false);
    }

    const handleOTPVerification = async (otp: string) => {
        setVerifying(true); // Start verification
        try {
            const response = await verifyForgotPasswordOtp(sessionId ?? "", otp);
            setSessionId(response.sessionId);
            setSecret(response.secret);
            setStep(3); // Move to reset password modal
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            setVerifying(false); // Allow retry and reset otp
        }
    };

    const handleResetPassword = async (newPassword: string) => {
        try {
            await resetPassword(sessionId ?? "", secret ?? "", newPassword);
            resetState(true);
            showToast(t('changePassswordSuccess'), true)
        } catch (error) {
            console.error("Failed to reset password:", error);
        }
    };

    return (
        <>
            {/* {step === 1 && (
                <ForgetPasswordModal
                    opened={opened}
                    onClose={onClose} // Ensure state is cleared on close
                    onSubmit={handleRequestForgotPassword}
                />
            )} */}

            {/* {step === 2 && sessionId && email && (
                <ResetPasswordOTPModal
                    opened={true}
                    onClose={() => resetState(true)}
                    email={email}
                    verifying={verifying}  // Pass verifying state
                    setVerifying={setVerifying} // Pass setVerifying function
                    onVerificationSuccess={handleOTPVerification}
                    onResend={() => handleRequestForgotPassword}
                    onUseAnotherEmail={handleUseAnotherEmail}
                    error={error}
                />
            )} */}

            {/* {step === 3 && sessionId && secret && (
                <SetNewPasswordModal
                    opened={true}
                    onClose={() => resetState(true)}
                    onPasswordChanged={handleResetPassword}
                />
            )} */}

            <ToastMessage
                message={toastMessage}
                visible={toastVisible}
                onClose={() => setToastVisible(false)}
                isSuccess={toastIsSuccess}
            />
        </>
    );
}
