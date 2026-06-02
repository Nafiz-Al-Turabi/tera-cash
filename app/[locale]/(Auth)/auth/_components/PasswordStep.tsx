import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

type ForgotPasswordFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  t: (k: string) => string;
  showPassword: boolean;
  setShowPassword: (v: (c: boolean) => boolean | boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: (c: boolean) => boolean | boolean) => void;
  errors: FieldErrors<ForgotPasswordFormValues>;
  register: UseFormRegister<ForgotPasswordFormValues>;
  getValues: (field?: string) => any;
};

export default function PasswordStep({
  t,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  errors,
  register,
  getValues,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium manrope-font mb-2.5"
        >
          {t("passwordLabel")} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className={`mt-1 block w-full border border-[#383A3F] focus:border-[#FFB339] ${
              errors.password ? "border-red-500" : ""
            } py-4 px-6 rounded-sm outline-none text-sm`}
            placeholder={t("passwordPlaceholder")}
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password", {
              required: t("passwordRequired"),
              minLength: {
                value: 8,
                message: t("passwordMin"),
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current: boolean) => !current)}
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
          >
            {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium manrope-font mb-2.5"
        >
          {t("confirmPasswordLabel")} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            className={`mt-1 block w-full border border-[#383A3F] focus:border-[#FFB339] ${
              errors.confirmPassword ? "border-red-500" : ""
            } py-4 px-6 rounded-sm outline-none text-sm`}
            placeholder={t("confirmPasswordPlaceholder")}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            {...register("confirmPassword", {
              required: t("confirmPasswordRequired"),
              validate: (value) =>
                value === getValues("password") || t("confirmPasswordMismatch"),
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((current: boolean) => !current)}
            aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
          >
            {showConfirmPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
          </button>
        </div>
        {errors.confirmPassword ? (
          <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>
        ) : null}
      </div>
    </div>
  );
}
