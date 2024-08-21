import { Container, Stack, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  return (
    <Stack sx={{ bgcolor: "#f0f0f0", mt: 10 }}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center"
        }}
      >
        <Stack
          direction="row"
          spacing={5}
          sx={{ width: "100%", py: 3 }}
        >
          <Stack spacing={2} sx={{ flex: "1" }}>
            <Typography variant="h6" gutterBottom>
              Thông tin chung
            </Typography>
            <Link sx={{ textDecoration: 'none' }} href="#">Chính sách bảo hành</Link>
            <Link sx={{ textDecoration: 'none' }} href="#">Chính sách bảo mật</Link>
            <Link sx={{ textDecoration: 'none' }} href="#">Điều kiện giao dịch chung</Link>
          </Stack>
          <Stack spacing={2} sx={{ flex: "1" }}>
            <Typography variant="h6" gutterBottom>
              Hướng dẫn mua hàng
            </Typography>
            <Link sx={{ textDecoration: 'none' }} href="#">Vận chuyển và giao nhận</Link>
            <Link sx={{ textDecoration: 'none' }} href="#">Phương thức thanh toán</Link>
          </Stack>
          <Stack spacing={2} sx={{ flex: "1" }}>
            <Typography variant="h6" gutterBottom>
              Kết nối với chúng tôi
            </Typography>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
              <IconButton href="#" sx={{ color: "inherit" }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: "inherit" }}>
                <TwitterIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: "inherit" }}>
                <YouTubeIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: "inherit" }}>
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Stack spacing={2} sx={{ flex: "1" }}>
            <Typography variant="h6" gutterBottom>
              Hotline
            </Typography>
            <Typography variant="body1">1900 2033</Typography>
          </Stack>
        </Stack>
        <Stack
          spacing={2}
          sx={{
            borderTop: "1px solid #ddd",
            pt: 2,
            mt: 2,
            width: "100%",
            maxWidth: "1200px",
            pb: 2,
          }}
        >
          <Typography variant="body2">
            &#169;2023 All rights reserved Laforce
          </Typography>
          <Typography variant="body2">
            CÔNG TY TNHH LAFORCE VIỆT NAM - Địa chỉ: Số 129 Cầu Giấy, Phường
            Quan Hoa, Quận Cầu Giấy, Thành Phố Hà Nội, Việt Nam - Mã số doanh
            nghiệp: 0106156656
          </Typography>
        </Stack>
      </Container>
    </Stack>
  );
}

export default Footer;
