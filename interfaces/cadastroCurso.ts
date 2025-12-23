import { ImagePickerAsset } from "expo-image-picker";

export interface CadastroCursoDataForm {
  nome: string;
  plataformaInstituicao: string;
  dataConclusao: string;
  emAndamento: boolean;
  cargaHoraria: string;
  habilidadeSelecionada?: number;
  habilidadesDesenvolvidas: number[];
  link: string;
  imagens: ImagePickerAsset[];
}

export interface IPostCurso {
  nome: string;
  plataforma_instituicao: string;
  prazo_conclusao: string;
  em_andamento: boolean;
  instructor: string;
  carga_horaria: string;
  link: string;
  habilidades: number[];
  imagens: string[];
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
  imagens: {
    id: number;
    imagem_url: string;
    uploaded_at: string;
  }[];
}