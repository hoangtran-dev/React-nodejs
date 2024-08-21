import React from 'react';
import {
  Button,
  Container,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ValidationErrors } from "final-form";
import { Field, Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { Category } from 'src/types/Product';



const Addcate: React.FC = () => {
  const navigate = useNavigate();

  const onSubmit = async (values: Category) => {
    try {
      await axios.post("/categories", values);
      navigate("/admin/category/list");
    } catch (error) {
      console.error(error);
      alert('Error creating category');
    }
  };

  const validate = (values: Category) => {
    const { name, description } = values;
    const errors: ValidationErrors = {};
    if (!name) errors.name = "Vui lòng nhập tên danh mục";
    if (!description) errors.description = "Vui lòng nhập mô tả";

    return errors;
  };

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

  return (
    <Container>
      <Stack gap={2}>
        <Typography variant="h3" textAlign={"center"}>
          Thêm danh mục
        </Typography>
        <Form
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit }) => (
            <Stack component="form" onSubmit={handleSubmit} gap={2}>
              <Field
                name="name"
                render={({ input, meta }) => (
                  <TextField
                    label="Tên danh mục"
                    variant="outlined"
                    {...input}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                  />
                )}
              />
              <Field
                name="description"
                render={({ input, meta }) => (
                  <TextField
                    label="Mô tả"
                    variant="outlined"
                    {...input}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                  />
                )}
              />
              <GradientButton type='submit'>
                Thêm danh mục
              </GradientButton>
            </Stack>
          )}
        />
      </Stack>
    </Container>
  );
};

export default Addcate;
