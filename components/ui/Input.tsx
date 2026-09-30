import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-stone-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          w-full rounded-lg border
          bg-white
          px-3.5 py-2.5
          text-sm text-stone-900
          placeholder:text-stone-400
          outline-none
          transition
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-stone-300 focus:border-rose-700 focus:ring-2 focus:ring-rose-100"
          }
          disabled:cursor-not-allowed
          disabled:bg-stone-100
          disabled:text-stone-500
          ${className}
        `}
        {...props}
      />

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
