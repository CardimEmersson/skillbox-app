import { ImagePickerAsset } from "expo-image-picker";
import { TypeCursoProjeto } from "./cadastroHabilidade";

export interface CadastroProjetoDataForm {
  nome: string;
  periodo: string;
  habilidadeSelecionada?: number;
  habilidadesUtilizadas: number[];
  tipoProjeto: string;
  descricao: string;
  link: string;
  cursoSelecionado?: number;
  cursos: TypeCursoProjeto[];
  imagens: ImagePickerAsset[];
}

export interface IPostProjeto {
  nome: string;
  periodo_inicial: string;
  periodo_final: string;
  tipo_projeto: string;
  descricao: string;
  link: string;
  imagens: string[];
  editar_imagens_ids: number[];
  excluir_imagens_ids: number[];
  habilidades: number[];
  cursos: number[];
}

export interface IGetProjeto {
  id: number;
  nome: string;
  periodo_inicial: string;
  periodo_final: string;
  tipo_projeto: string;
  descricao: string;
  link: string;
  imagens: {
    id: number;
    imagem_url: string;
    uploaded_at: string;
  }[];
  habilidades: {
    habilidade_id: number;
    nome: string;
    nivel: string;
  }[];
  cursos: {
    curso_id: number;
    nome: string;
    plataforma_instituicao: string;
    prazo_conclusao: string;
  }[];
}

export interface IGetProjetoById extends IGetProjeto {}