import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";
import { Field, Form, FormRenderProps } from "react-final-form";
import { useNavigate } from "react-router-dom";
import qrCodeImage from "src/assets/QR Code/QR_CODE.png";
import { InputText } from "src/components/elements/InputText";
import SnackbarAlert from "src/components/snackbar/Snackbar";
import { useCart } from "src/contexts/Cart";
import { useLoading } from "src/contexts/loading";
import { useUser } from "src/contexts/user";
import { useProductCart } from "src/Hooks/CartProducts";

type CheckoutFormParams = {
  name: string;
  phone: string;
  address: string;
  payment: string;
};

const required = (value: any) => (value ? undefined : "Không được để trống!");

const Checkout = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { cart, setCart } = useCart();
  const { user } = useUser();
  const { clearCart } = useProductCart();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(
    undefined
  ); // Khởi tạo với undefined

  const totalPrice = useMemo(
    () =>
      cart
        ? cart.products.reduce((total, { product, quantity }) => {
            const price = product?.price || 0;
            return total + price * quantity;
          }, 0)
        : 0,
    [cart]
  );

  const onSubmit = async (values: CheckoutFormParams) => {
    if (!user || !cart || !cart.products.length) return;
    try {
      setLoading(true);
      await axios.post("/orders", {
        ...values,
        products: cart.products,
        user: user._id,
        totalPrice,
      });
      setSnackbarSeverity("success");
      setSnackbarMessage("Đặt hàng thành công!");
      setOpenSnackbar(true);

      // Clear cart after order is successfully placed
      await clearCart();
      setCart({ _id: "", user: user._id, products: [] });

      setTimeout(() => {
        navigate("/orders/list");
      }, 2000);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mb: 5, mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: "#f5f5f5" }}>
          <Typography variant="h3" color="green" textAlign="center" mb={3}>
            Thanh toán
          </Typography>
          <Divider sx={{ mb: 2, borderColor: "#e0e0e0" }} />
          <Stack spacing={2} mb={3}>
            {cart?.products.map(({ product, quantity }, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  padding: 2,
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#fff",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {product?.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      width="80"
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  ) : (
                    <Typography color="textSecondary">No image</Typography>
                  )}
                  <Stack spacing={1}>
                    <Typography fontWeight={500} variant="body1">
                      {product?.title || "No title"}
                    </Typography>
                    <Typography fontWeight={500} variant="body2">
                      {product?.price || 0}$
                    </Typography>
                  </Stack>
                </Stack>
                <Typography fontWeight={500} variant="body1">
                  Số lượng: {quantity}
                </Typography>
                <Typography fontWeight={500} variant="body1">
                  Tổng: {(product?.price * quantity).toLocaleString()}$
                </Typography>
              </Stack>
            ))}
            <Box sx={{ borderTop: "2px solid #ddd", pt: 2, mt: 2 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                color="textPrimary"
                textAlign="right"
              >
                Tổng tiền: {totalPrice.toLocaleString()}$
              </Typography>
            </Box>
          </Stack>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit }: FormRenderProps<CheckoutFormParams>) => (
              <Stack
                gap={3}
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 4 }}
              >
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  THÔNG TIN NHẬN HÀNG
                </Typography>
                <Field name="name" validate={required}>
                  {({ input, meta }) => (
                    <InputText
                      input={input}
                      label="Tên"
                      messageError={meta.touched && meta.error}
                    />
                  )}
                </Field>
                <Field name="phone" validate={required}>
                  {({ input, meta }) => (
                    <InputText
                      input={input}
                      label="Số điện thoại"
                      messageError={meta.touched && meta.error}
                    />
                  )}
                </Field>
                <Field name="address" validate={required}>
                  {({ input, meta }) => (
                    <InputText
                      input={input}
                      label="Địa chỉ"
                      messageError={meta.touched && meta.error}
                    />
                  )}
                </Field>
                <FormControl>
                  <Typography variant="h5" mb={3} mt={3}>
                    Phương thức thanh toán
                  </Typography>
                  <Field<string> name="payment" type="radio">
                    {({ input }) => (
                      <RadioGroup
                        {...input}
                        row
                        onChange={(e) => {
                          setPaymentMethod(e.target.value); // Cập nhật state khi thay đổi phương thức thanh toán
                          input.onChange(e); // Đảm bảo giá trị cũng được cập nhật trong form
                        }}
                      >
                        <FormControlLabel
                          value="Thanh toán khi nhận hàng"
                          control={<Radio />}
                          label="Thanh toán khi nhận hàng"
                        />
                        <FormControlLabel
                          value="Chuyển khoản ngân hàng"
                          control={<Radio />}
                          label="Chuyển khoản ngân hàng"
                        />
                      </RadioGroup>
                    )}
                  </Field>
                </FormControl>
                {paymentMethod === "Chuyển khoản ngân hàng" && (
                  <Box textAlign="center" mt={2}>
                    <Typography variant="h6" mb={2}>
                      QR Code để thanh toán
                    </Typography>
                    <img
                      src={qrCodeImage}
                      alt="QR Code"
                      width="256"
                      style={{ border: "1px solid #ddd", borderRadius: "8px" }}
                    />
                  </Box>
                )}
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{
                      mt: 2,
                      background: "linear-gradient(45deg, #FF6F61, #FF3F2A)",
                      color: "#fff",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      fontSize: "16px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      transition: "background 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        background: "linear-gradient(45deg, #FF3F2A, #FF6F61)",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    Đặt hàng
                  </Button>
                </Box>
              </Stack>
            )}
          />
        </Paper>
      </Container>
      <SnackbarAlert
        message={snackbarMessage}
        severity={snackbarSeverity}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
      />
    </>
  );
};

export default Checkout;
