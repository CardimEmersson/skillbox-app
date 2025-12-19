import { TypeCursoProjeto } from "./cadastroHabilidade";

export interface CadastroProjetoDataForm {
  nome: string;
  periodo: string;
  habilidadeSelecionada?: string;
  habilidadesUtilizadas: string[];
  tipoProjeto: string;
  descricao: string;
  link: string;
  cursoSelecionado?: number;
  cursos: TypeCursoProjeto[];
  imagens: string[];
}

export interface IPostProjeto {
  nome: string;
  periodo: string;
  habilidadesUtilizadas: {
    nome: string;
    id: string;
  }[];
  tipoProjeto: string;
  descricao: string;
  link: string;
  cursos: string[];
  idUser: string;
  imagens: string[];
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
}

export interface IGetProjetoById extends IGetProjeto {
  habilidades: {
    id: number;
    nome: string;
    icone: string;
    nivel: string;
  }[];
  cursos: any[]
}