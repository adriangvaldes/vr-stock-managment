import { Box, CircularProgress, ImageList, ImageListItem, Modal, Tab, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { getProducts, ProductsType } from "../../database/functions/products";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { ColorButton } from "../StockForm";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../database/firebaseConfig";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FormProduto } from "../../components/FormProduto";
import { useAppContext } from "../../context/AppContext";
type Props = {}

const style = {
  position: 'absolute' as 'absolute',
  overflow: 'scroll',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  maxHeight: 800,
  p: 4,
};

const columns: GridColDef[] = [
  { field: 'code', headerName: 'Cód.', width: 100 },
  { field: 'name', headerName: 'Nome', width: 400 },
  { field: 'price', headerName: 'Preço R$', width: 150, type: 'number' },
  { field: 'stock', headerName: 'Qtd', width: 150, type: 'number' },
  {
    field: 'category',
    headerName: 'Categoria',
    type: 'number',
    width: 100,
  },
  {
    field: 'subCategory',
    headerName: 'Sub Categoria',
    type: 'number',
    width: 100,
  },
  // { field: 'imageUrl', headerName: 'Fotos', width: 300 },
  { field: 'description', headerName: 'Descrição', width: 700 },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params: GridValueGetterParams) =>
  //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  // },
];

export default function ProductsPainel({ }: Props) {
  const [loading, setLoading] = useState<any>(false);
  const [openViewProduct, setOpenViewProduct] = useState(false);
  const [products, setProducts] = useState<ProductsType[]>([]);
  const [value, setValue] = useState("1");
  const [productsToDelete, setProductsToDelete] = useState<any[]>([]);
  const { isUpdated, update } = useAppContext();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setProducts(await getProducts());
      setLoading(false);
    }
    loadProducts()
  }, [isUpdated])

  async function handleDeleteProducts() {
    setLoading(true);
    const deletePromises = productsToDelete.map(product => deleteDoc(doc(db, 'products', product.id)));
    await Promise.all(deletePromises)
    update();
    setLoading(false);
  }

  function handleViewProducts() {
    setOpenViewProduct(true);
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: 750,
        width: '90vw',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '2rem',
        alignSelf: 'center'
      }}
    >
      {products.length > 0 &&
        <DataGrid
          rows={products}
          columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          loading={loading}
          checkboxSelection
          onRowSelectionModelChange={(productsId) => setProductsToDelete(productsId.map(id => ({
            ...(products.find(element => element.id === id))
          })))}
        />}
      <Box display={'flex'} gap={2}>
        <ColorButton variant="contained" size='large' sx={{ background: '#230f04', minWidth: 400, marginTop: 2 }} type='button' onClick={handleDeleteProducts} disabled={productsToDelete.length === 0}>
          Deletar Produto(s)
          {loading && <CircularProgress size={20} color='error' thickness={5} sx={{ position: 'absolute', right: 80 }} />}
        </ColorButton>
        <ColorButton variant="contained" size='large' sx={{ background: '#230f04', minWidth: 400, marginTop: 2 }} type='button' onClick={handleViewProducts} disabled={productsToDelete.length === 0}>
          Visualizar Produto(s)
          {loading && <CircularProgress size={20} color='error' thickness={5} sx={{ position: 'absolute', right: 80 }} />}
        </ColorButton>
      </Box>

      <Modal
        open={openViewProduct}
        onClose={() => setOpenViewProduct(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" variant="scrollable" scrollButtons="auto">
                {productsToDelete.map((product, index) =>
                  <Tab label={`${product.name.toUpperCase()}`} value={`${index + 1}`} />
                )}
              </TabList>
            </Box>
            {productsToDelete.map((product, index) =>
              <TabPanel
                value={`${index + 1}`}
                sx={{
                  // display: 'flex',
                  // flexDirection: 'row',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                }}>
                {/* <ImageList sx={{ width: 400, margin: '0 auto' }} cols={productsToDelete.length === 1 ? 1 : 1}>
                  <ImageListItem key={1}>
                    <img
                      src={`${product.imageUrl}`}
                      srcSet={`${product.imageUrl}`}
                      alt={product.name}
                      loading="lazy"
                    />
                  </ImageListItem>
                </ImageList> */}
                <Box sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}>
                  <FormProduto product={product} />
                </Box>
              </TabPanel>
            )}
          </TabContext>
        </Box>
      </Modal>
    </Box>
  )
}