import { yupResolver } from "@hookform/resolvers/yup";
import { Box, CircularProgress, TextField, Typography } from "@mui/material"
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginSchema } from "../../database/schemas";
import { ColorButton } from "../StockForm";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

type Props = {}

type Inputs = {
  email: string,
  password: string,
};

export default function Login({ }: Props) {
  const [loading, setLoading] = useState<any>(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: yupResolver(loginSchema)
  });

  const login: SubmitHandler<Inputs> = async ({ email, password }) => {
    const auth = getAuth();
    setLoading(true)
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      console.log(user)
    } catch (error: any) {
      console.log(error.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(login)}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          // minWidth: 500,
          // minHeight: 750,
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '3rem',
          paddingTop: '6rem',
        }}
      >
        <Typography variant="h6" sx={{ position: 'absolute', top: 30 }}>VR-ATELIE GERENCIAMENTO DE ESTOQUE</Typography>
        <TextField id="outlined-basic" label="Email" type={'email'} variant="outlined" sx={{ minWidth: 400, width: 400 }} {...register("email")} />
        <TextField id="outlined-basic" type={'password'} label="Senha" variant="outlined" sx={{ minWidth: 400, width: 400 }} {...register("password")} />
        <ColorButton variant="contained" size='large' sx={{ background: '#230f04', minWidth: 400, marginTop: 2 }} type='submit' disabled={loading}>
          Entrar
          {loading && <CircularProgress size={20} color='error' thickness={5} sx={{ position: 'absolute', right: 80 }} />}
        </ColorButton>
      </Box>
    </form>
  )
}