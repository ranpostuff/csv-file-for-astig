import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { authService } from "../services/authService";
import { toastService } from "~/services/toastService";
import { useAuth } from "./useAuth";

export function useLogin() {
  const { login: signIn } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authService.login,

    onSuccess: (response) => {
      signIn(response);

      toastService.success("Welcome back!");

      navigate("/");
    },

    onError(error) {
      toastService.error(error);
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
  };
}
