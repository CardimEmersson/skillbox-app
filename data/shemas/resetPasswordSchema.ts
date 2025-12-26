import * as yup from 'yup';

export const ResetPasswordSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  token: yup.string().required('Token é obrigatório'),
  senha: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
  confirmarSenha: yup.string()
    .oneOf([yup.ref('senha')], 'As senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
});
