export interface SnackbarAlertProps {
  message: string;
  severity: "error" | "warning" | "info" | "success";
  open: boolean;
  onClose: () => void;
}

