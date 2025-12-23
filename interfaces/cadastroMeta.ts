export type TypeStatusMeta = 'planejado' | 'em andamento' | 'concluído';

export interface CadastroMetaDataForm {
  titulo: string;
  descricao: string;
  habilidadeSelecionada?: number;
  habilidadesRelacionadas: number[];
  prazoConclusao: string;
  status: TypeStatusMeta;
}

export interface IPostMeta {
  nome: string;
  descricao: string;
  habilidades: string[];
  prazo_conclusao: string;
  status: TypeStatusMeta;
}

export interface IGetMeta {
  id: number;
  nome: string;
  descricao: string;
  prazo_conclusao: string;
  status: string;
  habilidades: {
    id: number;
    nome: string;
    icone: string;
    nivel: string;
  }[];
}