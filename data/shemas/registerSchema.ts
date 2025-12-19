import * as Yup from 'yup';
import { errorMessages } from '../messages/errorMessages';

export const RegisterSchema = Yup.object().shape({
  nome: Yup.string().required(errorMessages.IS_REQUIRED),
  sobrenome: Yup.string().required(errorMessages.IS_REQUIRED),
  email: Yup.string().required(errorMessages.IS_REQUIRED).email(errorMessages.IS_EMAIL_INVALID),
  dataNascimento: Yup.string().required(errorMessages.IS_REQUIRED),
  telefone: Yup.string(),
  senha: Yup.string().required(errorMessages.IS_REQUIRED).min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref('senha')], 'As senhas devem ser iguais')
    .required(errorMessages.IS_REQUIRED)
});