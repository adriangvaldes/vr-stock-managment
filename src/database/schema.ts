import * as yup from "yup";

export const schema = yup.object({
  name: yup.string().required('Nome obrigatório!'),
  price: yup.number().positive('Precisa ser um número positivo válido').required('Preço obrigatório!'),
  category: yup.number().positive().integer().required('Categoria obrigatoria!'),
  subCategory: yup.number().positive().integer().required('Sub Categoria obrigatoria!'),
})