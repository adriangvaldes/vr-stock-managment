import * as yup from "yup";

export const schemas = yup.object({
  name: yup.string().required('Nome obrigatório!'),
  code: yup.string().required('Código obrigatório!'),
  price: yup.number().positive('Precisa ser um número positivo válido').required('Preço obrigatório!'),
  description: yup.string().required('Descrição obrigatória!'),
  stock: yup.number().positive('Precisa ser um número positivo válido').required('Estoque obrigatório!'),
  category: yup.number().positive().integer().required('Categoria obrigatoria!'),
  subCategory: yup.number().positive().integer().required('Sub Categoria obrigatoria!'),
})

export const loginSchema = yup.object({
  email: yup.string().email('Insira um e-mail válido!').required('Nome obrigatório!'),
  password: yup.string().required('Preço obrigatório!'),
})