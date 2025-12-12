export interface CadastroCursoDataForm {
  nome: string;
  plataformaInstituicao: string;
  dataConclusao: string;
  emAndamento: boolean;
  cargaHoraria: string;
  habilidadeSelecionada?: string;
  habilidadesDesenvolvidas: string[];
  link: string;
  imagens: string[];
}

export interface IPostCurso {
  nome: string;
  plataformaInstituicao: string;
  dataConclusao: string;
  emAndamento: boolean;
  cargaHoraria: string;
  habilidadesDesenvolvidas: {
    nome: string;
    id: string;
  }[];
  link: string;
  imagens: string[];
  idUser: string;
}

export interface IGetCurso {
  id: string;
  nome: string;
  plataformaInstituicao: string;
  dataConclusao: string;
  emAndamento: boolean;
  cargaHoraria: string;
  habilidadesDesenvolvidas: {
    nome: string;
    id: string;
  }[];
  link: string;
  imagens: string[];
  idUser: string;
}