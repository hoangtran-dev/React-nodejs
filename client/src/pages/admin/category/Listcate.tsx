import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ConfirmDialog from 'src/components/ConfirmDialog';
import { Category } from 'src/types/Product';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SnackbarAlert from 'src/components/snackbar/Snackbar';

const Listcate: React.FC = () => {
  const [confirm, setConfirm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [idDelete, setIdDelete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleConfirm = (id: string) => {
    setConfirm(true);
    setIdDelete(id);
  };

  const handleDelete = async () => {
    if (idDelete) {
      try {
        await axios.delete(`/categories/${idDelete}`);
        getAllCategories();
        setSuccessMessage("Xóa thành công");
      } catch (error) {
        console.error("Failed to delete category:", error);
        setErrorMessage(error.response?.data?.message || "Failed to delete category");
      }
    } else {
      console.error("No category ID to delete.");
    }
    setConfirm(false);
  };

  return (
    <Container>
      <Stack gap={2}>
        <Typography variant="h3" textAlign="center">
          Danh sách danh mục
        </Typography>
        <Link to="/admin/category/add" style={{ width: "200px" }}>
          <Button variant="contained" color='primary' sx={{ width: "100%" }}>
            <AddIcon /> Thêm danh mục
          </Button>
        </Link>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow
                  key={category._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {category._id}
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" gap={3} justifyContent="center">
                      <Link to={`/admin/category/edit/${category._id}`}>
                        <Button variant="contained" color='warning'>
                          <EditIcon /> Sửa
                        </Button>
                      </Link>
                      <Button
                        variant="contained"
                        color='error'
                        onClick={() => handleConfirm(category._id)}
                      >
                        <DeleteForeverIcon /> Xóa
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ConfirmDialog
            confirm={confirm}
            onConfirm={() => setConfirm(false)}
            onDelete={handleDelete}
          />
        </TableContainer>
      </Stack>
      <SnackbarAlert
        open={!!errorMessage}
        message={errorMessage || ""}
        severity="error"
        onClose={() => setErrorMessage(null)}
      />
      <SnackbarAlert
        open={!!successMessage}
        message={successMessage || ""}
        severity="success"
        onClose={() => setSuccessMessage(null)}
      />
    </Container>
  );
};

export default Listcate;
