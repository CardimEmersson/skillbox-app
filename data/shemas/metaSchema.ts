import * as Yup from 'yup';
import { errorMessages } from '../messages/errorMessages';

export const MetaSchema = Yup.object().shape({
  titulo: Yup.string().required(errorMessages.IS_REQUIRED),
  descricao: Yup.string().required(errorMessages.IS_REQUIRED),
  prazoConclusao: Yup.string().required(errorMessages.IS_REQUIRED),
  status: Yup.string().required(errorMessages.IS_REQUIRED)
});