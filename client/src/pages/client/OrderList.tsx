import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import SnackbarAlert from "src/components/snackbar/Snackbar";
import { Order } from "src/types/order";
import { Product } from "src/types/Product";

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get<Order[]>("/orders");
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<Product[]>("/products"); // Replace with your products endpoint
        const productMap = new Map(
          data.map((product) => [product._id, product])
        );
        setProducts(productMap);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchOrders();
    fetchProducts();
  }, []);

  const handleClickOpen = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async () => {
    try {
      await axios.delete(`/orders/${selectedOrder?._id}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== selectedOrder?._id)
      );
      setConfirmOpen(false);
      handleClose();
      setSnackbarMessage("Đơn hàng đã được hủy thành công.");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Failed to cancel order", error);
      setSnackbarMessage("Hủy đơn hàng không thành công. Vui lòng thử lại.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCancelClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h3" textAlign="center" mt={10} mb={5} gutterBottom>
        Danh sách đơn hàng
      </Typography>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order._id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 4,
                border: "none",
                boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold" mb={1}>
                  Đơn hàng #{order._id}
                </Typography>
                <Typography variant="body1">
                  Tổng tiền: {order.totalPrice.toLocaleString()}$
                </Typography>
                <Typography variant="body2">
                  Số lượng sản phẩm: {order.products.length}
                </Typography>
                <Typography variant="body2">
                  Phương thức thanh toán: {order.payment}
                </Typography>
                <Typography color="textSecondary" mt={2}>
                  Trạng thái: Đơn hàng đang được xử lý
                </Typography>
                <Button
                  sx={{
                    mt: 2,
                    borderRadius: 4,
                    bgcolor: "warning.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "warning.dark",
                    },
                  }}
                  variant="contained"
                  onClick={() => handleClickOpen(order)}
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedOrder && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle
            textAlign="center"
            sx={{
              bgcolor: "blanchedalmond",
              color: "#000",
              borderBottom: "1px solid #ddd",
              p: 3,
              fontWeight: "bold",
            }}
          >
            Chi tiết đơn hàng #{selectedOrder._id}
          </DialogTitle>
          <DialogContent>
            <Typography
              variant="h5"
              sx={{ fontWeight: "medium", mb: 2, mt: 3 }}
            >
              Thông tin người nhận
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Tên: {selectedOrder.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Địa chỉ: {selectedOrder.address}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Số điện thoại: {selectedOrder.phone}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Phương thức thanh toán: {selectedOrder.payment}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography
              variant="h5"
              sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
            >
              Sản phẩm đã mua
            </Typography>
            {selectedOrder.products.map((item) => {
              const product = products.get(item.product);
              return product ? (
                <Card
                  variant="elevation"
                  sx={{
                    mb: 2,
                    borderRadius: 1,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                  key={item.product}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <CardMedia
                        component="img"
                        src={product.image}
                        alt={product.title}
                        sx={{
                          width: "100px",
                          height: "auto",
                          objectFit: "cover",
                          borderRadius: "4px",
                          padding: "20px",
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "1rem", fontWeight: "bold" }}
                        >
                          {product.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Giá: {product.price.toLocaleString()}$
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Số lượng: {item.quantity}
                        </Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              ) : null;
            })}
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h6"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Tổng tiền phải trả: {selectedOrder.totalPrice.toLocaleString()}$
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: 2,
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": { borderColor: "#115293", color: "#115293" },
              }}
            >
              Đóng
            </Button>
            <Button
              onClick={handleCancelClick}
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                bgcolor: "#e53935",
                color: "white",
                "&:hover": { bgcolor: "#c62828" },
              }}
            >
              Hủy đơn hàng
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {confirmOpen && (
        <Dialog
          open={confirmOpen}
          onClose={handleConfirmClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle textAlign={"center"}>Xác nhận hủy đơn hàng</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn hủy đơn hàng này không?
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
              onClick={handleCancelOrder}
              variant="contained"
              color="error"
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <SnackbarAlert
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
};

export default OrdersList;
