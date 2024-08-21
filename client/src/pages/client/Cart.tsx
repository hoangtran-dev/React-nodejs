import {
  Button,
  Container,
  IconButton,
  Stack,
  styled,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "src/contexts/Cart";
import { useProductCart } from "src/Hooks/CartProducts";

// Define labels for cart table
const labels = ["Sản phẩm", "Giá", "Số lượng", "Tổng tiền"];

const GradientButton = styled(Button)(() => ({
  background: "linear-gradient(45deg, #FE6B8B 50%, white 90%)",
  backgroundSize: "200% 200%",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 48,
  marginTop: "20px",
  padding: "0 30px",
  transition: "background-position 1s ease",
  backgroundPosition: "0% 100%",
  "&:hover": {
    backgroundPosition: "200% 100%",
  },
}));

const Cart = () => {
  const { cart, updateCartQuantity } = useCart();
  const { getCartUser, removeToCart } = useProductCart();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productIdToRemove, setProductIdToRemove] = useState<string | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    getCartUser();
  }, [getCartUser]);

  const calculateSubtotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  const handleRemoveFromCart = async () => {
    if (productIdToRemove) {
      try {
        await removeToCart(productIdToRemove);
        await getCartUser();
        setSnackbarMessage("Sản phẩm đã được xóa khỏi giỏ hàng.");
        setSnackbarSeverity("success");
      } catch (error) {
        console.error("Failed to remove item from cart", error);
        setSnackbarMessage("Không thể xóa sản phẩm khỏi giỏ hàng.");
        setSnackbarSeverity("error");
      } finally {
        setProductIdToRemove(null);
        setConfirmOpen(false);
        setSnackbarOpen(true);
      }
    }
  };

  const handleRemoveClick = (productId: string) => {
    setProductIdToRemove(productId);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setProductIdToRemove(null);
  };

  const handleIncreaseQuantity = async (productId: string) => {
    await updateCartQuantity(productId, "increase");
    await getCartUser();
  };

  const handleDecreaseQuantity = async (
    productId: string,
    currentQuantity: number
  ) => {
    if (currentQuantity <= 1) {
      setProductIdToRemove(productId);
      setConfirmOpen(true);
    } else {
      await updateCartQuantity(productId, "decrease");
      await getCartUser();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Wrapper>
        <Stack direction="row" spacing={2} mb={3}>
          <Link to="/orders/list">
            <GradientButton
            >
              Danh sách đơn hàng
            </GradientButton>
          </Link>
        </Stack>

        <LabelWrapper
          direction={"row"}
          alignItems={"center"}
          sx={{
            justifyContent: "space-evenly",
            padding: "10px 0",
            borderBottom: "1px solid #ddd",
          }}
        >
          {labels.map((label, index) => (
            <Typography
              key={index}
              fontWeight={500}
              fontSize="16px"
              color="#333"
            >
              {label}
            </Typography>
          ))}
        </LabelWrapper>
        <Stack gap={3} mt={3}>
          {cart && cart.products && cart.products.length > 0 ? (
            cart.products.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onDecrease={() =>
                  handleDecreaseQuantity(item.product._id, item.quantity)
                }
                onIncrease={() => handleIncreaseQuantity(item.product._id)}
                onRemove={() => handleRemoveClick(item.product._id)}
                calculateSubtotal={calculateSubtotal}
              />
            ))
          ) : (
            <Typography textAlign="center" color="#666">
              Giỏ hàng trống
            </Typography>
          )}
        </Stack>
      </Wrapper>
      <Stack alignItems={"center"}>
        <Link to="/checkout">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#388E3C",
              },
            }}
          >
            Thanh toán
          </Button>
        </Link>
      </Stack>

      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle textAlign={"center"}>Xác nhận xóa sản phẩm</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmClose}
            variant="contained"
            color="primary"
          >
            Hủy
          </Button>
          <Button
            onClick={handleRemoveFromCart}
            variant="contained"
            color="error"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Define types for CartItem props
interface CartItemProps {
  item: {
    product: {
      _id: string;
      image: string;
      title: string;
      price: number;
    };
    quantity: number;
  };
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  calculateSubtotal: (price: number, quantity: number) => number;
}

// Define CartItem component
const CartItem = ({
  item,
  onDecrease,
  onIncrease,
  onRemove,
  calculateSubtotal,
}: CartItemProps) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    justifyContent={"space-between"}
    sx={{
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
    }}
  >
    <Stack direction={"row"} alignItems={"center"} gap={4}>
      <img
        src={item.product.image}
        width={"100px"}
        alt={item.product.title || "Product Image"}
      />
      <Typography
        fontWeight={500}
        fontSize="14px"
        color="#333"
        sx={{ maxWidth: "150px", textOverflow: "ellipsis", overflow: "hidden" }}
      >
        {item.product.title || "No Title"}
      </Typography>
    </Stack>

    <Typography fontWeight={500} fontSize="14px" color="#333">
      {item.product.price}$
    </Typography>
    <Stack direction="row" alignItems="center" gap={1}>
      <IconButton onClick={onDecrease}>
        <RemoveIcon />
      </IconButton>
      <Typography fontWeight={500} fontSize="14px" color="#333">
        {item.quantity}
      </Typography>
      <IconButton onClick={onIncrease}>
        <AddIcon />
      </IconButton>
    </Stack>
    <Typography fontWeight={500} fontSize="14px" color="#333">
      {calculateSubtotal(item.product.price, item.quantity)}$
    </Typography>
    <IconButton onClick={onRemove}>
      <DeleteIcon sx={{ color: "red" }} />
    </IconButton>
  </Stack>
);

export default Cart;

// Define styled components
const Wrapper = styled(Stack)({
  padding: 72,
});

const LabelWrapper = styled(Stack)({
  background: "#CECECE",
  height: 55,
});
