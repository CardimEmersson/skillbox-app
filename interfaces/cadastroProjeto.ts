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
  imagens: string[];
}