"use client";

import { useEffect, useState } from "react";
import type {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
} from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
// icons moved to subcomponents
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import EmailStep from "./EmailStep";
import CodeStep from "./CodeStep";
import PasswordStep from "./PasswordStep";
import SuccessStep from "./SuccessStep";

type ForgotPasswordFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type ForgotPasswordStep = "email" | "code" | "password" | "success";

const CODE_LENGTH = 4;

export default function ForgotPassword() {
  const t = useTranslations("Auth.forgotPassword");
  const loginT = useTranslations("Auth.login");
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array.from({ length: CODE_LENGTH }, () => "")
  );
  const [codeError, setCodeError] = useState("");

  const {
    register,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const emailValue = useWatch({
    control,
    name: "email",
  });

  const focusCodeInput = (index: number) => {
    const nextInput = document.getElementById(
      `verification-code-${index}`
    ) as HTMLInputElement | null;

    nextInput?.focus();
  };

  useEffect(() => {
    if (step === "code") {
      const firstCodeInput = document.getElementById(
        "verification-code-0"
      ) as HTMLInputElement | null;

      firstCodeInput?.focus();
    }
  }, [step]);

  const titleByStep: Record<ForgotPasswordStep, string> = {
    email: t("title"),
    code: t("title"),
    password: t("passwordStepTitle"),
    success: t("successTitle"),
  };

  const descriptionByStep: Record<ForgotPasswordStep, string> = {
    email: t("description"),
    code: t("verificationDescription"),
    password: t("passwordStepDescription"),
    success: t("successDescription"),
  };

  const handleCodeChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "").slice(-1);
    const nextCode = [...verificationCode];
    nextCode[index] = value;
    setVerificationCode(nextCode);
    setCodeError("");

    if (value && index < CODE_LENGTH - 1) {
      focusCodeInput(index + 1);
    }
  };

  const handleCodeKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !verificationCode[index] && index > 0) {
      focusCodeInput(index - 1);
    }

    if (event.key === "ArrowLeft" && index > 0) {
      focusCodeInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      focusCodeInput(index + 1);
    }
  };

  const handleCodePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!pastedCode) {
      return;
    }

    const nextCode = Array.from({ length: CODE_LENGTH }, (_, index) => {
      return pastedCode[index] ?? "";
    });

    setVerificationCode(nextCode);
    setCodeError("");

    const nextFocusIndex = Math.min(pastedCode.length, CODE_LENGTH - 1);
    focusCodeInput(nextFocusIndex);
  };

  const handleResendCode = () => {
    setVerificationCode(Array.from({ length: CODE_LENGTH }, () => ""));
    setCodeError("");
    focusCodeInput(0);
  };

  const handlePrimaryAction = async () => {
    if (step === "email") {
      const isEmailValid = await trigger("email");

      if (isEmailValid) {
        setStep("code");
      }

      return;
    }

    if (step === "code") {
      const combinedCode = verificationCode.join("");

      if (combinedCode.length !== CODE_LENGTH) {
        setCodeError(t("codeRequired"));
        return;
      }

      setCodeError("");
      setStep("password");
      return;
    }

    if (step === "password") {
      const isPasswordValid = await trigger(["password", "confirmPassword"]);

      if (isPasswordValid) {
        setStep("success");
      }
    }
  };

  const renderEmailStep = () => (
    <EmailStep t={t} emailValue={emailValue} errors={errors} register={register} />
  );

  const renderCodeStep = () => (
    <CodeStep
      t={t}
      verificationCode={verificationCode}
      codeError={codeError}
      handleCodeChange={handleCodeChange}
      handleCodeKeyDown={handleCodeKeyDown}
      handleCodePaste={handleCodePaste}
      handleResendCode={handleResendCode}
    />
  );

  const renderPasswordStep = () => (
    <PasswordStep
      t={t}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      errors={errors}
      register={register}
      getValues={getValues}
    />
  );

  const renderSuccessStep = () => (
    <SuccessStep title={titleByStep.success} description={descriptionByStep.success} />
  );

  const isSuccessStep = step === "success";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute right-4 top-4 z-10">
        <LocaleSwitcher />
      </div>
      <div className="w-full md:w-md">
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt={loginT("logoAlt")}
            width={207}
            height={48}
            priority
          />
        </div>
        <div className={`${isSuccessStep ? "mt-14" : "mt-15"}`}>
          {isSuccessStep ? renderSuccessStep() : null}
          {!isSuccessStep ? (
            <>
              <p className="text-center text-lg font-semibold leading-[130%] tracking-[0.12px] manrope-font lg:text-2xl">
                {titleByStep[step]}
              </p>
              <p className="mx-auto mt-4 max-w-105 text-center text-sm leading-7 text-[#C9CDD4] sm:text-lg sm:leading-8">
                {descriptionByStep[step]}
              </p>
              <form
                className="mt-10"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handlePrimaryAction();
                }}
                noValidate
              >
                {step === "email" ? renderEmailStep() : null}
                {step === "code" ? renderCodeStep() : null}
                {step === "password" ? renderPasswordStep() : null}
                <button
                  type="submit"
                  className="mt-10 w-full rounded-lg bg-[#FFB339] px-6 py-4 text-sm font-bold text-black transition-colors duration-300 hover:bg-[#ffb339cc] manrope-font lg:text-lg"
                >
                  {step === "email" ? t("sendCode") : null}
                  {step === "code" ? t("verify") : null}
                  {step === "password" ? t("resetPassword") : null}
                </button>
              </form>
            </>
          ) : null}
        </div>
        {isSuccessStep ? (
          <div className="mt-10">
            <Link
              href="/auth/login"
              className="flex w-full items-center justify-center rounded-lg bg-[#FFB339] px-6 py-4 text-sm font-bold text-black transition-colors duration-300 hover:bg-[#ffb339cc] manrope-font lg:text-lg"
            >
              {t("continueToLogin")}
            </Link>
          </div>
        ) : (
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="flex w-full items-center justify-center rounded-lg border border-[#2F3136] px-6 py-4 text-sm font-bold text-white transition-colors duration-300 hover:border-[#FFB339] hover:text-[#FFB339] manrope-font lg:text-lg"
            >
              {t("backToLogin")}
            </Link>
          </div>
        )}
      </div>
      <div className="absolute -bottom-10 -right-50 h-40.25 w-176.75 -rotate-45 rounded-full bg-[#DBA0168F] blur-[223px]" />
      <div className="absolute -left-50 top-0 h-40.25 w-176.75 -rotate-45 rounded-full bg-[#DBA0168F] blur-[223px]" />
    </div>
  );
}
