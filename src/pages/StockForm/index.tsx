import { useState } from 'react'
import Button from '@mui/material/Button';
import { Box, ButtonProps, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, styled, TextField, Typography } from '@mui/material';
import { categories, ClothSubCategories, WoodSubCategories } from '../../utils/typeProducts';
import { ImageUpload } from '../../components/ImageUpload';
import { useForm, SubmitHandler } from "react-hook-form";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from '../../database/firebaseConfig';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemas } from '../../database/schemas';

type Inputs = {
  name: string,
  price: string,
  category: number,
  subCategory: number,
  photo?: any,
};

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: '#230f04',
  '&:hover': {
    backgroundColor: '#e3573b',
  },
}));

export function StockForm() {
  const [category, setCategory] = useState<any>('')
  const [loading, setLoading] = useState<any>(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: yupResolver(schemas)
  });
  const { onBlur: onBlurCategory, name: nameCategory, ref: refCategory } = register('category');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true)
    try {
      const productsRef = collection(db, 'products');
      await addDoc(productsRef, data);
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  };

  console.log('TESTE');


  return (
    <div>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              minWidth: 500,
              minHeight: 750,
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '2rem',
              paddingTop: '4rem',
            }}
          >
            <Typography variant="h6" sx={{ position: 'absolute', top: 30 }}>VR-ATELIE GERENCIAMENTO DE ESTOQUE</Typography>
            <TextField id="outlined-basic" label="Nome do produto" variant="outlined" sx={{ minWidth: 400, width: 400 }} {...register("name")} />
            <TextField
              id="outlined-basic"
              label="Preço"
              variant="outlined"
              sx={{ minWidth: 400, width: 400 }}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              {...register("price")}
            />

            <FormControl sx={{ minWidth: 400, width: 400 }}>
              <InputLabel id="category">Categoria</InputLabel>
              <Select
                labelId="category"
                id="category-select"
                label="Categoria"
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(event) => setCategory(event.target.value)}
                ref={refCategory}
                onBlur={onBlurCategory}
                name={nameCategory}
              >
                <MenuItem value="">
                  <em>Selecione uma categoria</em>
                </MenuItem>
                {categories.map((category, index) => (
                  <MenuItem value={index + 1}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ maxWidth: 400, width: 400 }}>
              <InputLabel id="sub-category">Sub categoria</InputLabel>
              <Select
                labelId="sub-category"
                id="sub-category-select"
                label="Sub categoria"
                {...register('subCategory')}
              >
                <MenuItem value="">
                  <em>Selecione a sub categoria</em>
                </MenuItem>
                {category === 1 && WoodSubCategories.map((subCategory, index) => (
                  <MenuItem value={index + 1}>{subCategory}</MenuItem>
                ))}
                {category === 2 && ClothSubCategories.map((subCategory, index) => (
                  <MenuItem value={index + 1}>{subCategory}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <ImageUpload />
            <ColorButton variant="contained" size='large' sx={{ background: '#230f04', minWidth: 400, marginTop: 2 }} type='submit' disabled={loading}>
              Salvar Produto
              {loading && <CircularProgress size={20} color='error' thickness={5} sx={{ position: 'absolute', right: 80 }} />}
            </ColorButton>
          </Box>
        </form>
      </Container>
    </div >
  )
}

