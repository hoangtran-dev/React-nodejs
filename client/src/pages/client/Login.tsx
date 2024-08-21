import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance/axiosInstance";
import SnackbarAlert from "../../components/snackbar/Snackbar";
import Loading from "src/components/loading/loading";
import { Users } from "src/types/user";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useUser } from "src/contexts/user";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Users>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const onSubmit: SubmitHandler<Users> = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const response = await axiosInstance.post("/auth/login", data);
      setSuccess("Đăng nhập thành công!");
      console.log("Đăng nhập thành công:", response.data);

      localStorage.setItem("Token", response.data.token);
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user); // Cập nhật trạng thái người dùng

      reset();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại sau!");
      console.error("Lỗi đăng nhập:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  const GradientButton = styled(Button)(() => ({
    background: "linear-gradient(45deg, #FE6B8B 50%, white 90%)",
    backgroundSize: "200% 200%",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    width: 600,
    marginTop: "20px",
    padding: "0 30px",
    transition: "background-position 1s ease",
    backgroundPosition: "0% 100%",
    "&:hover": {
      backgroundPosition: "200% 100%",
    },
  }));

  return (
    <Container maxWidth="sm">
      <Loading isShow={loading} />
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h3">
          Đăng nhập
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                autoComplete="email"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Vui lòng nhập đúng định dạng email",
                  },
                })}
                error={!!errors?.email?.message}
                helperText={errors?.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                autoComplete="new-password"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 5,
                    message: "Mật khẩu ít nhất 5 ký tự",
                  },
                })}
                error={!!errors?.password?.message}
                helperText={errors?.password?.message}
              />
            </Grid>
          </Grid>
          <GradientButton type="submit">Đăng nhập</GradientButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/register" variant="body2" sx={{ lineHeight: "4" }}>
                Chưa có tài khoản? Đăng ký
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <SnackbarAlert
        message={error}
        severity="error"
        open={!!error}
        onClose={handleCloseSnackbar}
      />
      <SnackbarAlert
        message={success}
        severity="success"
        open={!!success}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
};
export default Login;
