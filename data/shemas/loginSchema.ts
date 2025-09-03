import * as Yup from 'yup';
import { errorMessages } from '../messages/errorMessages';

export const LoginSchema = Yup.object().shape({
  login: Yup.string().required(errorMessages.IS_REQUIRED).email(errorMessages.IS_EMAIL_INVALID),
  senha: Yup.string().required(errorMessages.IS_REQUIRED),
});