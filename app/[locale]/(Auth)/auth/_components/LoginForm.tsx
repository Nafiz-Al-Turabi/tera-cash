 "use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Link } from "@/i18n/navigation";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("Auth.login");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = watch("email");

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center h-screen px-4 relative overflow-hidden">
      <div className="absolute right-4 top-4 z-10">
        <LocaleSwitcher />
      </div>
      <div className="w-full md:w-md">
        <div className="flex justify-center">
          <img src="/logo.svg" alt={t("logoAlt")} />
        </div>
        <p className="text-center mt-15 text-lg  lg:text-2xl manrope-font font-semibold leading-[130%] tracking-[0.12px]">
          {t("title")}
        </p>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-6 mb-3.5">
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
                  className={`mt-1 block w-full border border-[#383A3F] focus:border-[#FFB339] ${errors.email ? "border-red-500" : ""} py-4 px-6 rounded-sm outline-none text-sm`}
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                  />
                ) : null}
              </div>
              {errors.email ? (
                <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
              ) : null}
            </div>
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
                  className={`mt-1 block w-full border border-[#383A3F] focus:border-[#FFB339] ${errors.password ? "border-red-500" : ""} py-4 px-6 rounded-sm outline-none text-sm`}
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
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                >
                  {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-sm hover:text-[#FFB339] duration-300 hover:underline flex justify-end mb-8"
          >
            {t("forgotPassword")}
          </Link>
          <button className="w-full bg-[#FFB339] py-4 px-6 rounded-lg cursor-pointer text-sm lg:text-lg text-black font-bold manrope-font hover:bg-[#ffb339cc] transition-colors duration-300">
            {t("submit")}
          </button>
        </form>
      </div>
      {/* Decoration */}
      <div className="w-176.75 h-40.25 bg-[#DBA0168F] rounded-full -rotate-45 absolute -bottom-10 -right-50 blur-[223px]" />
      <div className="w-176.75 h-40.25 bg-[#DBA0168F] rounded-full -rotate-45 absolute top-0 -left-50 blur-[223px]" />
    </div>
  );
}
