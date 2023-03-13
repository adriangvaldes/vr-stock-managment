import { yupResolver } from "@hookform/resolvers/yup";
import { Box, CircularProgress, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { schemas } from "../../database/schemas";
import { ColorButton, ImageToUploadType } from "../../pages/StockForm";
import { ImageUpload } from "../ImageUpload";
import { categories, ClothSubCategories, WoodSubCategories } from '../../utils/typeProducts';
import { useAppContext } from "../../context/AppContext";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebaseConfig";

type ProductType = {
  name: string,
  code: string,
  id: string,
  price: string,
  description: string,
  category: number,
  stock: number,
  subCategory: number,
  imageUrl?: any,
};

interface FormProdutoI {
  product: ProductType,
}

export function FormProduto({ product }: FormProdutoI) {
  const [imageToUpload, setImageToUpload] = useState<ImageToUploadType>(product.imageUrl);
  const [loading, setLoading] = useState<any>(false);
  const { update } = useAppContext();

  //FORM Variables
  const [name, setName] = useState<any>(product.name ?? '');
  const [code, setCode] = useState<any>(product.code ?? '');
  const [price, setPrice] = useState<any>(product.price ?? '');
  const [description, setDescription] = useState<any>(product.description ?? '');
  const [category, setCategory] = useState<any>(product.category ?? '');
  const [subCategory, setSubCategory] = useState<any>(product.subCategory ?? '');
  const [stock, setStock] = useState<any>(product.stock ?? '');
  //----------------------------------------------------------//

  async function handleUpdate() {
    setLoading(true)
    // if (!imageToUpload) return;
    try {
      await updateDoc(doc(db, 'products', product.id), {
        ...(name && { name }),
        ...(code && { code }),
        ...(price && { price }),
        ...(description && { description }),
        ...(category && { category }),
        ...(subCategory && { subCategory }),
        ...(stock && { stock }),
        ...(imageToUpload && { imageUrl: imageToUpload }),
      });
      update();
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  };

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteDoc(doc(db, 'products', product.id))
      update();
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  };

  return (<>
    <Box display={'flex'} gap={2}>
      <ColorButton
        variant="contained"
        size='large'
        sx={{ background: '#230f04', minWidth: 200 }}
        onClick={handleUpdate} disabled={loading}
      >
        Atualizar Produto
        {loading && <CircularProgress size={20} color='error' thickness={5} sx={{ position: 'absolute', right: 80 }} />}
      </ColorButton>
      <ColorButton
        variant="contained"
        size='large'
        sx={{ background: '#230f04', minWidth: 200 }}
        onClick={handleDelete} disabled={loading}
      >
        Deletar produto
        {loading && <CircularProgress size={20} color='error' thickness={5} sx={{ position: 'absolute', right: 80 }} />}
      </ColorButton>
    </Box>

    <ImageUpload loadImageToUpload={setImageToUpload} imageToPreview={imageToUpload} />
    <TextField
      id="outlined-basic"
      label="Nome do produto"
      variant="outlined"
      sx={{ minWidth: 400, width: 400 }}
      onChange={(event) => setName(event.target.value)}
      value={name}
    />
    <TextField
      id="outlined-basic"
      label="Código"
      variant="outlined"
      sx={{ minWidth: 400, width: 400 }}
      onChange={(event) => setCode(event.target.value)}
      value={code}
    />
    <TextField
      id="outlined-basic"
      label="Preço R$"
      variant="outlined"
      sx={{ minWidth: 400, width: 400 }}
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      onChange={(event) => setPrice(event.target.value)}
      value={price}
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
    <TextField
      id="outlined-basic"
      label="Descrição"
      variant="outlined"
      sx={{ minWidth: 400, width: 400 }}
      onChange={(event) => setDescription(event.target.value)}
      value={description}
    />
    <FormControl sx={{ minWidth: 400, width: 400 }}>
      <InputLabel id="category">Categoria</InputLabel>
      <Select
        labelId="category"
        id="category-select"
        label="Categoria"
        inputProps={{ 'aria-label': 'Without label' }}
        onChange={(event) => setCategory(event.target.value)}
        value={category}
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
        onChange={(event) => setSubCategory(event.target.value)}
        value={subCategory}
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
    <TextField
      id="outlined-basic"
      label="Estoque"
      variant="outlined"
      sx={{ minWidth: 400, width: 400 }}
      onChange={(event) => setStock(event.target.value)}
      value={stock}
    />
    <Box display={'flex'} gap={2}>
      <ColorButton
        variant="contained"
        size='large'
        sx={{ background: '#230f04', minWidth: 200 }}
        onClick={handleUpdate} disabled={loading}
      >
        Atualizar Produto
        {loading && <CircularProgress size={20} color='error' thickness={5} sx={{ position: 'absolute', right: 80 }} />}
      </ColorButton>
      <ColorButton
        variant="contained"
        size='large'
        sx={{ background: '#230f04', minWidth: 200 }}
        onClick={handleDelete} disabled={loading}
      >
        Deletar produto
        {loading && <CircularProgress size={20} color='error' thickness={5} sx={{ position: 'absolute', right: 80 }} />}
      </ColorButton>
    </Box>
  </>)
}