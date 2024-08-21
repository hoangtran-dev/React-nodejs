import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Badge,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  styled,
  Toolbar,
  Typography,
  Link
} from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "src/contexts/Cart";
import { useUser } from "src/contexts/user";
import { Category } from "src/types/Product";
import logo from "../../assets/img/logo.png";

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

const GradientButtonLogin = styled(Button)(() => ({
  background: "linear-gradient(45deg, #FFFFFF 50%, #FE6B8B 90%)",
  border: 0,
  backgroundSize: "200% 200%",
  borderRadius: 3,
  boxShadow: "0 0 5px 2px rgba(255, 105, 135, .3)",
  color: "black",
  height: 48,
  marginTop: "20px",
  padding: "0 30px",
  transition: "background-position 1s ease",
  backgroundPosition: "0% 100%",
  "&:hover": {
    backgroundPosition: "200% 100%",
  },
}));

const MenuItemStyled = styled(MenuItem)(() => ({
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "-100%",
    width: "100%",
    height: "2px",
    backgroundColor: "#FE6B8B",
    transition: "left 0.3s ease-out",
  },
  "&:hover::after": {
    left: 0,
  },
}));

const Header = ({ onCategorySelect, onSearch }) => {
  const { user, setUser } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { cart } = useCart();
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("cart");
    setUser(null);
    navigate("/login")
    window.location.reload();
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    onSearch(newSearchQuery);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  const cartQuantity = useMemo(
    () =>
      cart
        ? cart.products.reduce((total, { quantity }) => total + quantity, 0)
        : 0,
    [cart]
  );

  return (
    <AppBar
      position="fixed"
      sx={{ bgcolor: "#fff", borderBottom: "1px solid #ddd" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={15} sx={{ flexGrow: 1 }}>
          <Link href="/" sx={{ textDecoration: "none" }}>
            <img src={logo} width={115} alt="Logo" />
          </Link>
          <Stack direction="row" spacing={2} alignItems="center">
            <Link href="/" color="black" underline="none" sx={{ "&:hover": { borderBottom: "1px solid" } }}>Trang chủ</Link>
            <Link href="#" color="black" underline="none" onMouseEnter={handleCategoryClick} sx={{ "&:hover": { borderBottom: "1px solid" } }}>
              Danh mục
            </Link>
            <Link href="/product/liked" color="black" underline="none" sx={{ "&:hover": { borderBottom: "1px solid" } }}>Yêu thích</Link>
          </Stack >
        </Stack >

        <Stack direction="row" spacing={2} alignItems="center">
          <form onSubmit={handleSearchSubmit}>
            <InputBase
              type="search"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 10,
                border: "1px solid #ccc",
                bgcolor: "#fff",
                ":focus-within": { borderColor: "pink", borderWidth: 2 }
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </form>
          {user ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Link href="/carts">
                <IconButton color="inherit">
                  <Badge badgeContent={cartQuantity} color="secondary">
                    <ShoppingCartIcon sx={{ color: "black" }} />
                  </Badge>
                </IconButton>
              </Link>
              <Typography color="black">Hi, {user.username}</Typography>
              <IconButton>
                <AccountCircleIcon />
              </IconButton>
              <GradientButtonLogin onClick={handleLogout}>
                Đăng xuất
              </GradientButtonLogin>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2}>
              <GradientButtonLogin type="submit" href="/login">
                Đăng nhập
              </GradientButtonLogin>
              <GradientButton type="submit" href="/register">
                Đăng ký
              </GradientButton>
            </Stack>
          )}
        </Stack>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCategoryClose}
        MenuListProps={{
          onMouseLeave: handleCategoryClose,
        }}
      >
        <MenuItemStyled
          onClick={() => {
            onCategorySelect(null);
            handleCategoryClose();
          }}
        >
          Tất cả sản phẩm
        </MenuItemStyled>
        {categories.map((category) => (
          <MenuItemStyled
            key={category._id}
            onClick={() => {
              onCategorySelect(category.name);
              handleCategoryClose();
            }}
          >
            {category.name}
          </MenuItemStyled>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Header;
