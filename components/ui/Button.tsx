import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`
         inline-flex items-center justify-center
          rounded-lg
          bg-rose-800
          px-4 py-2.5
          text-sm font-semibold text-white
          shadow-sm
          transition
          hover:bg-rose-900
          focus:outline-none
          focus:ring-2
          focus:ring-rose-500
          focus:ring-offset-2
          disabled:cursor-not-allowed
          disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
}
