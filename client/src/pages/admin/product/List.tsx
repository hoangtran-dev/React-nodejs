import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField
} from '@mui/material';
import { styled } from '@mui/system';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmDialog from 'src/components/ConfirmDialog';
import SnackbarAlert from 'src/components/snackbar/Snackbar';
import Loading from 'src/components/loading/loading';
import { useLoading } from 'src/contexts/loading';
import filter from 'src/assets/img/more.png';
import searchIcon from 'src/assets/img/search.png';
import { Category, Product } from 'src/types/Product';

const StyledTextField = styled(TextField)(({ theme, isVisible }) => ({
  transition: 'width 0.5s, opacity 0.5s',
  width: isVisible ? '200px' : '0',
  opacity: isVisible ? 1 : 0,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E63673',
    },
    '&:hover fieldset': {
      borderColor: '#E63673',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E63673',
    },
  },
  marginLeft: isVisible ? theme.spacing(1) : 0,
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '-100%',
    width: '100%',
    height: '2px',
    backgroundColor: '#E63673',
    transition: 'left 0.3s ease-out',
  },
  '&:hover::after': {
    left: 0,
  },
}));

const PaginationButton = styled(Button)(() => ({
  position: 'relative',
  overflow: 'hidden',
  padding: '3px',
  minWidth: '40px',
  borderRadius: '2px',
  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
  backgroundColor: 'white',
  color: 'black',
  '&:hover': {
    backgroundColor: 'grey.200',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '-100%',
    width: '100%',
    height: '2px',
    backgroundColor: '#E63673',
    transition: 'left 0.3s ease-out',
  },
  '&:hover::after': {
    left: 0,
  },
}));

const AdminProductList = () => {
  const { loading, setLoading } = useLoading();
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [idDelete, setIdDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(6);
  const [error, setError] = useState<string | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getAllProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/products');
      let filteredData = data;
      if (selectedCategory) {
        filteredData = filteredData.filter((product: Product) =>
          product.category?.name === selectedCategory
        );
      }
      setProducts(filteredData);
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại sau!');
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProduct();
  }, [selectedCategory]);

  const filterProducts = () => {
    let filteredData = products;
    if (search) {
      filteredData = filteredData.filter((product: { title: string }) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory) {
      filteredData = filteredData.filter((product: Product) =>
        product.category?.name === selectedCategory
      );
    }
    return filteredData;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []);

  const filteredProducts = filterProducts();

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const boundedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const indexOfLastProduct = boundedCurrentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleConfirm = (id: string) => {
    setConfirm(true);
    setIdDelete(id);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/products/${idDelete}`);
      setShowSuccess(true);
      getAllProduct();
      setConfirm(false);
      setIdDelete(null);
    } catch (error) {
      setError('Có lỗi xảy ra khi xóa sản phẩm, vui lòng thử lại sau!');
    }
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSearchIconClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    // Always show the first page
    buttons.push(
      <PaginationButton
        key={1}
        onClick={() => paginate(1)}
        sx={{
          color: 1 === boundedCurrentPage ? 'white' : 'black',
          bgcolor: 1 === boundedCurrentPage ? 'black' : 'white',
          fontWeight: 1 === boundedCurrentPage ? 'bold' : 'normal',
          '&:hover': {
            bgcolor: 1 === boundedCurrentPage ? 'black' : 'grey.200'
          }
        }}
      >
        1
      </PaginationButton>
    );

    if (boundedCurrentPage > 3) {
      buttons.push(<span key="start-ellipsis"><MoreHorizIcon /></span>);
    }

    const startPage = Math.max(2, boundedCurrentPage - 1);
    const endPage = Math.min(totalPages - 1, boundedCurrentPage + 1);

    for (let number = startPage; number <= endPage; number++) {
      buttons.push(
        <PaginationButton
          key={number}
          onClick={() => paginate(number)}
          sx={{
            color: number === boundedCurrentPage ? 'white' : 'black',
            bgcolor: number === boundedCurrentPage ? 'black' : 'white',
            fontWeight: number === boundedCurrentPage ? 'bold' : 'normal',
            '&:hover': {
              bgcolor: number === boundedCurrentPage ? 'black' : 'grey.200'
            }
          }}
        >
          {number}
        </PaginationButton>
      );
    }

    if (boundedCurrentPage < totalPages - 2) {
      buttons.push(<span key="end-ellipsis"><MoreHorizIcon /></span>);
    }

    // Always show the last page
    buttons.push(
      <PaginationButton
        key={totalPages}
        onClick={() => paginate(totalPages)}
        sx={{
          color: totalPages === boundedCurrentPage ? 'white' : 'black',
          bgcolor: totalPages === boundedCurrentPage ? 'black' : 'white',
          fontWeight: totalPages === boundedCurrentPage ? 'bold' : 'normal',
          '&:hover': {
            bgcolor: totalPages === boundedCurrentPage ? 'black' : 'grey.200'
          }
        }}
      >
        {totalPages}
      </PaginationButton>
    );

    return buttons;
  };

  return (
    <>
      <Container>
        <Stack gap={2}>
          <Typography variant="h3" textAlign="center">
            Danh sách sản phẩm
          </Typography>
          {loading ? (
            <Loading isShow={loading} />
          ) : (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" gap={1}>
                  <IconButton onClick={handleFilterClick}>
                    <img src={filter} width={25} />
                  </IconButton>
                  <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
                    <StyledMenuItem
                      onClick={() => {
                        setSelectedCategory(null);
                        handleFilterClose();
                        getAllProduct();
                      }}
                    >
                      Tất cả sản phẩm
                    </StyledMenuItem>
                    {categories.map((category) => (
                      <StyledMenuItem
                        key={category._id}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          handleFilterClose();
                          getAllProduct();
                        }}
                      >
                        {category.name}
                      </StyledMenuItem>
                    ))}
                  </Menu>
                </Stack>

                <Stack direction="row" gap={1} alignItems="center">
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleSearchIconClick}>
                      <img src={searchIcon} width={25} />
                    </IconButton>
                    <StyledTextField
                      variant="outlined"
                      size="small"
                      value={search}
                      onChange={handleSearchChange}
                      placeholder="Tìm kiếm sản phẩm"
                      isVisible={isSearchVisible}
                    />
                  </div>

                  <Link to="/admin/product/add" style={{ width: '200px' }}>
                    <Button variant="contained" color="primary" sx={{ width: '100%' }}>
                      <AddIcon /> Thêm sản phẩm
                    </Button>
                  </Link>
                </Stack>
              </Stack>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1000, textAlign: 'center' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tiêu đề</TableCell>
                      <TableCell align="center">Ảnh</TableCell>
                      <TableCell align="right">Giá</TableCell>
                      <TableCell align="right">Mô tả</TableCell>
                      <TableCell align="right">Danh mục</TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentProducts.map((product, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {product.title}
                        </TableCell>
                        <TableCell align="center">
                          <img src={product.image} alt="" width={80} />
                        </TableCell>
                        <TableCell align="right">{product.price}</TableCell>
                        <TableCell align="right">{product.description}</TableCell>
                        <TableCell align="right">{product.category?.name}</TableCell>
                        <TableCell align="center">
                          <Stack direction={'row'} gap={3} justifyContent={'center'}>
                            <Link to={`/admin/product/edit/${product._id}`}>
                              <Button variant="contained" color="warning">
                                <EditIcon /> Sửa
                              </Button>
                            </Link>
                            <Button color="error" variant="contained" onClick={() => handleConfirm(product._id)}>
                              <DeleteForeverIcon /> Xóa
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ConfirmDialog confirm={confirm} onConfirm={setConfirm} onDelete={handleDelete} />
              </TableContainer>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Stack gap={1} direction="row" justifyContent="center" mt={2}>
              {renderPaginationButtons()}
            </Stack>
          )}

          {error && (
            <SnackbarAlert
              message={error}
              severity="error"
              open={Boolean(error)}
              onClose={() => setError(null)}
            />
          )}

          {showSuccess && (
            <SnackbarAlert
              message="Xóa sản phẩm thành công!"
              severity="success"
              open={showSuccess}
              onClose={() => setShowSuccess(false)}
            />
          )}
        </Stack>
      </Container>
    </>
  );
};

export default AdminProductList;