import type { ClipboardEvent, KeyboardEvent, ChangeEvent } from "react";

type Props = {
  t: (k: string) => string;
  verificationCode: string[];
  codeError: string;
  handleCodeChange: (index: number, event: ChangeEvent<HTMLInputElement>) => void;
  handleCodeKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  handleCodePaste: (event: ClipboardEvent<HTMLInputElement>) => void;
  handleResendCode: () => void;
};

export default function CodeStep({
  t,
  verificationCode,
  codeError,
  handleCodeChange,
  handleCodeKeyDown,
  handleCodePaste,
  handleResendCode,
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        {verificationCode.map((digit, index) => (
          <input
            key={`verification-code-${index}`}
            id={`verification-code-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(event) => handleCodeChange(index, event)}
            onKeyDown={(event) => handleCodeKeyDown(index, event)}
            onPaste={handleCodePaste}
            aria-label={`${t("codeDigitLabel")} ${index + 1}`}
            className={`h-18 w-15 sm:h-22 sm:w-20 rounded-2xl border text-center text-3xl font-semibold outline-none transition-colors duration-300 ${
              codeError
                ? "border-red-500 bg-[#2E2F33]"
                : digit
                ? "border-[#FFB339] bg-[#2E2F33]"
                : "border-[#4B4D52] bg-[#2E2F33]"
            }`}
          />
        ))}
      </div>
      <div className="mt-5 flex flex-col items-center gap-2 text-center text-sm text-[#C9CDD4] sm:flex-row sm:justify-center sm:text-left">
        <p>{t("verificationHint")}</p>
        <button
          type="button"
          onClick={handleResendCode}
          className="text-[#FFB339] underline underline-offset-4 transition-opacity duration-300 hover:opacity-80"
        >
          {t("resendCode")}
        </button>
      </div>
      {codeError ? (
        <p className="mt-3 text-center text-sm text-red-500">{codeError}</p>
      ) : null}
    </div>
  );
}
