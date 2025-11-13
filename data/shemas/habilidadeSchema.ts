import * as Yup from 'yup';
import { errorMessages } from '../messages/errorMessages';

export const HabilidadeSchema = Yup.object().shape({
  icone: Yup.string(),
  nome: Yup.string().required(errorMessages.IS_REQUIRED),
  proficiencia: Yup.string().required(errorMessages.IS_REQUIRED),
  categorias: Yup.array().of(Yup.string()),
  // cursosProjetos: Yup.array().of(Yup.object().shape({
  //   id: Yup.number(),
  //   descricao: Yup.string(),
  //   tipo: Yup.number(),
  // }))
});