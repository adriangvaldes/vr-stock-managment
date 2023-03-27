import { ChangeEvent, useState } from 'react'
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
import { Link } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import { NumericFormat } from 'react-number-format';

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

function CurrencyInput(props: any) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values: any) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      prefix="$"
      decimalScale={2}
      allowNegative={false}
    />
  );
}

export function StockForm() {
  const [category, setCategory] = useState<any>('')
  const [loading, setLoading] = useState<any>(false)
  const [imagesToUpload, setImagesToUpload] = useState<ImageToUploadType[]>()
  const [resetImageFlag, setResetImageFlag] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>({
    resolver: yupResolver(schemas)
  });
  const { onBlur: onBlurCategory, name: nameCategory, ref: refCategory } = register('category');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true)
    if (!imagesToUpload) return;
    try {
      const storage = getStorage();
      let donwloadsUrl = [];
      const productsCollectionRef = collection(db, 'products');
      const productRef = await addDoc(productsCollectionRef, data);

      for (const image of imagesToUpload) {
        const storageRef = ref(storage, `productImages/${image.file.name}`)
        await uploadBytes(storageRef, image?.file)
        donwloadsUrl.push(await getDownloadURL(storageRef))
      }

      await updateDoc(productRef, {
        imagesUrl: donwloadsUrl,
      });
      reset();
      setImagesToUpload([]);
      setCategory('');
      setResetImageFlag(p => !p);
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  };

  const handleCodemask = (value: string) => {
    return value
      .replace(/(\d{3})(\d)/, '$1-$2') // add dash after first 3 digits
  }

  const handlePriceMask = (value: string) => {
    return value
      .replace(/\D/g, '') // remove non-numeric characters
    // .replace(/(\d{3})(\d)/, '$1.$2') // add period after next three digits
    // .replace(/^\d{1,7}$/, ''); // add dash after last two digits
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

            <ImageUpload loadImageToUpload={setImagesToUpload} resetImageFlag={resetImageFlag} />
            <TextField id="outlined-basic" label="Nome do produto" variant="outlined" sx={{ minWidth: 400, width: 400 }} {...register("name")} />
            <TextField
              id="outlined-basic"
              label="Código"
              variant="outlined"
              sx={{ minWidth: 400, width: 400 }}
              inputProps={{
                maxLength: 8,
                inputComponent: CurrencyInput,
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                  // const { value } = event.target;
                  const inputValue = event.target.value;
                  if (inputValue.match(/^\w{0,3}\d{0,4}$/)) {
                    event.target.value = inputValue
                      .replace(/(\d{3})(\d)/, '$1-$2') // add dash after first 3 digits
                  }
                  // event.target.value = handleCodemask(value);
                },
              }}
              {...register("code")}
            />
            <TextField
              id="outlined-basic"
              label="Preço R$"
              variant="outlined"
              sx={{ minWidth: 400, width: 400 }}
              inputProps={{
                inputComponent: CurrencyInput,
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                  const { value } = event.target;
                  event.target.value = handlePriceMask(value);
                },
              }}
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

