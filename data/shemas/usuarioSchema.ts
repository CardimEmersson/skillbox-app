import * as Yup from 'yup';
import { errorMessages } from '../messages/errorMessages';

export const UsuarioSchema = Yup.object().shape({
  nome: Yup.string().required(errorMessages.IS_REQUIRED),
  sobrenome: Yup.string().required(errorMessages.IS_REQUIRED),
  email: Yup.string().required(errorMessages.IS_REQUIRED).email(errorMessages.IS_EMAIL_INVALID),
  dataNascimento: Yup.string().required(errorMessages.IS_REQUIRED),
  telefone: Yup.string().required(errorMessages.IS_REQUIRED),
});