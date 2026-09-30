import { toast } from "sonner";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const toastService = {
  success: (message: string) => toast.success(message),

  error: (error: unknown) => {
    toast.error(getErrorMessage(error));
  },

  info: (message: string) => toast.info(message),

  warning: (message: string) => toast.warning(message),
};
