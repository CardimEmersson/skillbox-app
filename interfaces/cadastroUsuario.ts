import { ImagePickerAsset } from "expo-image-picker";

export type TypeNivelFormacao = 'fundamental' | 'medio' | 'tecnico' | 'graduacao' | 'pos_graduacao' | 'mestrado' | 'doutorado';

export interface CadastroUsuarioDataForm {
  nome: string;
  sobrenome: string;
  email: string;
  localizacao: string;
  dataNascimento: string;
  telefone: string;
  nivelFormacao: TypeNivelFormacao;
  instituicao: string;
  objetivoProfissional: string;
  areaSelecionada?: string; 
  bio: string;
  linkedin: string;
  github: string;
  site: string;
  imagem?: ImagePickerAsset;
}

export interface IPutUsuario {
  nome: string;
  sobrenome: string;
  email: string;
  localizacao: string;
  dataNascimento: string;
  telefone: string;
  nivelFormacao: 'fundamental' | 'medio' | 'tecnico' | 'graduacao' | 'pos_graduacao' | 'mestrado' | 'doutorado';
  instituicao: string;
  objetivoProfissional: string;
  areasUtilizadas: {
    nome: string;
    id: string;
  }[];
  bio: string;
  linkedin: string;
  github: string;
  site: string;
  imagem: string;
  senha: string;
}

export interface IGetUsuario {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  bio: string;
  localizacao: string;
  nivel_formacao: string;
  instituicao: string;
  objetivo_profissional: string;
  area_interesse: string;
  linkedin: string;
  github: string;
  site: string;
  avatar: string;
}

export interface IPutUsuarioResponse {
  area_interesse: string; 
  avatar_url: string; 
  bio: string; 
  created_at: string; 
  dataNascimento: string; 
  deleted_at: string | null; 
  email: string; 
  github: string; 
  instituicao: string; 
  linkedin: string; 
  localizacao: string; 
  nivel_formacao: string; 
  nome: string; 
  objetivo_profissional: string;
  site: string; 
  sobrenome: string; 
  telefone: string; 
  updated_at: string;
}

export interface IPostConfirmarConta {
  email: string;
  token: string;
}

export interface IPostEsqueciSenha {
  email: string;
}

export interface IPostRedefinirSenha {
  email: string;
  token: string;
  novaSenha: string;
}

export interface IPostReenviarToken {
  email: string;
}