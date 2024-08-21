import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";

type ConfirmDialogProps = {
  confirm: boolean;
  onConfirm: (confirm: boolean) => void;
  onDelete: () => void;
};

export default function ConfirmDialog({
  confirm,
  onConfirm,
  onDelete,
}: ConfirmDialogProps) {
  const handleClose = () => {
    onConfirm(false);
  };

  const handleAgree = () => {
    onConfirm(false);
    onDelete();
  };

  return (
    <Dialog
      open={confirm}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Xóa Sản Phẩm"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Bạn có muốn xóa sản phẩm này không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <ButtonCancel onClick={handleClose}>Hủy</ButtonCancel>
        <ButtonOk onClick={handleAgree} autoFocus>
          Đồng ý
        </ButtonOk>
      </DialogActions>
    </Dialog>
  );
}

const ButtonOk = styled(Button)({
  background: "#C62828",
  border: 0,
  borderRadius: 5,
  color: "white",
  height: 40,
  padding: "0 10px",
  transition: 'ease 0.8s',
  ":hover": {
    background: "#A53030",
  }
});

const ButtonCancel = styled(Button)({
  background: "#36363C",
  border: 0,
  borderRadius: 5,
  color: "white",
  height: 40,
  padding: "0 10px",
  transition: 'ease 0.8s',
  ":hover": {
    background: "#525256",
  }
});

