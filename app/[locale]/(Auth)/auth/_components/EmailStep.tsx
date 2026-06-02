import { IoCheckmark } from "react-icons/io5";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

type ForgotPasswordFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  t: (k: string) => string;
  emailValue: string;
  errors: FieldErrors<ForgotPasswordFormValues>;
  register: UseFormRegister<ForgotPasswordFormValues>;
};

export default function EmailStep({ t, emailValue, errors, register }: Props) {
  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium manrope-font mb-2.5"
      >
        {t("emailLabel")} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="email"
          id="email"
          className={`mt-1 block w-full border border-[#383A3F] focus:border-[#FFB339] ${
            errors.email ? "border-red-500" : ""
          } py-4 px-6 rounded-sm outline-none text-sm`}
          placeholder={t("emailPlaceholder")}
          aria-invalid={errors.email ? "true" : "false"}
          {...register("email", {
            required: t("emailRequired"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("emailInvalid"),
            },
          })}
        />
        {emailValue && !errors.email ? (
          <IoCheckmark
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
          />
        ) : null}
      </div>
      {errors.email ? (
        <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
      ) : null}
    </div>
  );
}
