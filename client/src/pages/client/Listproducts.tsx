import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SnackbarAlert from "src/components/snackbar/Snackbar";
import { useUser } from "src/contexts/user";

import { Product } from "src/types/Product";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axiosInstance from "./axiosInstance/axiosInstance";
import { useProductCart } from "src/Hooks/CartProducts";

type ProductCardProps = {
  product: Product;
};

const ListProduct: FC<ProductCardProps> = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useProductCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [quantity] = useState<number>(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Gửi yêu cầu để lấy trạng thái yêu thích của sản phẩm khi component mount
    const checkLikedStatus = async () => {
      const token = localStorage.getItem("Token");
      if (token) {
        try {
          const response = await axiosInstance.get("/users/liked-products");
          const likedProducts = response.data.map((item: Product) => item._id);
          setLiked(likedProducts.includes(product._id));
        } catch (error) {
          console.error("Lỗi khi lấy sản phẩm đã thích:", error);
        }
      }
    };

    checkLikedStatus();
  }, [product._id]);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleLikeClick = async () => {
    try {
      if (liked) {
        // Bỏ thích sản phẩm
        await axiosInstance.post(`/users/unlike/${product._id}`);
        setSnackbar({
          open: true,
          message: "Đã bỏ thích sản phẩm",
          severity: "success",
        });
        window.location.reload();
      } else {
        // Thích sản phẩm
        await axiosInstance.post(`/users/like/${product._id}`);
        setSnackbar({
          open: true,
          message: "Đã thích sản phẩm",
          severity: "success",
        });
      }
      setLiked(!liked);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra",
        severity: "error",
      });
    }
  };

  const GradientButton = styled(Button)(() => ({
    background: "linear-gradient(45deg, #FE6B8B 50%, white 90%)",
    backgroundSize: "200% 200%",
    border: 0,
    borderRadius: 5,
    color: "white",
    height: 35,
    padding: "0 20px",
    "&:hover": {
      background: "linear-gradient(45deg, #D25973 50%, #D25973 90%)",
    },
  }));

  const GradientButtonBuy = styled(Button)(() => ({
    border: "1px solid",
    borderColor: "#FE6B8B",
    borderRadius: 5,
    color: "black",
    height: 35,
    padding: "0 20px",
    "&:hover": {
      background: "#E1E1E1",
    },
  }));

  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    event.stopPropagation(); // Prevents event bubbling to parent elements
    if (!user) {
      navigate("/login");
      return;
    }

    if (quantity <= 0) return;
    addToCart({ product, quantity });
    setSnackbar({
      open: true,
      message: "Thêm vào giỏ hàng thành công!",
      severity: "success",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Stack>
      <Card
        sx={{
          maxWidth: 345,
          height: 300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link to={``} style={{ cursor: "default" }}>
          <CardMedia
            component="div"
            sx={{
              height: 250,
              position: "relative",
              background: `url(${product.image}) center center / cover no-repeat`,
              backgroundSize: 150,
              backgroundPosition: "center",
            }}
          >
            <Box
              sx={{
                padding: 1,
                position: "absolute",
                top: 8,
                right: 8,
                cursor: "pointer",
                color: liked ? "red" : "black",
                "&:hover": {
                  opacity: 0.7,
                },
              }}
              onClick={handleLikeClick}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Box>
            <CardContent
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0, 0, 0, 0.5)",
                height: 150,
                color: "#fff",
                padding: "8px",
                transition: "opacity 0.3s ease-in-out",
                opacity: hovered ? 1 : 0,
              }}
            >
              <Typography variant="body1" component="div" gutterBottom>
                {product.title}
              </Typography>
              <Typography
                variant="body2"
                component="div"
                sx={{ color: "primary" }}
              >
                Giá: {product.price} $
              </Typography>
              <Typography variant="body2" component="div">
                Đánh giá: {product.rating?.rate ?? "N/A"}/5
              </Typography>
            </CardContent>
          </CardMedia>
        </Link>
        <CardActions>
          <Link to={`/product/${product._id}`}>
            <GradientButtonBuy>Chi tiết</GradientButtonBuy>
          </Link>
          <GradientButton onClick={(event) => handleAddToCart(event, product)}>
            Thêm giỏ hàng
          </GradientButton>
        </CardActions>
      </Card>
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Stack>
  );
};

export default ListProduct;
