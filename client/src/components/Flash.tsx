import { Alert, Snackbar } from "@mui/material";

type FlashProps = {
  isShow: boolean;
};

function Flash({ isShow }: FlashProps) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={isShow}
      onClose={() => { }}
      autoHideDuration={2000}
    >
      <Alert severity="success">Xóa thành công!</Alert>
    </Snackbar>
  );
}

export default Flash;
