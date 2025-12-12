import * as Yup from 'yup';
import { errorMessages } from '../messages/errorMessages';

export const ProjetoSchema = Yup.object().shape({
  nome: Yup.string().required(errorMessages.IS_REQUIRED),
  periodo: Yup.string().required(errorMessages.IS_REQUIRED),
  tipoProjeto: Yup.string().required(errorMessages.IS_REQUIRED),
  descricao: Yup.string().required(errorMessages.IS_REQUIRED),
  link: Yup.string(),
  cursos: Yup.array().of(Yup.object().shape({
    id: Yup.number(),
    descricao: Yup.string(),
    tipo: Yup.number(),
  })),
  imagens: Yup.array().of(Yup.string()),
});