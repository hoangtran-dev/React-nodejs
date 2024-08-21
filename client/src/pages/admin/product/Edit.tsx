import {
  Container,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "src/components/ProductForm";
import { Product, ProductFormParams } from "src/types/Product";
import SnackbarAlert from "src/components/snackbar/Snackbar";
import Loading from "src/components/loading/loading";

function AdminProductEdit() {
  const nav = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true); // Bắt đầu loading khi fetch dữ liệu
      try {
        const { data } = await axios.get<Product>(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.log("Error fetching product", error);
        setError("Không tìm thấy sản phẩm!"); // Thiết lập thông báo lỗi
      }
      setIsLoading(false); // Dừng loading sau khi fetch dữ liệu xong
    };

    fetchProduct();
  }, [id]);

  const onSubmit = async (values: ProductFormParams) => {
    try {
      await axios.put(`/products/${id}`, values);
      setShowSuccess(true); // Hiển thị Snackbar thành công
      setTimeout(() => {
        nav("/admin/product/list");
      }, 2000);
    } catch (error) {
      setError("Có lỗi xảy ra khi cập nhật sản phẩm, vui lòng thử lại sau!"); // Thiết lập thông báo lỗi
      console.error("Error updating product:", error);
    }
  };

  return (
    <>
      <Container>
        <Stack gap={2}>
          {isLoading ? (
            <Loading isShow={isLoading} /> // Hiển thị loading khi đang fetch dữ liệu
          ) : product ? (
            <ProductForm onSubmit={onSubmit} initialValues={product as unknown as ProductFormParams} isEdit />
          ) : (
            <Typography variant="body1">Không tìm thấy sản phẩm!</Typography>
          )}
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
            message="Cập nhật sản phẩm thành công!"
            severity="success"
            open={showSuccess}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </Container>
    </>
  );
}

export default AdminProductEdit;
