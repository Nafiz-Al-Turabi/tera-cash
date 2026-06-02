"use client";

import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface Option {
  label: string;
  value: string;
}

interface ReusableSelectProps {
  options: Option[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  classNames?: Partial<{
    container: string;
    trigger: string;
    value: string;
    icon: string;
    menu: string;
    option: string;
    optionActive: string;
  }>;
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export default function ReusableSelect({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  classNames,
}: ReusableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={joinClasses("relative w-full", classNames?.container)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={joinClasses(
          "flex w-full items-center justify-between rounded-lg border border-[#383A3F] bg-[#1B1B1B] px-3 py-2.25 text-left text-sm text-[#F3F3F3] transition-colors hover:border-[#4B4E56]",
          classNames?.trigger
        )}
      >
        <span
          className={joinClasses(
            selectedOption ? "text-[#F3F3F3]" : "text-[#8F939C]",
            classNames?.value
          )}
        >
          {selectedOption?.label || placeholder}
        </span>

        <IoIosArrowDown
          size={18}
          className={joinClasses(
            "text-[#A3A7B1] transition-transform duration-300",
            isOpen ? "rotate-180" : "",
            classNames?.icon
          )}
        />
      </button>

      <div
        className={joinClasses(
          "absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-[#383A3F] bg-[#161616] shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-in-out",
          isOpen
            ? "max-h-60 opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
          classNames?.menu
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option)}
            className={joinClasses(
              "block w-full px-3 py-2.25 text-left text-sm text-[#E5E7EB] transition-colors hover:bg-white/6",
              value === option.value && "bg-white/8",
              classNames?.option,
              value === option.value ? classNames?.optionActive : undefined
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
