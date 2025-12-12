import * as Yup from 'yup';
import { errorMessages } from '../messages/errorMessages';

export const CursoSchema = Yup.object().shape({
  nome: Yup.string().required(errorMessages.IS_REQUIRED),
  plataformaInstituicao: Yup.string().required(errorMessages.IS_REQUIRED),
  dataConclusao: Yup.string(),
  emAndamento: Yup.boolean(),
  cargaHoraria: Yup.string().required(errorMessages.IS_REQUIRED),
  link: Yup.string(),
});