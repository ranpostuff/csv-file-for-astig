import { LoaderCircle } from "lucide-react";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <LoaderCircle
      className={`animate-spin ${sizes[size]} ${className}`}
      aria-label="Loading"
    />
  );
}
