import { ImagePickerAsset } from "expo-image-picker";

export type TypeCursoProjeto = {
    id: number;
    descricao: string;
    tipo: "curso" | "projeto";
  };

export type TypeProficiencia = "iniciante" | "intermediario" | "avancado";

export interface CadastroHabilidadeDataForm {
  icone?: ImagePickerAsset;
  nome: string;
  proficiencia: TypeProficiencia;
  categoriaSelecionada?: number;
  categorias: number[];
  cursoProjetoSelecionado?: number;
  cursosProjetos: TypeCursoProjeto[];
}

export interface IPostHabilidade {
  nome: string;
  nivel: TypeProficiencia;
  categorias: number[];
}

export interface IPostCategoria {
  nome: string;
}

export interface IGetCategoria {
  id: number;
  nome: string;
}

export interface IGetHabilidade {
  id: number; 
  nome: string;
  icone: string;
  nivel: TypeProficiencia; 
  categorias: {
    id: number;
    nome: string;
  }[];
}