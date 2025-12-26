import * as yup from 'yup';

export const ConfirmAccountSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  token: yup.string()
    .matches(/^\d+$/, 'O token deve conter apenas números')
    .length(6, 'O token deve ter 6 dígitos')
    .required('Token é obrigatório'),
});