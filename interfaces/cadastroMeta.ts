export type TypeStatusMeta = 'planejado' | 'em andamento' | 'concluído';

export interface CadastroMetaDataForm {
  titulo: string;
  descricao: string;
  habilidadeSelecionada?: string;
  habilidadesRelacionadas: string[];
  prazoConclusao: string;
  status: TypeStatusMeta;
}

export interface IPostMeta {
  titulo: string;
  descricao: string;
  habilidadesRelacionadas: {
    nome: string;
    id: string;
  }[];
  prazoConclusao: string;
  status: TypeStatusMeta;
  idUser: string;
}

export interface IGetMeta {
  id: string;
  titulo: string;
  descricao: string;
  habilidadesRelacionadas: {
    nome: string;
    id: string;
  }[];
  prazoConclusao: string;
  status: string;
  idUser: string;
}