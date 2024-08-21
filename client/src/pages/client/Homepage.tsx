import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "src/components/header/header";
import Loading from "src/components/loading/loading";
import { Product } from "src/types/Product";
import SnackbarAlert from "../../components/snackbar/Snackbar";
import ListProduct from "./Listproducts";

const PaginationButton = styled(Button)(() => ({
  position: "relative",
  overflow: "hidden",
  padding: "3px",
  minWidth: "40px",
  borderRadius: "2px",
  boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
  backgroundColor: "white",
  color: "black",
  "&:hover": {
    backgroundColor: "grey.200",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "-100%",
    width: "100%",
    height: "2px",
    backgroundColor: "#E63673",
    transition: "left 0.3s ease-out",
  },
  "&:hover::after": {
    left: 0,
  },
}));

function Homepage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(8);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [noResults, setNoResults] = useState<boolean>(false);

  const getAllProducts = async (
    category: string | null = null,
    query: string = ""
  ) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const { data } = await axios.get("/products", {
        params: { category, query },
      });
      setProducts(data);
      setNoResults(data.length === 0); // Set noResults to true if no products are found
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại sau!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));
  const boundedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    buttons.push(
      <PaginationButton
        key={1}
        onClick={() => paginate(1)}
        sx={{
          color: 1 === boundedCurrentPage ? "white" : "black",
          bgcolor: 1 === boundedCurrentPage ? "black" : "white",
          fontWeight: 1 === boundedCurrentPage ? "bold" : "normal",
          "&:hover": {
            bgcolor: 1 === boundedCurrentPage ? "black" : "grey.200",
          },
        }}
      >
        1
      </PaginationButton>
    );

    if (boundedCurrentPage > 3) {
      buttons.push(
        <span key="start-ellipsis">
          <MoreHorizIcon />
        </span>
      );
    }

    const startPage = Math.max(2, boundedCurrentPage - 1);
    const endPage = Math.min(totalPages - 1, boundedCurrentPage + 1);

    for (let number = startPage; number <= endPage; number++) {
      buttons.push(
        <PaginationButton
          key={number}
          onClick={() => paginate(number)}
          sx={{
            color: number === boundedCurrentPage ? "white" : "black",
            bgcolor: number === boundedCurrentPage ? "black" : "white",
            fontWeight: number === boundedCurrentPage ? "bold" : "normal",
            "&:hover": {
              bgcolor: number === boundedCurrentPage ? "black" : "grey.200",
            },
          }}
        >
          {number}
        </PaginationButton>
      );
    }

    if (boundedCurrentPage < totalPages - 2) {
      buttons.push(
        <span key="end-ellipsis">
          <MoreHorizIcon />
        </span>
      );
    }

    buttons.push(
      <PaginationButton
        key={totalPages}
        onClick={() => paginate(totalPages)}
        sx={{
          color: totalPages === boundedCurrentPage ? "white" : "black",
          bgcolor: totalPages === boundedCurrentPage ? "black" : "white",
          fontWeight: totalPages === boundedCurrentPage ? "bold" : "normal",
          "&:hover": {
            bgcolor: totalPages === boundedCurrentPage ? "black" : "grey.200",
          },
        }}
      >
        {totalPages}
      </PaginationButton>
    );

    return buttons;
  };

  return (
    <>
      <Header onCategorySelect={handleCategorySelect} onSearch={handleSearch} />
      <Loading isShow={loading} />
      <Grid container spacing={4} justifyContent="center" mt={3}>
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
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={3}
          alignItems="center"
          justifyContent="center"
          sx={{ px: 4, py: 6 }}
        >
          {noResults ? (
            <Typography variant="h3">Không tìm thấy sản phẩm</Typography>
          ) : (
            currentProducts.map((product) => (
              <ListProduct key={product._id} product={product} />
            ))
          )}
        </Stack>

        {totalPages > 1 && (
          <Grid item xs={12}>
            <Stack gap={1} direction="row" justifyContent="center" mt={2}>
              {renderPaginationButtons()}
            </Stack>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default Homepage;
