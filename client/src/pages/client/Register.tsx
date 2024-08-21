import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  styled,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SnackbarAlert from "../../components/snackbar/Snackbar";
import Loading from "src/components/loading/loading";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Users } from "src/types/user";
import axiosInstance from "./axiosInstance/axiosInstance";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Users & { confirmPassword: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit: SubmitHandler<Users & { confirmPassword: string }> = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axiosInstance.post("/auth/register", data);
      console.log("User registered successfully:", response.data);
      setSuccess("Đăng ký thành công!");
      reset();
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại sau!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  const GradientButton = styled(Button)(() => ({
    background: 'linear-gradient(45deg, #FE6B8B 50%, white 90%)',
    backgroundSize: '200% 200%',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    width: 600,
    marginTop: '20px',
    padding: '0 30px',
    transition: 'background-position 1s ease',
    backgroundPosition: '0% 100%',
    '&:hover': {
      backgroundPosition: '200% 100%',
    },
  }));

  return (
    <Container maxWidth="sm">
      <Loading isShow={loading} />
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h3">
          Đăng ký
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <TextField
                autoComplete="given-name"
                fullWidth
                label="Tên người dùng"
                autoFocus
                {...register("username", {
                  required: "Vui lòng nhập tên người dùng",
                })}
                error={!!errors?.username?.message}
                helperText={errors?.username?.message}
              />
            </Grid>

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
                    value: 6,
                    message: "Mật khẩu có ít nhất 6 ký tự",
                  },
                })}
                error={!!errors?.password?.message}
                helperText={errors?.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nhập lại mật khẩu"
                type="password"
                autoComplete="confirm-password"
                {...register("confirmPassword", {
                  required: "Vui lòng xác nhận lại mật khẩu",
                  validate: (value) =>
                    value === password || "Mật khẩu không khớp",
                })}
                error={!!errors?.confirmPassword?.message}
                helperText={errors?.confirmPassword?.message}

              />
            </Grid>

          </Grid>
          <GradientButton type="submit">
            Đăng ký
          </GradientButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2" sx={{ lineHeight: '4' }}>
                Đã có tài khoản? Đăng nhập
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

export default Register;
