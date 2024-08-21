import {
  Button,
  ButtonGroup,
  Container,
  Stack,
  Typography,
  IconButton,
  styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "src/components/loading/loading";
import { useProductCart } from "src/Hooks/CartProducts";
import { Product } from "src/types/Product";
import { useLoading } from "src/contexts/loading";
import { useUser } from "src/contexts/user";
import SnackbarAlert from "src/components/snackbar/Snackbar";

const GradientButton = styled(Button)(() => ({
  background: "linear-gradient(45deg, #FE6B8B 50%, white 90%)",
  backgroundSize: "200% 200%",
  border: 0,
  borderRadius: 5,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 48,
  width: 250,
  marginTop: "20px",
  padding: "0 30px",
  "&:hover": {
    background: "linear-gradient(45deg, #D25973 50% , #D25973 90%)",
  },
}));

function Detail() {
  const { addToCart } = useProductCart();
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (!id) return;
    const getProductDetail = async (id: string) => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product details", error);
        navigate("/notfound");
      } finally {
        setLoading(false);
      }
    };
    getProductDetail(id);
  }, [id, setLoading, navigate]);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (quantity <= 0) return;

    try {
      addToCart({ product, quantity });
      setSnackbar({
        open: true,
        message: "Thêm vào giỏ hàng thành công!",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to add to cart", error);
      setSnackbar({
        open: true,
        message: "Không thêm được sản phẩm vào giỏ hàng!",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Loading isShow={loading} />
      <Stack sx={{ marginLeft: "120px" }} mt={10}>
        <Container>
          {product ? (
            <Stack
              sx={{ display: "flex", gap: "100px" }}
              direction={"row"}
              gap={3}
            >
              <img src={product.image} alt={product.title} width={"350px"} />
              <Stack gap={"25px"}>
                <Typography variant="h3" component={"h1"} fontSize={"28px"}>
                  {product.title}
                </Typography>
                <Typography fontSize={"18px"}>
                  Mô tả: {product.description ?? "N/A"}
                </Typography>
                <Typography color={"red"} fontWeight={"bold"}>
                  Giá: {product.price}$
                </Typography>
                <Typography>
                  Danh mục: {product.category?.name ?? "N/A"}
                </Typography>
                <Typography>Đánh giá: 4.8/5</Typography>
                <Stack sx={{ gap: "50px" }} direction="row" alignItems="center">
                  <Typography>Số lượng:</Typography>
                  <ButtonGroup
                    sx={{
                      padding: "2px",
                      border: "1px solid",
                      gap: "15px",
                      alignItems: "center",
                      "& button": { padding: "10px" },
                    }}
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <IconButton
                      onClick={handleDecreaseQuantity}
                      disabled={quantity === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{quantity}</Typography>
                    <IconButton onClick={handleIncreaseQuantity}>
                      <AddIcon />
                    </IconButton>
                  </ButtonGroup>
                </Stack>
                <GradientButton onClick={() => handleAddToCart(product)}>
                  Thêm vào giỏ hàng
                </GradientButton>
              </Stack>
            </Stack>
          ) : (
            <Typography>Product not found</Typography>
          )}
        </Container>
      </Stack>
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}

export default Detail;
