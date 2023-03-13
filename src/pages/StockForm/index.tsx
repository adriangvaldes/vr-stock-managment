import { useState } from 'react'
import Button from '@mui/material/Button';
import { Box, ButtonProps, CircularProgress, Container, FormControl, Input, InputLabel, MenuItem, Select, styled, TextField, Typography } from '@mui/material';
import { categories, ClothSubCategories, WoodSubCategories } from '../../utils/typeProducts';
import { ImageUpload } from '../../components/ImageUpload';
import { useForm, SubmitHandler } from "react-hook-form";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from '../../database/firebaseConfig';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemas } from '../../database/schemas';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CurrencyInput from 'react-currency-input-field';
import React from 'react';
import { Link } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import { SvgIcon } from '@mui/material';

type Inputs = {
  name: string,
  code: string,
  price: string,
  description: string,
  category: number,
  stock: number,
  subCategory: number,
  photo?: any,
};

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: '#230f04',
  '&:hover': {
    backgroundColor: '#e3573b',
  },
}));

export type ImageToUploadType = {
  url: string,
  type: string,
  file: File,
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const CustomCurrencyInput = React.forwardRef<HTMLElement, CustomProps>(
  function CustomCurrencyInput(props, ref) {
    const { onChange, ...other } = props;
    return (
      <CurrencyInput
        id="input-example"
        name="input-name"
        placeholder="Please enter a number"
        defaultValue={1000}
        decimalsLimit={2}
        onValueChange={(value, name) => console.log(value, name)}
        prefix='R$'
        decimalSeparator=","
        groupSeparator="."
      />
    );
  },
);


export function StockForm() {
  const [category, setCategory] = useState<any>('')
  const [loading, setLoading] = useState<any>(false)
  const [imageToUpload, setImageToUpload] = useState<ImageToUploadType>()
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: yupResolver(schemas)
  });
  const { onBlur: onBlurCategory, name: nameCategory, ref: refCategory } = register('category');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true)
    if (!imageToUpload) return;
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `productImages/${imageToUpload.file.name}`)
      const productsCollectionRef = collection(db, 'products');
      const productRef = await addDoc(productsCollectionRef, data);
      await uploadBytes(storageRef, imageToUpload?.file)
      const donwloadUrl = await getDownloadURL(storageRef)
      await updateDoc(productRef, {
        imageUrl: donwloadUrl,
      });

    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  };

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
            <Typography variant="h6" sx={{ position: 'absolute', top: 30 }}>Cadastro de produtos</Typography>

            <Link to='/productsPainel'
              style={{
                color: '#230f04',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}>
              <Typography variant="body1">
                Ver painel de produtos
              </Typography>
              <LaunchIcon component={LaunchIcon} fontSize='small' ></LaunchIcon>
            </Link>

            <ImageUpload loadImageToUpload={setImageToUpload} />
            <TextField id="outlined-basic" label="Nome do produto" variant="outlined" sx={{ minWidth: 400, width: 400 }} {...register("name")} />
            <TextField id="outlined-basic" label="Código" variant="outlined" sx={{ minWidth: 400, width: 400 }} {...register("code")} />
            <TextField
              id="outlined-basic"
              label="Preço R$"
              variant="outlined"
              sx={{ minWidth: 400, width: 400 }}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              {...register("price")}
            />
            {/* <FormControl variant="standard">
              <InputLabel htmlFor="formatted-text-mask-input">Preço R$</InputLabel>
              <Input
                // value={values.textmask}
                // onChange={handleChange}
                name="textmask"
                id="formatted-text-mask-input"
                inputComponent={CustomCurrencyInput as any}
              />
            </FormControl> */}
            <TextField id="outlined-basic" label="Descrição" variant="outlined" sx={{ minWidth: 400, width: 400 }} {...register("description")} />
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
            <TextField id="outlined-basic" label="Estoque" variant="outlined" sx={{ minWidth: 400, width: 400 }} {...register("stock")} />
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

