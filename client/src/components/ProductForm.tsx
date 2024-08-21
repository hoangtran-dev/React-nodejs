import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ValidationErrors } from "final-form";
import { Field, Form } from "react-final-form";
import { Category, ProductFormParams } from "src/types/Product";
import axios from "axios";

type ProductFormProps = {
  onSubmit: (values: ProductFormParams) => void;
  initialValues?: ProductFormParams;
  isEdit?: boolean;
};

function ProductForm({ onSubmit, initialValues, isEdit }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const GradientButton = styled(Button)(() => ({
    background: 'linear-gradient(45deg, #FE6B8B 50%, white 90%)',
    backgroundSize: '200% 200%',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    width: 250,
    padding: '0 30px',
    transition: 'background-position 1s ease',
    backgroundPosition: '0% 100%',
    '&:hover': {
      backgroundPosition: '200% 100%',
    },
  }));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialValues && initialValues.category) {
      setSelectedCategoryId(initialValues.category._id);
    }
  }, [initialValues]);

  const validate = (values: ProductFormParams) => {
    const { title, image, category, price } = values;
    const errors: ValidationErrors = {};
    if (!title) errors.title = "Vui lòng nhập tiêu đề";
    if (!image) errors.image = "Vui lòng nhập đường dẫn hình ảnh";
    if (!category) errors.category = "Vui lòng chọn danh mục";
    if (!price) errors.price = "Vui lòng nhập giá sản phẩm";

    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialValues || { isShow: true }}
      render={({ handleSubmit }) => (

        <form onSubmit={handleSubmit}>
          <Typography variant="h3" textAlign={'center'} my={3} gutterBottom>
            {isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </Typography>
          <Stack>
            <Field
              name="title"
              render={({ input, meta }) => (
                <TextField
                  sx={{ margin: '5px' }}
                  label="Tiêu đề"
                  variant="outlined"
                  helperText={meta.touched && meta.error}
                  error={meta.touched && !!meta.error}
                  {...input}
                />
              )}
            />
            <Field
              name="image"
              render={({ input, meta }) => (
                <TextField
                  sx={{ margin: '5px' }}
                  label="Hình ảnh"
                  variant="outlined"
                  helperText={meta.touched && meta.error}
                  error={meta.touched && !!meta.error}
                  {...input}
                />
              )}
            />
            <Field<string>
              name="description"
              render={({ input }) => (
                <TextField
                  sx={{ margin: '5px' }} label="Mô tả" variant="outlined" {...input} />
              )}
            />
            <Field<number>
              name="price"
              render={({ input, meta }) => (
                <TextField
                  sx={{ margin: '5px' }}
                  label="Giá"
                  variant="outlined"
                  {...input}
                  type="number"
                  helperText={meta.touched && meta.error}
                  error={meta.touched && !!meta.error}
                />
              )}
            />
            <Field<string>
              name="isShow"
              type="checkbox"
              render={({ input }) => (
                <FormControlLabel
                  sx={{ margin: '5px' }}
                  control={<Checkbox {...input} />}
                  label="Show product"
                />
              )}
            />
            <Field<string>
              name="category"
              render={({ input, meta }) => (
                <FormControl fullWidth
                  sx={{ margin: '5px' }}>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    label="Danh mục"
                    {...input}
                    error={meta.touched && Boolean(meta.error)}
                    value={selectedCategoryId || ""}
                    onChange={(e) => {
                      input.onChange(e);
                      setSelectedCategoryId(e.target.value as string);
                    }}
                  >
                    <MenuItem value="">Chọn</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {meta.touched && meta.error && (
                    <FormHelperText sx={{ color: "red" }}>
                      {meta.error}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <GradientButton type="submit" sx={{ marginTop: '10px' }}>
              {isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </GradientButton>
          </Stack>
        </form>
      )}
    />
  );
}

export default ProductForm;