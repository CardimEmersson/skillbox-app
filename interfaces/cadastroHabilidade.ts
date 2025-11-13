export type TypeCursoProjeto = {
    id: number;
    descricao: string;
    tipo: "curso" | "projeto";
  };

export type TypeProficiencia = "iniciante" | "intermediario" | "avancado";

export interface CadastroHabilidadeDataForm {
  icone: string;
  nome: string;
  proficiencia: TypeProficiencia;
  categoriaSelecionada?: string;
  categorias: string[];
  cursoProjetoSelecionado?: number;
  cursosProjetos: TypeCursoProjeto[];
}

export interface IPostHabilidade {
  nome: string;
  proficiencia: TypeProficiencia;
  categorias: number[];
  cursosProjetos: TypeCursoProjeto[];
  idUser: string;
}

export interface IPostCategoria {
  idUser: string;
  nome: string;
}

export interface IGetCategoria {
  id: string;
  nome: string;
}

export interface IGetHabilidade {
  categorias: string[];
  cursosProjetos: string[]; 
  id: string; 
  idUser: string; 
  nome: string; 
  proficiencia: TypeProficiencia;
}