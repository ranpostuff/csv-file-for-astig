import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import type { LoginRequest } from "../types/loginRequest";

type LoginFormProps = {
  onSubmit: (request: LoginRequest) => void;
  isPending: boolean;
};

export function LoginForm({ onSubmit, isPending }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
      <Input
        id="email"
        label="Email"
        placeholder="Enter your email address"
        autoComplete="email"
        disabled={isPending}
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required.",
        })}
      />

      <div className="relative">
        <Input
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isPending}
          error={errors.password?.message}
          className="pr-10"
          {...register("password", {
            required: "Password is required.",
          })}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={isPending}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-[38px] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
