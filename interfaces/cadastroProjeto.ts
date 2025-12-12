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
}

export interface IGetProjeto {
  cursos: string[]; 
  descricao: string; 
  habilidadesUtilizadas: {
    nome: string;
    id: string;
  }[]; 
  id: string; 
  idUser: string; 
  link: string; 
  nome: string;
  periodo: string;
  tipoProjeto: string;
}