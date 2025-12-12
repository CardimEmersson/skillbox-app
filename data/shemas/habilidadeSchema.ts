import * as Yup from 'yup';
import { errorMessages } from '../messages/errorMessages';

export const HabilidadeSchema = Yup.object().shape({
  icone: Yup.string(),
  nome: Yup.string().required(errorMessages.IS_REQUIRED),
  proficiencia: Yup.string().required(errorMessages.IS_REQUIRED),
});