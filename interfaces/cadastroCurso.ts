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
  id: number;
  nome: string;
  plataforma_instituicao: string;
  prazo_conclusao: string;
  em_andamento: boolean;
  instructor: string;
  carga_horaria: string;
  link: string;
  habilidades: {
    id: number;
    nome: string;
    icone: string;
    nivel: string;
  }[];
  imagens: string[];
}