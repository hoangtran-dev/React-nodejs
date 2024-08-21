import {
  Container,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductForm from "src/components/ProductForm";
import { ProductFormParams } from "src/types/Product";
import SnackbarAlert from "src/components/snackbar/Snackbar"; // Import SnackbarAlert
import { useState } from "react";

function AdminProductAdd() {
  const nav = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: ProductFormParams) => {
    try {
      await axios.post("/products", values);
      setShowSuccess(true); // Hiển thị Snackbar thành công
      setTimeout(() => {
        nav("/admin/product/list");
      }, 2000);

    } catch (error) {
      setError("Có lỗi xảy ra khi thêm sản phẩm, vui lòng thử lại sau!"); // Thiết lập thông báo lỗi
    }
  };

  return (
    <>
      <Container>
        <Stack gap={2}>
          <ProductForm onSubmit={onSubmit} />
        </Stack>

        {error && (
          <SnackbarAlert
            message={error}
            severity="error"
            open={Boolean(error)}
            onClose={() => setError(null)}
          />
        )}

        {showSuccess && (
          <SnackbarAlert
            message="Thêm sản phẩm thành công!"
            severity="success"
            open={showSuccess}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </Container>
    </>
  );
}

export default AdminProductAdd;
